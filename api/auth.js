import { Router } from 'express';
const router = Router();

// 登录
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // 这里应该是实际的验证逻辑
  if (email === 'admin@example.com' && password === 'password') {
    res.json({
      success: true,
      token: 'fake-jwt-token',
      user: { id: 1, email, name: 'Admin User' }
    });
  } else {
    res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }
});

// 注册
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  
  // 这里应该是实际的用户创建逻辑
  res.status(201).json({
    success: true,
    user: {
      id: Date.now(),
      name,
      email,
      createdAt: new Date().toISOString()
    }
  });
});

// 获取当前用户
router.get('/me', (req, res) => {
  // 这里应该验证JWT令牌
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (token) {
    res.json({
      success: true,
      user: {
        id: 1,
        email: 'admin@example.com',
        name: 'Admin User'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      error: 'Not authenticated'
    });
  }
});

export default router;
