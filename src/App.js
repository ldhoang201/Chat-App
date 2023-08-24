import logo from './logo.svg';
import './App.css';
import { Routes, Route } from "react-router-dom"
import Login from './components/Login';
import ChatRoom from './components/ChatRoom';
import AuthProvider from './components/Context/AuthProvider';


function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<ChatRoom />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
