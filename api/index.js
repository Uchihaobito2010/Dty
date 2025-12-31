import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config';

const app = express();

// 中间件
app.use(helmet());
app.use(cors());
app.use(express.json());

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'API Service',
    version: '1.0.0'
  });
});

// 示例路由
app.get('/api/users', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ]
  });
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  res.status(201).json({
    success: true,
    data: {
      id: Date.now(),
      name,
      email,
      createdAt: new Date().toISOString()
    }
  });
});

// 所有其他路由转到404
app.all('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`
  });
});

// Vercel需要导出一个函数
export default (req, res) => {
  return app(req, res);
};
