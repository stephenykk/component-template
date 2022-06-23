const cp = require('child_process');
const path = require('path');
const fs = require('fs');

const version = process.env.npm_package_version;
// hello-component -> HelloComponent
const packageName = process.env.npm_package_name.replace(/[-_](\w)/g, (_, w) => w.toUpperCase()).replace(/^\w/, m => m.toUpperCase());
console.log(`${packageName} current verson: ${version}`);

function resolve(fpath) {
  return path.resolve(__dirname, '..', fpath)
}

function execSync (cmd) {
  console.log('cmd::', cmd);
  const out = cp.execSync(cmd);
  console.log('[execSync] stdout::', out.toString());
}

function eachKey(obj = {}, fn) {
  Object.keys(obj).forEach(function(key) {
    fn(obj[key], key, obj)
  })
}

function replaceVar (values, fpath, isStringify) {
  fpath = resolve(fpath)
  const con = fs.readFileSync(fpath, 'utf-8');
  let newCon = con
  eachKey(values, (val, key) => {
    newCon = newCon.replace(new RegExp(key, 'gm'), isStringify ? JSON.stringify(val) : val);
  })
  
  fs.writeFileSync(fpath, newCon);
  console.log('UPDATE DONE!!', values);
}

function copyFile(src, dest) {
  src = resolve(src)
  dest = resolve(dest)
  const err = fs.copyFileSync(src, dest)
  console.log(`COPY DONE!  ${src} -> ${dest}`);
  
}

function ensureDirs(dirs) {
  dirs.forEach(dir => {
    const dpath = resolve(dir)
    if (!fs.existsSync(dpath)) {
      fs.mkdirSync(dpath)
    }
  })
}

function main () {
  ensureDirs(['es'])
  copyFile('types/index.d.ts', 'es/index.d.ts')
  execSync('npx babel src --out-dir es --extensions ".ts,.tsx,.js,.jsx"');
  replaceVar({VERSION: version}, 'es/index.js', true);
  replaceVar({PACKAGE_NAME: packageName}, 'es/index.js');
}


main()