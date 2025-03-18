# 算法题

## 问题 1：还原一棵树

实现 `buildTree` 方法

```js
const list = [
  { id: 'a2', label: '1', pid: 'a1' },
  { id: 'a3', label: '2', pid: 'a17' },
  { id: 'a1', label: '3', pid: 'root' },
  { id: 'a4', label: '4', pid: 'a3' },
  { id: 'a5', label: '5', pid: 'a4' },
  { id: 'ax', label: '6', pid: 'a5' },
  { id: 'ay', label: '7', pid: 'a5' },
  { id: 'a6', label: '8', pid: 'a4' },
  { id: 'a7', label: '9', pid: 'a6' },
  { id: 'a9', label: '10', pid: 'a7' },
  { id: 'a10', label: '11', pid: 'a9' },
  { id: 'a11', label: '12', pid: 'a10' },
  { id: 'a12', label: '13', pid: 'a10' },
  { id: 'a13', label: '14', pid: 'a10' },
  { id: 'a14', label: '15', pid: 'a11' },
  { id: 'a15', label: '16', pid: 'a12' },
  { id: 'a16', label: '17', pid: 'a13' },
  { id: 'a17', label: '18', pid: 'a2' }
]

function buildTree(node, list) {}

const tree = buildTree({ id: 'root', name: 'root', pid: null }, list)
console.log(JSON.stringify(tree))
```

**解析：**

```js
function buildTree(node, list) {
  const children = list.filter((item) => item.pid === node.id)
  if (children.length > 0) {
    node.children = children.map((item) => buildTree(item, list))
  }
  return node
}
```

## 问题 2：合并排序

给定两个已排序（升序）好的数组，将两个数组合并为一个新的数组，并使新数组仍然有序

```js
function mergeSort(arr1, arr2) {}

console.log(mergeSort([1, 3, 5], [2, 4, 6, 8])) // [1, 2, 3, 4, 5, 6, 8]
```

**解析**：双指针

```md
⬇️
1, 3, 5
2, 4, 6
⬆️
result = []
比较两个指针的值，小的放入 result 中，指针后移
```

```js
function mergeSort(arr1, arr2) {
  // arr1的指针
  let p1 = 0
  // arr2的指针
  let p2 = 0
  // 存放最后排序结果的数组
  const result = []

  while (p1 < arr1.length || p2 < arr2.length) {
    if (arr1[p1] < arr2[p2]) {
      // arr1[i] 比 arr2[j] 小
      result.push(arr1[p1])
      p1++
    } else if (arr1[p1] > arr2[p2]) {
      // arr1[i] 比 arr2[j] 大
      result.push(arr2[p2])
      p2++
    } else if (p1 >= arr1.length) {
      // arr1已经走完，将arr2剩余内容放入result中
      result.push(arr2[p2])
      p2++
    } else if (p2 >= arr2.length) {
      // arr2已经走完，将arr1剩余内容放入result中
      result.push(arr1[p1])
      p1++
    }
  }

  return result
}

console.log(mergeSort([1, 3, 5], [2, 4, 6, 8])) // [1, 2, 3, 4, 5, 6, 8]
```
