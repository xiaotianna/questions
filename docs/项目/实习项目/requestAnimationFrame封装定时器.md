# requestAnimationFrame 封装定时器

由于定时器不够精准，采用`requestAnimationFrame`封装定时器，来达到精准计时

> 需要用到 `requestAnimationFrame` 和 `cancelAnimationFrame`

```js
import { useState, useRef, useEffect } from 'react'

/**
 * 基于 requestAnimationFrame 的精准定时 Hook
 * @param {Function} callback - 达到间隔后执行的业务函数
 * @param {number} interval - 目标时间间隔（单位：ms）
 * @returns {Object} 控制方法：start(启动)、pause(暂停)、reset(重置)
 */
function useAccurateInterval(callback, interval = 1000) {
  // 1. 状态与 Ref：isRunning(运行状态)、startTime(起始时间)、rafId(rAF标识)
  const [isRunning, setIsRunning] = useState(false)
  const startTimeRef = useRef(0) // 记录定时器启动时的时间戳
  const rafIdRef = useRef(null) // 记录当前 rAF 的 ID，用于清除

  // 2. 核心定时逻辑：递归调用 rAF，计算真实耗时
  const runTimer = (timestamp) => {
    // 首次执行时，记录起始时间
    if (startTimeRef.current === 0) {
      startTimeRef.current = timestamp
    }

    // 计算当前已耗时（timestamp 是 rAF 回调的当前时间戳）
    const elapsed = timestamp - startTimeRef.current

    // 若耗时 >= 目标间隔，执行回调并重置起始时间
    if (elapsed >= interval) {
      callback() // 触发业务逻辑
      startTimeRef.current = timestamp // 重置计时起点（避免累计误差）
    }

    // 递归注册下一次 rAF（确保持续运行）
    rafIdRef.current = requestAnimationFrame(runTimer)
  }

  // 3. 控制方法：启动、暂停、重置
  const start = () => {
    if (!isRunning) {
      setIsRunning(true)
      // 启动时注册第一次 rAF
      rafIdRef.current = requestAnimationFrame(runTimer)
    }
  }

  const pause = () => {
    setIsRunning(false)
    // 暂停时清除当前 rAF，终止循环
    cancelAnimationFrame(rafIdRef.current)
    rafIdRef.current = null
  }

  const reset = () => {
    pause() // 先暂停
    startTimeRef.current = 0 // 重置起始时间
  }

  // 4. 组件卸载时清除 rAF，避免内存泄漏
  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [])

  return { start, pause, reset, isRunning }
}

// 使用示例
function Demo() {
  const [count, setCount] = useState(0)

  // 1秒刷新一次计数（精准计时）
  const { start, pause, reset } = useAccurateInterval(() => {
    setCount((prev) => prev + 1)
  }, 1000)

  return (
    <div>
      <p>计数：{count}</p>
      <button onClick={start}>启动</button>
      <button onClick={pause}>暂停</button>
      <button onClick={reset}>重置</button>
    </div>
  )
}
```

::: details vue 版

```js
const useAccurateInterval = (callback, interval = 1000) => {
  const isRunning = ref(false)
  const startTime = ref(0) // 记录计时起始时间戳
  let rafId = null // 存储当前 rAF 标识

  // 核心定时逻辑：递归调用 rAF 并计算耗时
  const runTimer = (timestamp) => {
    if (startTime.value === 0) {
      startTime.value = timestamp
    }

    // 计算已流逝时间
    const elapsed = timestamp - startTime.value

    // 达到目标间隔时执行回调并重置计时起点
    if (elapsed >= interval) {
      callback()
      startTime.value = timestamp // 校准时间，避免误差累积
    }

    // 继续递归注册下一帧
    rafId = raf(runTimer)
  }

  // 启动定时器
  const start = () => {
    if (!isRunning.value) {
      isRunning.value = true
      rafId = raf(runTimer)
    }
  }

  // 暂停定时器
  const pause = () => {
    if (isRunning.value) {
      isRunning.value = false
      if (rafId) {
        caf(rafId)
        rafId = null
      }
    }
  }

  // 重置定时器（暂停并清空起始时间）
  const reset = () => {
    pause()
    startTime.value = 0
  }

  // 组件卸载时清理定时器，避免内存泄漏
  onUnmounted(() => {
    if (rafId) {
      caf(rafId)
    }
  })

  return {
    start,
    pause,
    reset,
    isRunning
  }
}

// 3. 使用示例
const count = ref(0)

// 创建一个 1 秒间隔的定时器
const { start, pause, reset } = useAccurateInterval(() => {
  count.value++
}, 1000)
```

:::
