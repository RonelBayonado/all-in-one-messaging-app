import './App.css';
import React, { useState } from 'react';
import Login from './components/login';
import Chat from './components/chat';

function App() {
  const [user, setUser] = useState(null);
  
  return (
    <div className="App">
      {user ? <Chat user={user} /> : <Login setUser={setUser} />}
    </div>
  );
}

export default App;
