const request = require('supertest');
const app = require('../app');

describe('POST /login', () => {
  it('should login successfully with a valid username', async () => {
    const res = await request(app)
      .post('/login')
      .send({
        username: 'testuser',
      });
      
    expect(res.statusCode).toEqual(200);
  });

  it('should fail when no username is provided', async () => {
    const res = await request(app)
      .post('/login')
      .send({
        username: '',
      });
      
    console.log(res.text);
    expect(res.statusCode).toEqual(200); 
    expect(res.text).toContain('Please enter a valid name');
  });
});
