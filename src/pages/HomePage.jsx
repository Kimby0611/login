import React, { useEffect, useState, useRef } from 'react';
import Modal from '../component/Modal';
import loginImage from '../login.png';
import { useAuth } from '../component/AuthContext';
import './Pages.css';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nickname, setNickname] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // 드롭다운 상태 추가
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = (nickname) => {
    setIsModalOpen(false);
    if (nickname) {
      setNickname(nickname);
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('nickname');
    setNickname(null);
  };

  useEffect(() => {
    if (user && user.nickname) {
      setNickname(user.nickname);
      localStorage.setItem('nickname', user.nickname);
    }
  }, [user]);

  const handleMyPage = () => {
    navigate('/mypage');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleNewWrite = () => {
    navigate('/newwrite')
  }

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown(); // 외부 클릭 시 드롭다운 닫기
      }
    };

    document.addEventListener('mousedown', handleClickOutside); // 이벤트 추가
    return () => {
      document.removeEventListener('mousedown', handleClickOutside); // 이벤트 제거
    };
  }, []);

  return (
    <div className="center">
      <div className="home-component">
        <h2>홈페이지</h2>
        {nickname ? (
          <div className="login-user" ref={dropdownRef}>
          <p onClick={toggleDropdown} className="nickname">
            {nickname}
          </p>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <button onClick={handleMyPage}>프로필 보기</button>
                <button onClick={handleNewWrite}>글쓰기</button>
                <button onClick={handleLogout}>로그아웃</button>
              </div>
            )}
          </div>
        ) : (
          <div className="home-login-button">
            <button onClick={openModal}>
              <img src={loginImage} alt="로그인" />
            </button>
          </div>
        )}
      </div>
      {isModalOpen && <Modal isOpen={isModalOpen} closeModal={closeModal} />}
    </div>
  );
};

export default HomePage;
