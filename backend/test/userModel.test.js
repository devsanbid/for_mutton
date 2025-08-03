const User = require('../models/User');

describe('User Model', () => {
  it('should require name', async () => {
    const user = User.build({ email: 'test@example.com', password: 'secret123' });
    let error;
    try {
      await user.validate();
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.errors.map(e => e.path)).toContain('name');
  });

  it('should pass validation with valid data', async () => {
    const user = User.build({ name: 'John Doe', email: 'john@example.com', password: 'secret123' });
    await expect(user.validate()).resolves.not.toThrow();
  });
});