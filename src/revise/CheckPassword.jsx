import React, { useState } from 'react'
import { useAuth } from '../component/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Revise.css';

export const CheckPassword = () => {
    const { user } = useAuth(); 
    const [currentPassword, setCurrentPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user || !user.id) {
            setMessage('로그인이 필요합니다.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/check-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: user.id, currentPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || '비밀번호 확인에 실패했습니다.');
            }

            setMessage('비밀번호가 확인되었습니다.');
            navigate('/editinfo');
        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <div className='check'>
            <h1>비밀번호 확인</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        현재 비밀번호 :
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <button type="submit">확인</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default CheckPassword;