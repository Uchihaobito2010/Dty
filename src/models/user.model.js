// 内存数据库模拟（生产环境请用真实数据库）
class MemoryDatabase {
  constructor() {
    this.users = new Map();
    this.nextId = 1;
  }

  create(data) {
    const id = this.nextId++;
    const user = {
      id,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.users.set(id, user);
    return user;
  }

  findById(id) {
    return this.users.get(parseInt(id));
  }

  findAll() {
    return Array.from(this.users.values());
  }

  update(id, data) {
    const user = this.findById(id);
    if (!user) return null;
    
    const updatedUser = {
      ...user,
      ...data,
      updatedAt: new Date().toISOString()
    };
    this.users.set(parseInt(id), updatedUser);
    return updatedUser;
  }

  delete(id) {
    return this.users.delete(parseInt(id));
  }

  findByEmail(email) {
    return this.findAll().find(user => user.email === email);
  }

  count() {
    return this.users.size;
  }
}

export default new MemoryDatabase();
