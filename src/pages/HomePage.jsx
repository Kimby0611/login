import React, { useEffect, useState } from 'react';
import Modal from '../component/Modal';
import loginImage from '../login.png';
import { useAuth } from '../component/AuthContext';
import './Pages.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nickname, setNickname] = useState(null);
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();

  const openModal = () => setIsModalOpen(true);
  const closeModal = (nickname) => {
    setIsModalOpen(false);
    if (nickname) {
      setNickname(nickname);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/logout', {}, { withCredentials: true });
      logout();
      localStorage.removeItem('nickname'); // 로그아웃 시 닉네임 제거
      setNickname(null);
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('http://localhost:5000/auth-status', { withCredentials: true });
      const { id, nickname } = response.data;
      setNickname(nickname);
      localStorage.setItem('nickname', nickname); // 상태와 로컬 스토리지 동기화
      setUser(response.data);
    } catch (error) {
      console.log('로그인 상태 확인 실패:', error.response?.data?.message || error.message);
      setNickname(null);
      localStorage.removeItem('nickname'); // 만료된 경우 닉네임 제거
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const handleMyPage = () => {
    navigate('/mypage');
  };

  return (
    <div className='center'>
      <div className='home-component'>
        <h2>홈페이지</h2>
        {nickname ? (
          <div className='login-user'>
            <p onClick={handleMyPage}>{nickname}</p>
            <button onClick={handleLogout}>로그아웃</button>
          </div>
        ) : (
          <div className='home-login-button'>
            <button onClick={openModal}>
              <img src={loginImage} alt='로그인' />
            </button>
          </div>
        )}
      </div>
      {isModalOpen && <Modal isOpen={isModalOpen} closeModal={closeModal} />}
    </div>
  );
};

export default HomePage;
