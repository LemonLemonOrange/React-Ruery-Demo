# React useCallback() 使用指南 Demo

这个项目演示了如何在 React 中正确使用 `useCallback` Hook 来优化组件性能。

This project demonstrates how to properly use the `useCallback` Hook in React for component performance optimization.

## 什么是 useCallback? (What is useCallback?)

`useCallback` 是 React 提供的一个 Hook，用于返回一个记忆化（memoized）的回调函数。它接受两个参数：
- 第一个参数是要记忆化的函数
- 第二个参数是依赖数组

`useCallback` is a React Hook that returns a memoized callback function. It takes two parameters:
- First parameter: the function to memoize
- Second parameter: dependency array

```javascript
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b]
);
```

## 项目结构 (Project Structure)

```
src/
├── components/
│   ├── BasicCallbackDemo.tsx      # 基础用法示例
│   ├── OptimizationDemo.tsx       # 性能优化示例
│   ├── DependencyArrayDemo.tsx    # 依赖数组示例
│   └── BestPracticesDemo.tsx      # 最佳实践示例
├── App.tsx                        # 主应用组件
├── main.tsx                       # 应用入口点
└── index.css                      # 样式文件
```

## 演示内容 (Demo Content)

### 1. 基础用法示例 (Basic Usage Example)
- 对比使用和不使用 `useCallback` 的区别
- 演示如何避免不必要的子组件重新渲染
- Shows the difference between using and not using `useCallback`
- Demonstrates how to avoid unnecessary child component re-renders

### 2. 性能优化示例 (Performance Optimization Example)
- 在复杂组件中使用 `useCallback` 的性能优势
- 结合 `React.memo` 实现最佳优化效果
- Performance benefits of using `useCallback` in complex components
- Best optimization results when combined with `React.memo`

### 3. 依赖数组示例 (Dependency Array Example)
- 正确设置依赖数组的重要性
- 常见的依赖数组错误及其后果
- Importance of correctly setting dependency arrays
- Common dependency array mistakes and their consequences

### 4. 最佳实践示例 (Best Practices Example)
- 实际应用场景中的 `useCallback` 使用
- 何时使用和何时不使用 `useCallback`
- Real-world usage scenarios of `useCallback`
- When to use and when not to use `useCallback`

## 运行项目 (Running the Project)

### 安装依赖 (Install Dependencies)
```bash
npm install
```

### 启动开发服务器 (Start Development Server)
```bash
npm run dev
```

### 构建生产版本 (Build for Production)
```bash
npm run build
```

## 核心概念 (Core Concepts)

### 何时使用 useCallback (When to Use useCallback)

✅ **推荐使用的场景 (Recommended scenarios):**
- 传递给使用 `React.memo` 的子组件的函数
- 传递给其他 hooks 依赖数组中的函数
- 昂贵的计算或 API 调用函数
- Functions passed to child components using `React.memo`
- Functions in dependency arrays of other hooks
- Expensive computation or API call functions

❌ **不推荐使用的场景 (Not recommended scenarios):**
- 简单的事件处理函数
- 不传递给子组件的函数
- 每次都需要重新创建的函数
- Simple event handlers
- Functions not passed to child components
- Functions that need to be recreated every time

### 依赖数组最佳实践 (Dependency Array Best Practices)

```javascript
// ✅ 正确：包含所有使用的变量
const handleClick = useCallback(() => {
  console.log(count, name);
}, [count, name]);

// ❌ 错误：遗漏依赖项
const handleClick = useCallback(() => {
  console.log(count, name);
}, [count]); // 遗漏了 name

// ✅ 正确：空数组用于不依赖任何变量的函数
const handleClick = useCallback(() => {
  console.log('Hello');
}, []);
```

## 性能监控 (Performance Monitoring)

项目中包含了渲染计数器，用于监控组件的重新渲染次数。打开浏览器的开发者工具控制台，可以看到组件渲染的日志信息。

The project includes render counters to monitor component re-render counts. Open browser developer tools console to see component rendering logs.

## 学习建议 (Learning Recommendations)

1. 先理解 React 的重新渲染机制
2. 学习 `React.memo` 的用法
3. 掌握 `useCallback` 的基本语法
4. 理解依赖数组的工作原理
5. 在实际项目中谨慎使用

1. First understand React's re-rendering mechanism
2. Learn how to use `React.memo`
3. Master the basic syntax of `useCallback`
4. Understand how dependency arrays work
5. Use carefully in real projects

## 相关资源 (Related Resources)

- [React 官方文档 - useCallback](https://react.dev/reference/react/useCallback)
- [React 官方文档 - React.memo](https://react.dev/reference/react/memo)
- [When to useMemo and useCallback](https://kentcdodds.com/blog/usememo-and-usecallback)

## 技术栈 (Tech Stack)

- React 18
- TypeScript
- Vite
- CSS3

## License

MIT