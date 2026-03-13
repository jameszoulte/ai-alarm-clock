const http = require('http');

// 从 Expo Metro 获取隧道地址
const options = {
  hostname: 'localhost',
  port: 8081,
  path: '/status',
  method: 'GET',
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Metro 状态:', data);
  });
});

req.on('error', (e) => {
  console.log('请求失败:', e.message);
});

req.end();
