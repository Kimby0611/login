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

  //각 입력란 유효성 검사
  const validators = {
    id: (value) => {
      if (!value) return '필수 입력란입니다.';
      if (!/^[a-zA-Z0-9]{4,20}$/.test(value)) {
        return '4~20자의 영문 소문자와 숫자만 사용 가능합니다.';
      }
      return '';
    },
    password: (value) => {
      if (!value) return '필수 입력란입니다.';
      if (!/^[a-z0-9]{4,20}$/.test(value)) {
        return '4~20자리의 영문 소문자와 숫자만 사용 가능합니다.';
      }
      return '';
    },
    confirmPassword: (value, { password }) => {
      if (value !== password) {
        return '비밀번호가 일치하지 않습니다.';
      }
      return '';
    },
    nickname: (value) => {
      if (!value) return '필수 입력란입니다.';
      if (!/^[a-zA-Z0-9가-힣]*$/.test(value)) {
        return '특수기호를 제외한 영문 대/소문자, 한글, 숫자만 사용 가능합니다.';
      }
      return '';
    },
    email: (value) => {
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return '유효한 이메일 주소를 입력해주세요.';
      }
      return '';
    },
  };

  // 유효성 검사 실행
  const validateField = (field, value, extraData = {}) => {
    return validators[field] ? validators[field](value, extraData) : '';
  };

  //회원가입 폼 처리
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      id: validateField('id', id),
      password: validateField('password', password),
      confirmPassword: validateField('confirmPassword', confirmPassword, { password }),
      nickname: validateField('nickname', nickname),
      email: validateField('email', email),
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

  //중복 체크
  const checkDuplicate = async (field, value) => {
    try {
      const response = await fetch(`http://localhost:5000/check-duplicate-${field}?${field}=${value}`);
      const data = await response.json();
      
      if (data.available) {
        setErrors((prev) => ({
          ...prev,
          [field]: `사용 가능한 ${field === 'id' ? '아이디' : '닉네임'}입니다.`,
        }));
        return true;
      } else {
        setErrors((prev) => ({
          ...prev,
          [field]: `중복된 ${field === 'id' ? '아이디' : '닉네임'}입니다.`,
        }));
        return false;
      }
    } catch (error) {
      console.error(`${field} 중복 확인 오류:`, error);
      setErrors((prev) => ({
        ...prev,
        [field]: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      }));
      return false;
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
          <button type="button" onClick={() => checkDuplicate('id', id)}>
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
        </div>
        {errors.password && <div className="error">
          <p>{errors.password}</p>
        </div>}

        <div>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="비밀번호 확인"
            required
          />        
        </div>
        {errors.confirmPassword && <div className="error">
          <p>{errors.confirmPassword}</p>
        </div>}

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
          <button type="button" onClick={() => checkDuplicate('id',nickname)}>
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
