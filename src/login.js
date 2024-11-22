const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const authMiddleware = require('./component/authMiddleware.js');

const app = express();
const port = 5000;

app.use(cors({
  origin: 'http://localhost:3000', // 요청을 허용할 프론트엔드 도메인
  credentials: true, // 쿠키를 포함한 요청 허용
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// MySQL 연결 및 에러처리
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'login_database'
});

db.connect((err) => {
  if (err) {
    console.log("Database Connection failed:" + err.stack);
    return;
  }
  console.log('Connected to database.');
});

// 회원가입 처리
app.post('/register', async (req, res) => {
  const { id, password, confirmPassword, nickname, email, birthday } = req.body;

  // email과 birthday가 비어있으면 null로 설정
  const formattedEmail = email || null;
  const formattedBirthday = birthday || null;

  // 1. 아이디 중복 체크
  const checkUsernameQuery = "SELECT COUNT(*) AS count FROM login WHERE id = ?";
  db.query(checkUsernameQuery, [id], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results[0].count > 0) {
      return res.status(400).json({ message: '중복된 아이디입니다.' });
    } 

    // 2. 닉네임 중복 체크
    const checkNicknameQuery = "SELECT COUNT(*) AS count FROM login WHERE nickname = ?";
    db.query(checkNicknameQuery, [nickname], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (results[0].count > 0) {
        return res.status(400).json({ error: "중복된 닉네임입니다." });
      } 

      // 3. 비밀번호 암호화 및 회원 데이터 삽입
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const insertUserQuery = "INSERT INTO login (id, password, nickname, email, birthday) VALUES (?, ?, ?, ?, ?)";
        
        // email과 birthday가 null로 설정된 상태로 삽입
        db.query(insertUserQuery, [id, hashedPassword, nickname, formattedEmail, formattedBirthday], (err, result) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.status(200).json({ message: '회원가입이 성공적으로 완료되었습니다!' });
        });
      } catch (error) {
        res.status(500).json({ error: '서버 오류로 인해 회원가입에 실패했습니다.' });
      }
    });
  });
});

// 로그인 처리
app.post('/login', async (req, res) => {
  const { id, password } = req.body;

  // 1. 아이디나 비밀번호가 빈 값인지 확인
  if (!id) {
    return res.status(400).json({ message: '아이디를 입력해주세요.' });
  }
  if (!password) {
    return res.status(400).json({ message: '비밀번호를 입력해주세요.' });
  }

  // 2. 데이터베이스에서 아이디가 일치하는 사용자를 찾기
  const findUserQuery = "SELECT * FROM login WHERE id = ?";
  db.query(findUserQuery, [id], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }

    if (results.length === 0) {
      // 아이디가 데이터베이스에 없을 때 에러 메시지 반환
      return res.status(400).json({ message: '아이디 혹은 비밀번호를 확인해주세요.' });
    }

    const user = results[0];

    // 3. 비밀번호 비교
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: '아이디 혹은 비밀번호를 확인해주세요.' });
    }

    //4. jwt생성
    const token = jwt.sign(
      {id:user.id, nickname:user.nickname},
      'your-secret-key',
      {expiresIn : '1h'}
    );
    //5.토큰 저장
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax'
    });

    // 6. 로그인 성공 시 응답
    res.status(200).json({ message: '로그인 성공!', 
      user: { id: user.id, nickname: user.nickname } });
  });
});

app.post('/logout', (req, res) => {
  res.clearCookie('authToken', {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
  });
  res.status(200).json({ message: '로그아웃 성공!' });
});

app.get('/check-duplicate-id', (req, res) => {
  const {id}  =req.query;

  const checkUsernameQuery = "SELECT COUNT(*) AS count FROM login WHERE id = ?";
  db.query(checkUsernameQuery, [id], (err, result) => {
    if(err) {
      return res.status(500).json({error:'서버 오류가 발생하였습니다.'});
    }
    const isAvailable = result[0].count === 0;
    res.status(200).json({available:isAvailable});
  });
});

app.get('/check-duplicate-nickname', (req,res) => {
  const{nickname} = req.query;

  const checkNicknameQuery = "SELECT COUNT(*) AS count FROM login WHERE nickname = ?";
  db.query(checkNicknameQuery, [nickname], (err,result) => {
    if (err) {
      return res.status(500).json({error:'서버 오류가 발생하였습니다.'});
    }
    const isAvailable = result[0].count === 0;
    res.status(200).json({available:isAvailable});
  })
})

app.get('/auth-status', (req, res) => {
  const token = req.cookies.authToken;

  // 쿠키에 토큰이 없을 경우
  if (!token) {
    return res.status(401).json({ message: '로그인 상태가 아닙니다.' });
  }

  try {
    const secretKey = process.env.JWT_SECRET_KEY || 'default-secret-key';
    const decoded = jwt.verify(token, secretKey);

    // 인증 성공 시 사용자 정보 반환
    res.status(200).json({ id: decoded.id, nickname: decoded.nickname });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: '토큰이 만료되었습니다. 다시 로그인하세요.' });
    }
    res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }
});

app.get('/mypage', authMiddleware, (req, res) => {
  const { id, nickname } = req.user;
  res.status(200).json({ id, nickname });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
