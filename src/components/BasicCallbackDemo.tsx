import React, { useState, useCallback } from 'react';

// Child component that receives a callback
const ChildComponent: React.FC<{ 
  onClick: () => void;
  label: string;
  renderCount: React.MutableRefObject<number>;
}> = React.memo(({ onClick, label, renderCount }) => {
  renderCount.current++;
  
  return (
    <div className="child-component">
      <p>子组件 (Child Component): {label}</p>
      <button className="button" onClick={onClick}>
        点击我 (Click me)
      </button>
      <span className="render-count">
        渲染次数 (Render count): {renderCount.current}
      </span>
    </div>
  );
});

const BasicCallbackDemo: React.FC = () => {
  const [count, setCount] = useState(0);
  const [otherState, setOtherState] = useState(0);
  
  // 渲染计数器
  const withoutCallbackRenderCount = React.useRef(0);
  const withCallbackRenderCount = React.useRef(0);

  // 没有使用 useCallback - 每次重新渲染都会创建新函数
  const handleClickWithoutCallback = () => {
    setCount(prev => prev + 1);
  };

  // 使用 useCallback - 函数被记忆化，只有在依赖项改变时才重新创建
  const handleClickWithCallback = useCallback(() => {
    setCount(prev => prev + 1);
  }, []); // 空依赖数组，函数永远不会重新创建

  return (
    <div className="demo-section">
      <h2>1. 基础 useCallback 示例 (Basic useCallback Example)</h2>
      <p>
        对比使用和不使用 useCallback 的区别。注意子组件的重新渲染次数。
        Compare the difference between using and not using useCallback. Notice the re-render count of child components.
      </p>
      
      <div>
        <p>计数器 (Counter): {count}</p>
        <p>其他状态 (Other state): {otherState}</p>
        
        <button 
          className="button" 
          onClick={() => setOtherState(prev => prev + 1)}
        >
          更新其他状态 (Update other state)
        </button>
      </div>

      <ChildComponent
        onClick={handleClickWithoutCallback}
        label="不使用 useCallback (Without useCallback)"
        renderCount={withoutCallbackRenderCount}
      />

      <ChildComponent
        onClick={handleClickWithCallback}
        label="使用 useCallback (With useCallback)"
        renderCount={withCallbackRenderCount}
      />

      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
        <strong>解释 (Explanation):</strong>
        <ul>
          <li>不使用 useCallback: 每次父组件重新渲染时，都会创建新的函数引用，导致子组件也重新渲染</li>
          <li>使用 useCallback: 函数引用保持不变，子组件不会因为函数引用改变而重新渲染</li>
        </ul>
        <ul>
          <li>Without useCallback: A new function reference is created on every parent re-render, causing child re-renders</li>
          <li>With useCallback: Function reference stays the same, preventing unnecessary child re-renders</li>
        </ul>
      </div>
    </div>
  );
};

export default BasicCallbackDemo;