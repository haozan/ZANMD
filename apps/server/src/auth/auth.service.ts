import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createTestUsers } from './test-users';

// 临时内存存储，生产环境应该使用数据库
let users: Map<string, any> = new Map();

// 初始化测试用户
createTestUsers().then(testUsers => {
  users = testUsers;
  console.log('✅ 测试用户已加载:', Array.from(users.values()).map(u => ({ email: u.email, username: u.username })));
}).catch(err => {
  console.error('❌ 加载测试用户失败:', err);
});

export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async register(email: string, password: string, username: string) {
    // 检查用户是否已存在
    const existingUser = Array.from(users.values()).find(
      (u) => u.email === email,
    );
    if (existingUser) {
      throw new UnauthorizedException('邮箱已被注册');
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建新用户
    const user: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email,
      username,
      password: hashedPassword,
    };

    users.set(user.id, user);

    // 生成JWT token
    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      token,
    };
  }

  async login(email: string, password: string) {
    // 查找用户
    const user = Array.from(users.values()).find((u) => u.email === email);
    if (!user) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    // 生成JWT token
    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      token,
    };
  }

  async validateUser(userId: string): Promise<any> {
    const user = users.get(userId);
    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }
    const { password, ...result } = user;
    return result;
  }

  // 获取所有用户（用于调试）
  getAllUsers() {
    return Array.from(users.values()).map(({ password, ...user }) => user);
  }
}
