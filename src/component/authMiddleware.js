const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.cookies.authToken;

    // 토큰이 없으면 401 Unauthorized로 처리
    if (!token) {
        return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    try {
        const secretKey = process.env.JWT_SECRET_KEY || 'default-secret-key';
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded; // 인증된 사용자 정보 저장
        next(); // 인증 성공 시 다음 미들웨어로 이동
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ message: '토큰이 만료되었습니다.' });
        }
        return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
    }
};

module.exports = authMiddleware;
