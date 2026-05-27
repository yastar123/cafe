process.env.VERCEL = '1';
process.env.NODE_ENV = 'test';
import handler from './artifacts/api-server/api/index.mjs';

const mockReq = { method: 'GET', url: '/api/health', headers: {} };
const mockRes = {
  statusCode: 200,
  headers: {},
  setHeader(name, value) { this.headers[name] = value; },
  end(body) { console.log('Response:', this.statusCode, body); }
};

handler(mockReq, mockRes);
