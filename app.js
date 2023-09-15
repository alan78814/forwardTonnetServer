const express = require('express');
const app = express();
const aClient = require('request-promise');
const request = require('request');
let MD5 = require('crypto-js/md5');
const moment = require('moment');

app.use(express.json()); // 解析JSON格式的主體
app.use(express.urlencoded({ extended: true })); // 解析urlencoded格式的主體

// 基本設置
const host = '192.168.200.3';
const port = '8443';
const client_id = '9a1ce264-f70a-4b6c-be5d-0cf860c8b7d3';
const client_secret = 'E6ne6l3mmAERmtSstka5Y0MbcRbvRuLsJzXuAyOI';
// 人臉機資料
const dev_type = 3;
const dev_id = [27];

// function
async function getTonnetServiceToken() {
  try {
    const response = await aClient({
      method: 'POST',
      url: `https://${host}:${port}/oauth/token`,
      json: true,
      body: {
        grant_type: 'client_credentials',
        client_id: client_id,
        client_secret: client_secret,
        scope: '*',
      },
      rejectUnauthorized: false,
    });

    return response.access_token;
  } catch (err) {
    console.log('getTonnetServiceToken error'.err);
  }
}

// route
app.get('/tonnetServerSyn', async (req, res) => {
  console.log(`${moment().format('YYYY-MM-DD HH:mm')}收到請求`);

  let token = null;

  try {
    token = await getTonnetServiceToken();
  } catch (error) {
    console.log('getTonnetServiceToken() error:', error);
  }

  const headers = {
    'content-type': 'application/json',
    Authorization: token,
  };

  try {
    await aClient({
      method: 'POST',
      url: `https://${host}:${port}/api/system/sync`,
      json: true,
      headers: headers,
      body: {
        dev_type: dev_type,
        dev_id: dev_id,
      },
      rejectUnauthorized: false,
    });
  } catch (error) {
    console.log('syc to tonnetServer error:', error);
  }

  res.send(`通航資料同步至人臉機完成`);
});

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(8888, () => {
  console.log('Server running at http://localhost:8888/');
});
