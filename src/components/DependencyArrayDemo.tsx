import React, { useState, useCallback } from 'react';

// 消息显示组件
const MessageDisplay: React.FC<{
  message: string;
  onSend: (msg: string) => void;
  renderCount: React.MutableRefObject<number>;
}> = React.memo(({ message, onSend, renderCount }) => {
  renderCount.current++;
  
  return (
    <div className="child-component">
      <h4>消息显示 (Message Display)</h4>
      <span className="render-count">
        渲染次数 (Render count): {renderCount.current}
      </span>
      <p>当前消息 (Current message): {message}</p>
      <button 
        className="button" 
        onClick={() => onSend('Hello from child!')}
      >
        发送消息 (Send message)
      </button>
    </div>
  );
});

const DependencyArrayDemo: React.FC = () => {
  const [message, setMessage] = useState('初始消息 (Initial message)');
  const [count, setCount] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  
  const renderCountEmpty = React.useRef(0);
  const renderCountWithDeps = React.useRef(0);
  const renderCountWrongDeps = React.useRef(0);

  // 1. 空依赖数组 - 函数永远不会重新创建
  const handleSendEmpty = useCallback((msg: string) => {
    setMessage(msg + ' (空依赖 Empty deps)');
  }, []); // 空依赖数组

  // 2. 正确的依赖数组 - 只有当 multiplier 改变时才重新创建
  const handleSendWithDeps = useCallback((msg: string) => {
    setMessage(msg + ` (乘数: ${multiplier}) (Multiplier: ${multiplier})`);
  }, [multiplier]); // 依赖于 multiplier

  // 3. 错误的依赖数组 - 遗漏了依赖项（这会导致问题）
  const handleSendWrongDeps = useCallback((msg: string) => {
    setMessage(msg + ` (计数: ${count}) (Count: ${count})`);
  }, []); // 错误：应该包含 count，但被遗漏了

  return (
    <div className="demo-section">
      <h2>3. 依赖数组示例 (Dependency Array Example)</h2>
      <p>
        useCallback 的第二个参数是依赖数组，决定了何时重新创建函数。
        The second parameter of useCallback is the dependency array, which determines when to recreate the function.
      </p>
      
      <div style={{ marginBottom: '20px' }}>
        <p>计数器 (Counter): {count}</p>
        <p>乘数 (Multiplier): {multiplier}</p>
        <p>消息 (Message): {message}</p>
        
        <button 
          className="button" 
          onClick={() => setCount(prev => prev + 1)}
        >
          增加计数器 (Increment counter)
        </button>
        
        <button 
          className="button" 
          onClick={() => setMultiplier(prev => prev + 1)}
        >
          增加乘数 (Increment multiplier)
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
        <div>
          <h4>空依赖数组 (Empty dependencies)</h4>
          <code>useCallback(fn, [])</code>
          <MessageDisplay
            message={message}
            onSend={handleSendEmpty}
            renderCount={renderCountEmpty}
          />
        </div>

        <div>
          <h4>正确依赖数组 (Correct dependencies)</h4>
          <code>useCallback(fn, [multiplier])</code>
          <MessageDisplay
            message={message}
            onSend={handleSendWithDeps}
            renderCount={renderCountWithDeps}
          />
        </div>

        <div>
          <h4>⚠️ 错误依赖数组 (Wrong dependencies)</h4>
          <code>useCallback(fn, [])</code>
          <MessageDisplay
            message={message}
            onSend={handleSendWrongDeps}
            renderCount={renderCountWrongDeps}
          />
        </div>
      </div>

      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8d7da', borderRadius: '4px' }}>
        <strong>⚠️ 重要提示 (Important Notes):</strong>
        <ul>
          <li><strong>空依赖数组:</strong> 函数永远不会重新创建，适用于不依赖任何状态的函数</li>
          <li><strong>正确依赖数组:</strong> 包含函数内部使用的所有状态和属性</li>
          <li><strong>错误依赖数组:</strong> 遗漏依赖项会导致闭包陷阱，函数获取到过期的值</li>
        </ul>
        <ul>
          <li><strong>Empty dependency array:</strong> Function never recreates, suitable for functions that don't depend on any state</li>
          <li><strong>Correct dependency array:</strong> Include all state and props used inside the function</li>
          <li><strong>Wrong dependency array:</strong> Missing dependencies lead to stale closure trap</li>
        </ul>
      </div>
    </div>
  );
};

export default DependencyArrayDemo;