import React, { useState } from 'react';
import { useAuth } from '../component/AuthContext';
import { useNavigate } from 'react-router-dom';

const EditInfo = () => {
  const { user, updateUser } = useAuth();
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [email, setEmail] = useState(user?.email || '');
  const [birthday, setBirthday] = useState(user?.birthday || '');
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSave = async () => {
    try {
      const storedId = localStorage.getItem('userId');
  
      if (!user) {
        setError('로그인 상태가 아닙니다.');
        return;
      }
      const response = await fetch('http://localhost:5000/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: storedId,
          nickname,
          email,
          birthday,
        }),
      });
  
      const result = await response.json();
      if (response.ok && result.success) {
        localStorage.setItem('userId', storedId);
        localStorage.setItem('userNickname', nickname);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userBirthday', birthday);

        updateUser({nickname, email, birthday});
        navigate('/mypage');
      } else {
        setError('수정에 실패했습니다.');
      }
    } catch (err) {
      setError('오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleBirthdayChange = (e) => {
    setBirthday(e.target.value);
  };

  return (
    <div className="edit-profile">
      <div className='edit-profile-item'>
        <h2>개인정보 수정</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className='edit-profile-field'>
          <label>닉네임</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>
        <div className='edit-profile-field'>
          <label>이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className='edit-profile-field'>
          <label>생년월일</label>
          <input
            type="date"
            value={birthday}
            onChange={handleBirthdayChange}
          />
        </div>
        <div className='edit-profile-button'>
          <button className='edit-profile-button-save' onClick={handleSave}>저장</button>
          <button className='edit-profile-burron-cancle' onClick={() => navigate(-2)}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default EditInfo;
