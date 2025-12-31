import UserService from '../services/user.service.js';
import { generateToken, verifyToken } from '../utils/jwt.js';

export class AuthController {
  // 用户注册
  static async register(req, res) {
    try {
      const userData = req.body;
      const user = await UserService.createUser(userData);
      
      // 生成JWT令牌
      const token = generateToken({ userId: user.id, email: user.email });
      
      res.status(201).json({
        success: true,
        data: {
          user,
          token
        }
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // 用户登录
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await UserService.validateCredentials(email, password);
      
      // 生成JWT令牌
      const token = generateToken({ userId: user.id, email: user.email });
      
      res.json({
        success: true,
        data: {
          user,
          token
        }
      });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  // 刷新令牌
  static async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token is required' });
      }

      const decoded = verifyToken(refreshToken);
      const newToken = generateToken({ userId: decoded.userId, email: decoded.email });

      res.json({
        success: true,
        data: { token: newToken }
      });
    } catch (error) {
      res.status(401).json({ error: 'Invalid refresh token' });
    }
  }

  // 登出
  static async logout(req, res) {
    // 客户端应该删除本地存储的令牌
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  }

  // 获取当前用户信息
  static async getCurrentUser(req, res) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: '未授权' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token);
      const user = await UserService.getUserById(decoded.userId);

      if (!user) {
        return res.status(404).json({ error: '用户不存在' });
      }

      res.json({ success: true, data: user });
    } catch (error) {
      res.status(401).json({ error: '无效的令牌' });
    }
  }
}
