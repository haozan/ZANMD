import * as bcrypt from 'bcrypt';

/**
 * 测试账号初始化脚本
 * 在 auth.service.ts 中导入此文件来预先创建测试账号
 */

export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
}

/**
 * 创建预设的测试用户
 */
export async function createTestUsers(): Promise<Map<string, User>> {
  const users = new Map<string, User>();

  // 测试账号 1
  const testUser1: User = {
    id: 'user_test_001',
    email: 'test@example.com',
    username: '测试用户',
    password: await bcrypt.hash('123456', 10), // 密码: 123456
  };

  // 测试账号 2
  const testUser2: User = {
    id: 'user_test_002',
    email: 'demo@wemd.com',
    username: 'Demo用户',
    password: await bcrypt.hash('demo123', 10), // 密码: demo123
  };

  // 测试账号 3
  const testUser3: User = {
    id: 'user_test_003',
    email: 'admin@test.com',
    username: '管理员',
    password: await bcrypt.hash('admin888', 10), // 密码: admin888
  };

  users.set(testUser1.id, testUser1);
  users.set(testUser2.id, testUser2);
  users.set(testUser3.id, testUser3);

  return users;
}

/**
 * 测试账号信息（供用户参考）
 */
export const TEST_ACCOUNTS = [
  {
    email: 'test@example.com',
    password: '123456',
    username: '测试用户',
    description: '通用测试账号',
  },
  {
    email: 'demo@wemd.com',
    password: 'demo123',
    username: 'Demo用户',
    description: '演示账号',
  },
  {
    email: 'admin@test.com',
    password: 'admin888',
    username: '管理员',
    description: '管理员测试账号',
  },
];
