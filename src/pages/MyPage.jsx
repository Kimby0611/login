import React, { useEffect, useState } from 'react';
import { useAuth } from '../component/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Pages.css';

const MyPage = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');
  const navigate = useNavigate();

  //상태 값 설정
  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setBirthday(formatDate(user.birthday) || '');
    }
  }, [user]);

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleEdit = () => {
    navigate('/checkpassword');
  }

  return (
    <div className="mypage">
      <h2>마이페이지</h2>
      <div className='mypage-info'>
      <p>닉네임 :</p> 
      <p>{user?.nickname}</p>
      </div>
      <div className='mypage-info'>
        <p>이메일 : </p>
        {user?.email ? <p>{email}</p> : <p>이메일을 입력해 주세요</p>}
      </div>
      <div className='mypage-info'>
        <p>생년월일 : </p>
        {user?.birthday ? <p>{birthday}</p> : <p>생년월일을 입력해 주세요</p>}
      </div>
            <div>
        <button onClick={handleEdit}>개인정보 수정</button>
      </div>
    </div>
  );
};

export default MyPage;
