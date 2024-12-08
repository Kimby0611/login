import React, { useEffect, useState, useRef } from 'react';
import Modal from '../component/Modal';
import loginImage from '../login.png';
import { useAuth } from '../component/AuthContext';
import './Pages.css';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nickname, setNickname] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  //modal open및 close
  const openModal = () => setIsModalOpen(true);
  const closeModal = (nickname) => {
    setIsModalOpen(false);
    if (nickname) {
      setNickname(nickname);
    }
  };

  //logout
  const handleLogout = () => {
    logout();
    localStorage.removeItem('nickname');
    setNickname(null);
  };

  //localstorage에서 닉네임 가져오기
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

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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
                <button className='menu-item' onClick={handleMyPage}>프로필 보기</button>
                <button className='menu-item' onClick={handleNewWrite}>글쓰기</button>
                <button className='menu-item' onClick={handleLogout}>로그아웃</button>
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
