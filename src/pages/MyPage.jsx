import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Pages.css';
import { useAuth } from '../component/AuthContext';

const MyPage = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
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

  const handleUpdateUserInfo = async (field, value) => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/update-user', {
        id: user.id,
        [field]: value,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || '오류 발생');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword.length < 6) {
      setMessage('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/change-password', {
        id: user.id,
        currentPassword,
        newPassword,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || '오류 발생');
    } finally {
      setIsLoading(false);
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
        <button onClick={() => handleUpdateUserInfo('email', email)} disabled={isLoading}>
          {isLoading ? '저장 중...' : '저장'}
        </button>
      </div>
      <div>
        <h3>생년월일</h3>
        <input
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          placeholder="생년월일 추가 또는 수정"
        />
        <button onClick={() => handleUpdateUserInfo('birthday', birthday)} disabled={isLoading}>
          {isLoading ? '저장 중...' : '저장'}
        </button>
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
        <button onClick={handleUpdatePassword} disabled={isLoading}>
          {isLoading ? '변경 중...' : '비밀번호 변경'}
        </button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default MyPage;
