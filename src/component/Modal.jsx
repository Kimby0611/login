import React, { useState } from 'react';
import './Component.css'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Modal = ({ isOpen, closeModal }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  //로그인 처리 함수
  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || '로그인 실패');
      }
  

      login(data.user.id, data.user.nickname, data.user.email, data.user.birthday); 
      alert('로그인 성공!');
      closeModal(); 
    } catch (error) {
      alert(error.message);
    }
  };

  //회원가입 페이지 이동
  const handleRegister = () => {
    navigate('/register');
  };

  //오버레이 클릭 시 모달 닫기
  const handleOverlayClick = () => {
    closeModal(null);
  };
  
  //모달 내부 이벤트 차단
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className='overlay' onClick={handleOverlayClick}>
      <div className='modal' onClick={handleModalClick}>
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
          <span onClick={handleRegister}>회원가입</span>
        </div>
      </div>
    </div>
  );
};

export default Modal;
