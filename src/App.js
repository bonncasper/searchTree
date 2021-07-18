import React, { useState } from 'react';
import { Tree, Input } from 'antd'
// import { getDeptList } from '@/services/dept'
// import { 
//   // getFathersById,
//   getParentKey,
//  } from '@/commons/utils'
// import { DeleteOutlined } from '@ant-design/icons'
// import './style.less'

const App = () => {
  const [expandedKeys, setExpandedKeys] = useState(['0-0', '0-0-0'])
  // const [treeData, setTreeData] = useState([]) //gData
  const [selectedKeys, setSelectedKeys] = useState([])
  const [checkedKeys, setCheckedKeys] = useState([])
  const [autoExpandParent, setAutoExpandParent] = useState(true)
  const [searchValue, setSearchValue] = useState('')

  // const x = 3;
  // const y = 2;
  // const z = 1;

  // 将树形节点改为一维数组
  const generateList = (data, dataList) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { key, title } = node;
      dataList.push({ key, title, });
      if (node.children) {
        generateList(node.children, dataList);
      }
    }
    return dataList
  }

  // 创建树形数据
  const treeData = [
    {
      title: 'parent 1',
      key: '0-0',
      children: [
        {
          title: 'parent 1-0',
          key: '0-0-0',
          disabled: false,
          children: [
            {
              title: 'leaf',
              key: '0-0-0-0',
              disableCheckbox: false,
            },
            {
              title: 'leaf',
              key: '0-0-0-1',
            },
          ],
        },
        {
          title: 'parent 1-1',
          key: '0-0-1',
          children: [{ title: '0-0-1-0', key: '0-0-1-0' }],
        },
      ],
    },
  ];

//define parentKey
const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};


  // 获取树形节点数据
  // const getList = async() => {
  //   // const res = await getDeptList()
  //   setTreeData(s)
  //   // handleTree(res.data)
  // }

  // 搜索节点
  const onChange = (e) => {
    
    let { value } = e.target
    value = String(value).trim()
    const dataList = generateList(treeData, [])
    let expandedKeys = dataList
      .map((item) => {
        if (item.title.indexOf(value) > -1) {
          // return getFathersById(treeData, item.key, 'key')
          return getParentKey(item.key, treeData)
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i)

    // expandedKeys = expandedKeys.length ? expandedKeys[0] : []
    console.log(26, expandedKeys)
    setExpandedKeys(expandedKeys)
    setAutoExpandParent(true)
    setSearchValue(value)
  }

  // 树节点展开/收缩
  const onExpand = (expandedKeys) => {
    console.log(22, expandedKeys)
    setExpandedKeys(expandedKeys)
    setAutoExpandParent(false)
  }

  // 选择节点
  const checkDep = (val, data) => {
    if (data && data.checkedNodes && data.checkedNodes.length) {
      let checkedNodes = [...data.checkedNodes]
      // console.log(1, val, data)

      setSelectedKeys(checkedNodes)
      setCheckedKeys(
        checkedNodes.map((subItem) => {
          return subItem.key
        }),
      )
    } else {
      setSelectedKeys([])
      setCheckedKeys([])
    }
  }

  // // 删除节点
  // const removeDep = (i) => {
  //   const checkedNodes = [...selectedKeys]
  //   checkedNodes.splice(i, 1)
  //   setSelectedKeys(checkedNodes)
  //   setCheckedKeys(
  //     checkedNodes.map((subItem) => {
  //       return subItem.key
  //     }),
  //   )
  // }

  // 处理搜索时树形数据高亮
  const loop = (data) =>
    data.map((item) => {
      const index = item.title.indexOf(searchValue);
      const beforeStr = item.title.substr(0, index);
      const afterStr = item.title.substr(index + searchValue.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span className="site-tree-search-value">{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{item.title}</span>
        );
      if (item.children) {
        return { title, key: item.key, children: loop(item.children) };
      }

      return {
        title,
        key: item.key,
      };
    })

  // useEffect(() => {
  //   getList()
  // }, [])

  return (
      <div>
        <div className="tree-contanier">
          <div className="left-content">
            <span>可搜索可控制选择的树形组件</span>
            <Input style={{ marginBottom: 8 }} allowClear placeholder="Search" onChange={onChange} />
            <Tree
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              checkable
              defaultExpandAll
              // onCheck={checkDep}
              checkedKeys={checkedKeys}
              checkStrictly
              treeData={loop(treeData)}
            />
          </div>
          {/* <div className="right-content">
            <span>已选择列表</span>
            <ul>
              {selectedKeys.map((item, i) => {
                return <li key={item.key} className="select-item">
                  {item.title}
                  <span className="remove" title="删除" onClick={() => removeDep(i)}><DeleteOutlined /></span>
                </li>
              })}
            </ul>
          </div> */}
        </div>
      </div>
  )
}

export default App;
