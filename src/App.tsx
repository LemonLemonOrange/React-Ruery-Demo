import BasicCallbackDemo from './components/BasicCallbackDemo';
import OptimizationDemo from './components/OptimizationDemo';
import DependencyArrayDemo from './components/DependencyArrayDemo';
import BestPracticesDemo from './components/BestPracticesDemo';

function App() {
  return (
    <div className="container">
      <h1>React useCallback() 使用指南 (useCallback Usage Guide)</h1>
      <p>
        useCallback 是 React 的一个 Hook，用于返回一个记忆化的回调函数。
        它可以帮助避免不必要的重新渲染，提高应用性能。
      </p>
      <p>
        useCallback is a React Hook that returns a memoized callback function.
        It helps avoid unnecessary re-renders and improves application performance.
      </p>
      
      <BasicCallbackDemo />
      <OptimizationDemo />
      <DependencyArrayDemo />
      <BestPracticesDemo />
    </div>
  );
}

export default App;