import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validation.middleware.js';
import { loginSchema, registerSchema } from '../utils/validator.js';

const router = Router();

// 注册
router.post('/register', validate(registerSchema), AuthController.register);

// 登录
router.post('/login', validate(loginSchema), AuthController.login);

// 刷新令牌
router.post('/refresh-token', AuthController.refreshToken);

// 登出
router.post('/logout', AuthController.logout);

// 获取当前用户
router.get('/me', AuthController.getCurrentUser);

export default router;
