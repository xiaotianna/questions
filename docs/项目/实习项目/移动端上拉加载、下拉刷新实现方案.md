# 移动端上拉加载、下拉刷新实现方案

## 上拉加载

长列表，需要通过上拉加载提示性能

### 实现步骤

1. 滚动事件监听
2. 怎么判断触底
3. 回调触发列表加载更多

```html
<div id="list"></div>
<script>
  const list = document.getElementById('list')
  let page = 1
  function loadMoreData(page) {
    return fetch(`https://example.com/api/data?page=${page}`)
      .then((response) => response.json())
      .then((data) => {
        data.forEach((item) => {
          const li = document.createElement('li')
          li.textContent = item.name
          list.appendChild(li)
        })
      })
  }

  function handleScroll() {
    // 触底距离：10
    if (list.scrollTop + list.clientHeight >= list.scrollHeight - 10) {
      page++
      loadMoreData(page)
    }
  }

  list.addEventListener('scroll', handleScroll)

  // 初始化数据
  loadMoreData(page)
</script>
```

## 下拉刷新

在用户页面顶部向下拉时，触发页面刷新，重新渲染

### 实现步骤

1. 监听触摸事件，touch、tap
2. 显示刷新指示器，显示有没有达到下拉阈值
3. 触发刷新操作

```html
<div id="list">
  <div id="refreshIndicator"></div>
</div>
<script>
  const list = document.getElementById('list')
  const refreshIndicator = document.getElementById('refreshIndicator')
  let startY = 0
  let isPulling = false

  function loadData() {
    return fetch(`https://example.com/api/data`)
      .then((response) => response.json())
      .then((data) => {
        list.innerHTML = '' // 清空现有数据
        data.forEach((item) => {
          const li = document.createElement('li')
          li.textContent = item.name
          list.appendChild(li)
        })
        refreshIndicator.style.display = 'none' // 隐藏刷新指示器
      })
  }

  list.addEventListener('touchstart', (e) => {
    if (list.scrollTop === 0) {
      startY = e.touches[0].clientY
      isPulling = true
    }
  })

  list.addEventListener('touchmove', (e) => {
    if (isPulling) {
      const currentY = e.touches[0].pageY
      if (currentY > startY) {
        {
          refreshIndicator.style.display = 'block'
          refreshIndicator.style.height = `${currentY - startY}px`
        }
      }
    }
  })

  list.addEventListener('touchend', (e) => {
    if (isPulling) {
      const refreshHeight = parseInt(refreshIndicator.style.height, 10)
      if (refreshHeight >= 50) {
        loadData()
      } else {
        refreshIndicator.style.display = 'none'
      }
      isPulling = false
      refreshIndicator.style.height = '50px'
    }
  })

  loadData()
</script>
```

## 考虑的点

### 性能优化

- 节流防抖
- 懒加载

### 用户体验

- 视觉反馈，下拉刷新指示器
- 平滑动画
- 错误处理

### 兼容

- 触摸事件
- css hack （css 兼容）