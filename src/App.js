import logo from './logo.svg';
import './App.css';
import { Routes, Route } from "react-router-dom"
import Login from './components/Login';
import ChatRoom from './components/ChatRoom';
import AuthProvider from './Context/AuthProvider';
import AppProvider from './Context/AppProvider';
import AddRoom from './components/Models/AddRoom';
import InviteMember from './components/Models/InviteMember';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<ChatRoom />} />
        </Routes>
        <AddRoom />
        <InviteMember/>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
