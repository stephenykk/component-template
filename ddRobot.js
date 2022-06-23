const https = require('https');
const child_process = require('child_process');
const pkg = require('./package.json');

// 业务组件群 webhook:
// https://oapi.dingtalk.com/robot/send?access_token=10155ddf31d7e5049ae91047e1e21fa5a5c8c0eefed863d56fa55e0ac44e12cd

// 广州前端群 webhook:
const gzfeWebhook = 'https://oapi.dingtalk.com/robot/send?access_token=953e3c88c224aa4f973f4c57f54ab4ea15e0cde022dcd551361ece670207c1d4';

const webhook = gzfeWebhook

const ddRobot = {
  action: '升级',
  kw: '提醒', // 注: 不能修改，创建机器人时指定
  webhook: webhook,

  execSync(cmd) {
    const result = child_process.execSync(cmd, { encoding: 'utf-8' });
    return result.replace(/(\r|\n)$/g, '');
  },
  sent() {
    // 钉钉机器人发群消息
    const { webhook } = this;

    const req = https.request(
      webhook,
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        }
      },
      res => {
        console.log(`[info] ${res.statusCode} ${res.status}`);
        res.setEncoding('utf-8');
        let data = '';
        res.on('data', chunk => {
          data += chunk;
        });
        res.on('end', () => {
          console.log(`[info] res data: ${data.toString()}`);
        });
        res.on('error', err => {
          console.log(`[error] res fail: ${err}`);
        });
      }
    );

    req.write(this.postData());
    req.end();
  },
  getUser() {
    const name = this.execSync('git config --get user.name');
    const email = this.execSync('git config --get user.email');
    return `${name}<${email}>`;
  },
  getCommit() {
    let commits = this.execSync('git log -5 --oneline');
    commits = commits.split(/(\r|\n)/g).filter(val => val.trim());
    const latestCommit = commits.find(val => {
      const verRe = /^\d+\.\d+\.\d+/; // version only
      const msg = val.split(/\s+/)[1];
      const onlyVersion = verRe.test(msg);
      if (onlyVersion) {
        return false;
      }
      return true;
    });
    return latestCommit;
  },
  postData() {
    const getCon = () => {
      const { kw, action } = this;
      const tag = `[${action}${kw}]`;

      return [
        `${tag} ${pkg.name}发布新版本v${pkg.version}`,
        `发布人: ${this.getUser()}`,
        `新提交: ${this.getCommit()}`
      ].join('\n');
    };

    const data = {
      msgtype: 'text',
      text: { content: getCon() }
    };
    const postData = JSON.stringify(data);
    return postData;
  },
  listenException() {
    process.on('uncaughtException', err => {
      console.log('[error] uncaughtException:', err);
    });
  },
  start() {
    this.listenException();
    this.sent();
  }
};

ddRobot.start();
