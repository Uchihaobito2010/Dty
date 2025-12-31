import { Router } from 'express';
const router = Router();

// 获取所有用户
router.get('/', (req, res) => {
  const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com', role: 'user' },
    { id: 2, name: 'Bob', email: 'bob@example.com', role: 'admin' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com', role: 'user' }
  ];
  
  // 分页参数
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  const results = {
    data: users.slice(startIndex, endIndex),
    pagination: {
      page,
      limit,
      total: users.length,
      pages: Math.ceil(users.length / limit)
    }
  };
  
  res.json(results);
});

// 获取单个用户
router.get('/:id', (req, res) => {
  const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' }
  ];
  
  const user = users.find(u => u.id === parseInt(req.params.id));
  
  if (user) {
    res.json({ success: true, data: user });
  } else {
    res.status(404).json({ success: false, error: 'User not found' });
  }
});

// 创建用户
router.post('/', (req, res) => {
  const { name, email, role = 'user' } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      error: 'Name and email are required'
    });
  }
  
  const newUser = {
    id: Date.now(),
    name,
    email,
    role,
    createdAt: new Date().toISOString()
  };
  
  res.status(201).json({
    success: true,
    data: newUser
  });
});

// 更新用户
router.put('/:id', (req, res) => {
  const { name, email } = req.body;
  
  // 模拟更新
  const updatedUser = {
    id: parseInt(req.params.id),
    name: name || 'Updated User',
    email: email || 'updated@example.com',
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    data: updatedUser
  });
});

// 删除用户
router.delete('/:id', (req, res) => {
  res.json({
    success: true,
    message: `User ${req.params.id} deleted successfully`
  });
});

export default router;
