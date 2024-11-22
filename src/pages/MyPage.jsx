import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Pages.css';
import { useAuth } from '../component/AuthContext';

const MyPage = () => {
  const { user, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // 유저 정보 가져오기 (백엔드 호출)
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/user-info`, {
          params: { id: user.id },
        });
        setEmail(response.data.email || '');
        setBirthday(response.data.birthday || '');
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    fetchUserInfo();
  }, [user]);

  const handleUpdatePassword = async () => {
    try {
      const response = await axios.post('http://localhost:5000/update-password', {
        id: user.id,
        currentPassword,
        newPassword,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || '오류 발생');
    }
  };

  const handleUpdateEmail = async () => {
    try {
      const response = await axios.post('http://localhost:5000/update-email', {
        id: user.id,
        email,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || '오류 발생');
    }
  };

  const handleUpdateBirthday = async () => {
    try {
      const response = await axios.post('http://localhost:5000/update-birthday', {
        id: user.id,
        birthday,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || '오류 발생');
    }
  };

  return (
    <div className="mypage">
      <h2>마이페이지</h2>
      <p>닉네임: {user.nickname}</p>
      <div>
        <h3>이메일</h3>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일 추가 또는 수정"
        />
        <button onClick={handleUpdateEmail}>저장</button>
      </div>
      <div>
        <h3>생년월일</h3>
        <input
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          placeholder="생년월일 추가 또는 수정"
        />
        <button onClick={handleUpdateBirthday}>저장</button>
      </div>
      <div>
        <h3>비밀번호 변경</h3>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="현재 비밀번호"
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="새 비밀번호"
        />
        <button onClick={handleUpdatePassword}>비밀번호 변경</button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default MyPage;
