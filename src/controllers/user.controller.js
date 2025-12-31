import UserService from '../services/user.service.js';

export class UserController {
  // 获取所有用户
  static async getUsers(req, res) {
    try {
      const { page = 1, limit = 10, search } = req.query;
      const users = await UserService.getUsers({ page, limit, search });
      res.json({
        success: true,
        data: users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: users.length
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // 获取单个用户
  static async getUser(req, res) {
    try {
      const user = await UserService.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: '用户不存在' });
      }
      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // 创建用户
  static async createUser(req, res) {
    try {
      const userData = req.body;
      const user = await UserService.createUser(userData);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // 更新用户
  static async updateUser(req, res) {
    try {
      const user = await UserService.updateUser(req.params.id, req.body);
      res.json({ success: true, data: user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // 删除用户
  static async deleteUser(req, res) {
    try {
      await UserService.deleteUser(req.params.id);
      res.json({ success: true, message: '用户已删除' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // 获取用户统计
  static async getUserStats(req, res) {
    try {
      const stats = await UserService.getUserStats();
      res.json({ success: true, data: stats });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
