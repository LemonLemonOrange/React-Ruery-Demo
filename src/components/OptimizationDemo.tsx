import React, { useState, useCallback } from 'react';

// 列表组件 - 使用 React.memo 优化
const ListComponent: React.FC<{
  items: string[];
  onFilter: (searchTerm: string) => void;
  renderCount: React.MutableRefObject<number>;
}> = React.memo(({ items, onFilter, renderCount }) => {
  renderCount.current++;
  
  return (
    <div className="child-component">
      <h4>列表组件 (List Component)</h4>
      <span className="render-count">
        渲染次数 (Render count): {renderCount.current}
      </span>
      
      <input
        className="input"
        placeholder="输入过滤条件 (Enter filter term)"
        onChange={(e) => onFilter(e.target.value)}
      />
      
      <ul className="list">
        {items.map((item, index) => (
          <li key={index} className="list-item">{item}</li>
        ))}
      </ul>
    </div>
  );
});

const OptimizationDemo: React.FC = () => {
  const [count, setCount] = useState(0);
  const [items] = useState(['apple', 'banana', 'cherry', 'date', 'elderberry']);
  const [filteredItems, setFilteredItems] = useState(items);
  
  const renderCountWithoutCallback = React.useRef(0);
  const renderCountWithCallback = React.useRef(0);

  // 没有使用 useCallback 的过滤函数
  const handleFilterWithoutCallback = (searchTerm: string) => {
    const filtered = items.filter(item => 
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  // 使用 useCallback 的过滤函数
  const handleFilterWithCallback = useCallback((searchTerm: string) => {
    const filtered = items.filter(item => 
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [items]); // 依赖于 items 数组

  return (
    <div className="demo-section">
      <h2>2. 性能优化示例 (Performance Optimization Example)</h2>
      <p>
        在有复杂子组件的情况下，useCallback 可以显著提高性能。
        When you have complex child components, useCallback can significantly improve performance.
      </p>
      
      <div>
        <p>计数器 (Counter): {count}</p>
        <button 
          className="button" 
          onClick={() => setCount(prev => prev + 1)}
        >
          增加计数器 (Increment counter)
        </button>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <h3>不使用 useCallback (Without useCallback)</h3>
          <ListComponent
            items={filteredItems}
            onFilter={handleFilterWithoutCallback}
            renderCount={renderCountWithoutCallback}
          />
        </div>

        <div style={{ flex: 1 }}>
          <h3>使用 useCallback (With useCallback)</h3>
          <ListComponent
            items={filteredItems}
            onFilter={handleFilterWithCallback}
            renderCount={renderCountWithCallback}
          />
        </div>
      </div>

      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e7f3ff', borderRadius: '4px' }}>
        <strong>性能对比 (Performance Comparison):</strong>
        <ul>
          <li>当父组件状态改变时（如点击计数器），左侧的列表组件会重新渲染</li>
          <li>右侧使用 useCallback 的列表组件不会因为无关状态变化而重新渲染</li>
          <li>When parent component state changes (like clicking counter), the left list component re-renders</li>
          <li>The right list component with useCallback doesn't re-render due to unrelated state changes</li>
        </ul>
      </div>
    </div>
  );
};

export default OptimizationDemo;