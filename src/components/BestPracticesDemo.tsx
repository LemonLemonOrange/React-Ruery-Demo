import React, { useState, useCallback, useMemo } from 'react';

// 用户项组件
const UserItem: React.FC<{
  user: { id: number; name: string; email: string };
  onDelete: (id: number) => void;
  onEdit: (id: number, name: string) => void;
}> = React.memo(({ user, onDelete, onEdit }) => {
  console.log(`UserItem ${user.id} rendered`);
  
  return (
    <div style={{ 
      padding: '10px', 
      margin: '5px 0', 
      border: '1px solid #ddd', 
      borderRadius: '4px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <strong>{user.name}</strong>
        <div style={{ fontSize: '12px', color: '#666' }}>{user.email}</div>
      </div>
      <div>
        <button 
          className="button" 
          onClick={() => onEdit(user.id, prompt('新名称 (New name):') || user.name)}
          style={{ marginRight: '5px' }}
        >
          编辑 (Edit)
        </button>
        <button 
          className="button" 
          onClick={() => onDelete(user.id)}
          style={{ backgroundColor: '#dc3545' }}
        >
          删除 (Delete)
        </button>
      </div>
    </div>
  );
});

// 用户列表组件
const UserList: React.FC<{
  users: Array<{ id: number; name: string; email: string }>;
  onDeleteUser: (id: number) => void;
  onEditUser: (id: number, name: string) => void;
}> = React.memo(({ users, onDeleteUser, onEditUser }) => {
  console.log('UserList rendered');
  
  return (
    <div>
      <h4>用户列表 (User List) - {users.length} users</h4>
      {users.map(user => (
        <UserItem
          key={user.id}
          user={user}
          onDelete={onDeleteUser}
          onEdit={onEditUser}
        />
      ))}
    </div>
  );
});

const BestPracticesDemo: React.FC = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com' }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [counter, setCounter] = useState(0);

  // ✅ 好的实践：使用 useCallback 优化传递给子组件的函数
  const handleDeleteUser = useCallback((id: number) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  }, []);

  const handleEditUser = useCallback((id: number, newName: string) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === id ? { ...user, name: newName } : user
      )
    );
  }, []);

  const handleAddUser = useCallback(() => {
    const newId = Math.max(...users.map(u => u.id)) + 1;
    const newUser = {
      id: newId,
      name: `User ${newId}`,
      email: `user${newId}@example.com`
    };
    setUsers(prev => [...prev, newUser]);
  }, [users]); // 依赖于 users 以获取正确的 ID

  // ✅ 好的实践：结合 useMemo 和 useCallback
  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  // ✅ 好的实践：搜索处理函数的防抖效果可以通过 useCallback 实现
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  return (
    <div className="demo-section">
      <h2>4. 最佳实践示例 (Best Practices Example)</h2>
      <p>
        在实际应用中如何正确使用 useCallback 来优化性能。
        How to properly use useCallback in real applications for performance optimization.
      </p>
      
      <div style={{ marginBottom: '20px' }}>
        <p>无关状态 (Unrelated state): {counter}</p>
        <button 
          className="button" 
          onClick={() => setCounter(prev => prev + 1)}
        >
          增加计数器 (Increment counter)
        </button>
        
        <div style={{ margin: '10px 0' }}>
          <input
            className="input"
            placeholder="搜索用户 (Search users)..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <button className="button" onClick={handleAddUser}>
            添加用户 (Add user)
          </button>
        </div>
      </div>

      <UserList
        users={filteredUsers}
        onDeleteUser={handleDeleteUser}
        onEditUser={handleEditUser}
      />

      <div style={{ marginTop: '30px' }}>
        <h3>最佳实践总结 (Best Practices Summary)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ padding: '15px', backgroundColor: '#d1edff', borderRadius: '4px' }}>
            <h4>✅ 何时使用 useCallback (When to use useCallback)</h4>
            <ul>
              <li>传递给使用 React.memo 的子组件的函数</li>
              <li>传递给其他 hooks 的依赖数组中的函数</li>
              <li>昂贵的计算或 API 调用函数</li>
              <li>Functions passed to React.memo child components</li>
              <li>Functions in dependency arrays of other hooks</li>
              <li>Expensive computation or API call functions</li>
            </ul>
          </div>
          
          <div style={{ padding: '15px', backgroundColor: '#f8d7da', borderRadius: '4px' }}>
            <h4>❌ 何时不需要 useCallback (When NOT to use useCallback)</h4>
            <ul>
              <li>简单的事件处理函数</li>
              <li>不传递给子组件的函数</li>
              <li>每次都需要重新创建的函数</li>
              <li>Simple event handlers</li>
              <li>Functions not passed to child components</li>
              <li>Functions that need to be recreated every time</li>
            </ul>
          </div>
        </div>
        
        <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
          <h4>💡 性能提示 (Performance Tips)</h4>
          <ul>
            <li>总是正确设置依赖数组，使用 ESLint 规则 exhaustive-deps</li>
            <li>结合 React.memo 使用以获得最佳效果</li>
            <li>不要过度使用，只在真正需要时使用</li>
            <li>考虑使用 useMemo 来记忆化计算结果</li>
            <li>Always set dependency arrays correctly, use ESLint rule exhaustive-deps</li>
            <li>Use with React.memo for best results</li>
            <li>Don't overuse, only use when really needed</li>
            <li>Consider using useMemo for memoizing computed values</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BestPracticesDemo;