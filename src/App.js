import './App.css';
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage';
import Register from './pages/Register';
import { AuthProvider } from './component/AuthContext';
import MyPage from './pages/MyPage';

const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path ='/' element = {<HomePage/>}/>
        <Route path ='/register' element = {<Register/>}/>
        <Route path ='/mypage' element = {<MyPage/>}/>
      </Routes>
    </Router>
  </AuthProvider>

);

export default App;