import userModel from '../models/user.model.js';
import { hashPassword, comparePassword } from '../utils/auth.js';

class UserService {
  // 获取用户列表
  static async getUsers({ page = 1, limit = 10, search = '' }) {
    const users = userModel.findAll();
    
    // 搜索过滤
    let filteredUsers = users;
    if (search) {
      filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    
    // 移除敏感信息
    return paginatedUsers.map(({ password, ...user }) => user);
  }

  // 获取单个用户
  static async getUserById(id) {
    const user = userModel.findById(id);
    if (!user) return null;
    
    // 移除密码
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // 创建用户
  static async createUser(userData) {
    // 验证邮箱是否已存在
    const existingUser = userModel.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('邮箱已存在');
    }

    // 哈希密码
    if (userData.password) {
      userData.password = await hashPassword(userData.password);
    }

    // 创建用户
    const user = userModel.create(userData);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // 更新用户
  static async updateUser(id, updateData) {
    // 不允许更新密码（使用单独的密码更新接口）
    if (updateData.password) {
      delete updateData.password;
    }

    const updatedUser = userModel.update(id, updateData);
    if (!updatedUser) {
      throw new Error('用户不存在');
    }

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  // 删除用户
  static async deleteUser(id) {
    const deleted = userModel.delete(id);
    if (!deleted) {
      throw new Error('用户不存在');
    }
    return true;
  }

  // 获取用户统计
  static async getUserStats() {
    const users = userModel.findAll();
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

    return {
      total: users.length,
      active: users.filter(u => u.lastLogin > thirtyDaysAgo).length,
      newThisMonth: users.filter(u => new Date(u.createdAt) > thirtyDaysAgo).length
    };
  }

  // 验证用户凭据
  static async validateCredentials(email, password) {
    const user = userModel.findByEmail(email);
    if (!user) {
      throw new Error('用户不存在');
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      throw new Error('密码错误');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

export default UserService;
