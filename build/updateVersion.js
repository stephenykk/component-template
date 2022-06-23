/**
 * usage: 更新组件版本号
 * updateVersion [beta/stable/*latest] [customVersion]
 * example:
 * node updateVersion  # 默认更新正式版
 * node updateVersion beta
 * node updateVersion stable 1.2.3-stable.10
 */

// @ts-ignore
const cp = require('child_process');
const pkg = require('../package.json');

const whiteTags = ['beta', 'stable'];

let customNewVersion = ''
const arg3 = process.argv[3]
if (arg3 && /^(\d+\.){2}\d+/.test(arg3)) {
  customNewVersion = arg3
}

let tag = process.argv[2];
function getUpdatingTag () {
  if (!whiteTags.includes(tag)) {
    tag = 'latest';
  }

  return tag;
}

// 1.1.3 or 1.3.4-beta.12 or 1.3.4-stable.23
function parse (version) {
  const [normalVersion, devVersion] = version.split('-');
  return {
    normalVersion,
    devVersion
  };
}

function getCurVersions () {
  const pkginfo = cp
    .execSync(`npm info ${pkg.name} --registry  https://npm.yunxuetang.com.cn`, { encoding: 'utf-8' })
    .toString('utf-8');
  const infoLines = pkginfo.split(/\r|\n/).filter(line => line.trim());
  const index = infoLines.findIndex(line => /^dist-tags/.test(line));
  const curVersions = {};
  function normalize (tag) {
    let result = '';
    const ntagList = ['stable', 'test', 'latest'];
    ntagList.forEach(ntag => {
      if (tag.includes(ntag)) {
        result = ntag;
      }
    });
    return result;
  }
  infoLines.forEach((line, i) => {
    const start = index + 1;
    const end = start + 2 + 2;
    if (i >= start && i <= end) {
      if (/(latest|stable|test).*?:/.test(line)) {
        const [tag, version] = line.split(':').map(part => part.trim());
        // 乱码
        curVersions[normalize(tag)] = version;
      }
    }
  });

  return curVersions;
}

function getNewVersion (versions, tag) {
  const curVersion = versions[tag === 'beta' ? 'test' : tag];

  if (!curVersion) {
    return `${versions.latest}-${tag}.1`;
  }

  let { normalVersion, devVersion } = parse(curVersion);
  if (tag === 'latest') {
    return normalVersion.replace(/\.(\d+)$/, (m, n) => {
      return `.${n * 1 + 1}`;
    });
  } else {
    if (!devVersion) {
      devVersion = `${tag}.0`;
    }
    const newDevVersion = devVersion.replace(/\.(\d+)/, (m, n) => {
      return `.${n * 1 + 1}`;
    });
    return `${normalVersion}-${newDevVersion}`;
  }
}

function execSync (cmd) {
  console.log('cmd::', cmd);
  const out = cp.execSync(cmd);
  console.log('[execSync] stdout::', out.toString());
}

function main () {
  console.log('-------------------------')
  console.log('VERSION UPDATEING...');
  console.log('-------------------------')
  // const version = pkg.version // 使用仓库的版本
  const updatingTag = getUpdatingTag();
  const curVersions = getCurVersions();
  // { latest: '1.5.6', stable: '1.5.4-stable.7', test: '1.5.4-beta.12' }
  console.log('curVersions::', curVersions);

  const newVersion = customNewVersion || getNewVersion(curVersions, updatingTag);
  // :: 非git仓库根目录，不会自动提交 version 更新
  execSync(`npm version ${newVersion}`);

  execSync('git add .');
  execSync(`git commit -m "[release] ${pkg.name} v${newVersion}"`);
  // execSync('gigst pull && git push')

  if (customNewVersion) {
    execSync(`npm publish --tag ${tag === 'beta' ? 'test' : tag}`)
  }
}

main();
