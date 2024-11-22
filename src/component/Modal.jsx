import React, { useState } from 'react';
import './Component.css'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';

const Modal = ({ isOpen, closeModal }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', {
        id,
        password,
      });

      if (response.status === 200) {
        // 로그인 성공 후 nickname을 상태에 저장하고, closeModal에 전달
        login(response.data.user.nickname);
        closeModal(response.data.user.nickname);  // 닫을 때 nickname 전달
      } else {
        alert(response.data.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      alert(error.response?.data?.message || '서버 오류');
    }
  };

  const handelRegister = () => {
    navigate('/register');
  };

  return (
    <div className='overlay'>
      <div className='modal'>
        <h2>Login</h2>
        <hr className='divider' />
        <div className='login-input-form'>
          <input
            id='username'
            type='text'
            placeholder='아이디를 입력하세요'
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <input
            id='password'
            type='password'
            placeholder='비밀번호를 입력하세요'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className='login-text-form'>
          <span onClick={handleLogin}>로그인</span>
          <p className='separator'>|</p>
          <span onClick={handelRegister}>회원가입</span>
        </div>
        <button className='close-button' onClick={() => closeModal(null)}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default Modal;
