import './App.css';
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage';
import Register from './pages/Register';
import { AuthProvider } from './component/AuthContext';
import MyPage from './pages/MyPage';
import NewWrite from './pages/NewWrite';
import { CheckPassword } from './revise/CheckPassword';
import EditInfo from './revise/EditInfo';

const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path ='/' element = {<HomePage/>}/>
        <Route path ='/register' element = {<Register/>}/>
        <Route path ='/mypage' element = {<MyPage/>}/>
        <Route path ='/newwrite' element = {<NewWrite/>}/>
        <Route path ='/checkpassword' element = {<CheckPassword/>}/>
        <Route path = '/editinfo' element = {<EditInfo/>}/>
      </Routes>
    </Router>
  </AuthProvider>

);

export default App;