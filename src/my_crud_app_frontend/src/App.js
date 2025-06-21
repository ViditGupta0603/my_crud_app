import React, { useState } from 'react';

function App() {
  const [message, setMessage] = useState('Hello from ICP CRUD App!');
  const [inputValue, setInputValue] = useState('');

  const handleClick = () => {
    setMessage(`You typed: ${inputValue}`);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>My CRUD App Frontend</h1>
      <p>{message}</p>
      
      <div style={{ marginTop: '20px' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter some text..."
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <button onClick={handleClick} style={{ padding: '8px 16px' }}>
          Update Message
        </button>
      </div>
      
      <div style={{ marginTop: '20px', color: '#666' }}>
        <small>Frontend is working! Backend integration coming next.</small>
      </div>
    </div>
  );
}

export default App;
