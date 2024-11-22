import React, { useState } from 'react';
import './Pages.css';

const Register = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');
  const [isIdAvailable, setIsIdAvailable] = useState(true);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(true);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const validateId = (value) => {
    if (!value) return '필수 입력란입니다.';
    if (!/[a-zA-Z0-9]{4,19}$/.test(value)) {
      return '아이디: 5~20자의 영문 소문자와 숫자만 사용 가능합니다.';
    }
    return '';
  };

  const validatePassword = (value) => {
    if (!value) return '필수 입력란입니다.';
    const hasLetters = /[a-zA-Z]/.test(value);
    const hasNumbers = /\d/.test(value);
    const hasSpecialChars = /[!@#$%^&*]/.test(value);
    const noRepeatingNumbers = !/(.)\1/.test(value);

    if (!hasLetters || !hasNumbers || !hasSpecialChars) {
      return '비밀번호: 6~20자의 영문 대/소문자, 숫자, 특수문자를 사용해야 합니다.';
    }
    if (!noRepeatingNumbers) {
      return '비밀번호에 반복되는 숫자가 포함될 수 없습니다.';
    }
    return '';
  };

  const validateConfirmPassword = (value) => {
    if (value !== password) {
      return '비밀번호가 일치하지 않습니다.';
    }
    return '';
  };

  const validateNickname = (value) => {
    if (!value) return '필수 입력란입니다.';
    if (!/^[a-zA-Z0-9가-힣]*$/.test(value)) {
      return '닉네임:특수기호를 제외한 영문 대/소문자 한글 숫자만 사용 가능합니다.';
    }
    return '';
  };

  const validateEmail = (value) => {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return '유효한 이메일 주소를 입력해주세요.';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      id: validateId(id),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(confirmPassword),
      nickname: validateNickname(nickname),
      email: validateEmail(email),
    };

    if (!isIdAvailable) newErrors.id = '중복된 아이디입니다.';
    if (!isNicknameAvailable) newErrors.nickname = '중복된 닉네임입니다.'

    setErrors(newErrors);

    const isValid = Object.values(newErrors).every((error) => !error);
    if (isValid) {
      try {
        const response = await fetch('http://localhost:5000/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id, password, confirmPassword, nickname, email, birthday }),
        });

        const data = await response.json();

        if (response.ok) {
          setSuccessMessage(data.message);
          alert('회원가입 성공!');
          // 필요 시 입력 필드 초기화
          setId('');
          setPassword('');
          setConfirmPassword('');
          setNickname('');
          setEmail('');
          setBirthday('');
          setErrors({});
          setIsIdAvailable(true);
          setIsNicknameAvailable(true);
        } else {
          alert(data.error || '회원가입에 실패했습니다.');
        }
      } catch (error) {
        alert('서버 오류가 발생했습니다.');
        console.error(error);
      }
    }
  };

  const duplicateId = async () => {
    try {
      const response = await fetch(`http://localhost:5000/check-duplicate-id?id=${id}`);
      const data = await response.json();
      
      if (data.available) {
        setIsIdAvailable(true);
        setErrors((prev) => ({
          ...prev,
          id: '사용 가능한 아이디입니다.',
        }));
      } else {
        setIsIdAvailable(false);
        setErrors((prev) => ({
          ...prev,
          id: '중복된 아이디입니다.',
        }));
      }
    } catch (error) {
      console.error('아이디 중복 확인 오류:', error);
      setErrors((prev) => ({
        ...prev,
        id: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      }));
    }
  };

  const duplicateNickname = async () => {
    try {
      const response = await fetch(`http://localhost:5000/check-duplicate-nickname?nickname=${nickname}`);
      const data = await response.json();
      
      if (data.available) {
        setIsNicknameAvailable(true);
        setErrors((prev) => ({
          ...prev,
          nickname: '사용 가능한 닉네임입니다.',
        }));
      } else {
        setIsNicknameAvailable(false);
        setErrors((prev) => ({
          ...prev,
          nickname: '중복된 닉네임입니다.',
        }));
      }
    } catch (error) {
      console.error('닉네임 중복 확인 오류:', error);
      setErrors((prev) => ({
        ...prev,
        nickname: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='register-form'>
        <div>
          <input
            type="text"
            value={id}
            onChange={(e) => {
              setId(e.target.value);
              setIsIdAvailable(true);
            }}
            placeholder="아이디"
            required
          />
          <button type="button" onClick={duplicateId}>
            중복 확인
          </button>
        </div>
        {errors.id && <div className="error">
          <p>{errors.id}</p>
          </div>}

        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            required
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        <div>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="비밀번호 확인"
            required
          />
          {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
        </div>

        <div>
          <input
            type="text"
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value);
              setIsNicknameAvailable(true);
            }}
            placeholder="닉네임"
            required
          />
          <button type="button" onClick={duplicateNickname}>
            중복 확인
          </button>
        </div>
        {errors.nickname && <div className="error">
          <p>{errors.nickname}</p>
          </div>}

        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일"
          />
          <p>(선택)</p>
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div>
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            placeholder='(선택)'
          />
          <label>(선택)</label>
        </div>

        <button type="submit">Register</button>
        {successMessage && <p className="success">{successMessage}</p>}
      </div>
    </form>
  );
};

export default Register;
