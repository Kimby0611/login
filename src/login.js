const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MySQL 연결 및 에러처리
// your_id, your_password, your_database에 자신의 내용 넣기
const db = mysql.createConnection({
  host: 'localhost',
  user: 'your_id',
  password: 'your_password',
  database: 'your_database'
});

db.connect((err) => {
  if (err) {
    console.log("Database Connection failed:" + err.stack);
    return;
  }
  console.log('Connected to database.');
});

// 회원가입 API
app.post('/register', async (req, res) => {
  const { id, password, nickname, email, birthday } = req.body;
  const formattedEmail = email || null;
  const formattedBirthday = birthday || null;

  const checkUsernameQuery = "SELECT COUNT(*) AS count FROM your_database WHERE id = ?";
  db.query(checkUsernameQuery, [id], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results[0].count > 0) {
      return res.status(400).json({ message: '중복된 아이디입니다.' });
    } 

    const checkNicknameQuery = "SELECT COUNT(*) AS count FROM your_database WHERE nickname = ?";
    db.query(checkNicknameQuery, [nickname], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (results[0].count > 0) {
        return res.status(400).json({ error: "중복된 닉네임입니다." });
      } 

      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const insertUserQuery = "INSERT INTO your_database (id, password, nickname, email, birthday) VALUES (?, ?, ?, ?, ?)";
        
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

// 로그인 API
app.post('/login', async (req, res) => {
  const { id, password } = req.body;

  if (!id) {
    return res.status(400).json({ message: '아이디를 입력해주세요.' });
  }
  if (!password) {
    return res.status(400).json({ message: '비밀번호를 입력해주세요.' });
  }

  const findUserQuery = "SELECT * FROM your_database WHERE id = ?";
  db.query(findUserQuery, [id], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: '아이디 혹은 비밀번호를 확인해주세요.' });
    }

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: '아이디 혹은 비밀번호를 확인해주세요.' });
    }

    res.status(200).json({ message: '로그인 성공!', user: { id: user.id, nickname: user.nickname, email: user.email, birthday:user.birthday } });
  });
});

//중복 체크 API
app.get('/check-duplicate-id', (req, res) => {
  const {id}  =req.query;

  const checkUsernameQuery = "SELECT COUNT(*) AS count FROM your_database WHERE id = ?";
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

  const checkNicknameQuery = "SELECT COUNT(*) AS count FROM your_database WHERE nickname = ?";
  db.query(checkNicknameQuery, [nickname], (err,result) => {
    if (err) {
      return res.status(500).json({error:'서버 오류가 발생하였습니다.'});
    }
    const isAvailable = result[0].count === 0;
    res.status(200).json({available:isAvailable});
  });
});

//마이페이지 정보 조회 API
app.get('/user-info', (req, res) => {
  const { id } = req.query;

  const findUserQuery = "SELECT email, birthday FROM your_database WHERE id = ?";
  db.query(findUserQuery, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    const user = results[0];
    res.status(200).json({
      email: user.email,
      birthday: user.birthday,
    });
  });
});

// 회원 정보 수정 API
app.put('/update-user', (req, res) => {
  const { id, email, birthday, nickname } = req.body;

  const updateUserQuery = `
    UPDATE your_database
    SET email = ?, birthday = ?, nickname = ? 
    WHERE id = ?
  `;

  db.query(updateUserQuery, [email || null, birthday || null, nickname || null, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    res.status(200).json({ message: '회원 정보가 성공적으로 업데이트되었습니다.' });
  });
});

// 비밀번호 변경 API
app.post('/change-password', async (req, res) => {
  const { id, currentPassword, newPassword } = req.body;

  const findUserQuery = "SELECT * FROM your_database WHERE id = ?";
  db.query(findUserQuery, [id], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: '현재 비밀번호가 일치하지 않습니다.' });
    }

    try {
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      const updatePasswordQuery = "UPDATE your_database SET password = ? WHERE id = ?";
      db.query(updatePasswordQuery, [hashedNewPassword, id], (err, result) => {
        if (err) {
          return res.status(500).json({ error: '비밀번호 변경 중 오류가 발생했습니다.' });
        }
        res.status(200).json({ message: '비밀번호가 성공적으로 변경되었습니다.' });
      });
    } catch (error) {
      res.status(500).json({ error: '비밀번호 암호화 중 오류가 발생했습니다.' });
    }
  });
});

//비밀번호 확인 API
app.post('/check-password', (req, res) => {
  const { id, currentPassword } = req.body;

  const findUserQuery = "SELECT * FROM your_database WHERE id = ?";
  db.query(findUserQuery, [id], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: '비밀번호가 틀렸습니다.' });
    }

    res.status(200).json({ message: '비밀번호가 확인되었습니다.' });
  });
});

// 사용자 프로필 수정 API
app.post('/update-profile', (req, res) => {
  const { id, nickname, email, birthday } = req.body;

  if (!id) {
    return res.status(400).json({ success: false, message: '사용자 ID가 필요합니다.' });
  }
  const query = 'UPDATE your_database SET nickname = ?, email = ?, birthday = ? WHERE id = ?';
  db.query(query, [nickname, email, birthday, id], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }

    if (result.affectedRows > 0) {
      return res.status(200).json({ success: true, message: '프로필이 성공적으로 업데이트되었습니다.' });
    } else {
      return res.status(400).json({ success: false, message: '프로필 업데이트에 실패했습니다.' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
