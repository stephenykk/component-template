const fs = require('fs')

const PACKAGE_NAME = process.env.npm_package_name.replace(/(?:^|[_-])(\w)/g, (m, c) => c.toUpperCase())

function genCodes() {
  return `
import * as utils from './utils';
import components, { install } from './components';
import Api, { http, envNow, getMedia } from './api/main';
const { ${PACKAGE_NAME} } = components;

export * from './utils';
export {
  ${PACKAGE_NAME},
  install,
  Api,
  http,
  getMedia,
  envNow,
};

const ${PACKAGE_NAME} = {
  install,
  ...components,
  ...utils,
  Api,
  http,
  getMedia,
  envNow,
  // @ts-ignore
  version: VERSION
};

// @ts-ignore
console.log(\`%c[${PACKAGE_NAME}] current version: \${VERSION}\`, 'color: green;');

const isDebug =
  /debug=yes/i.test(window.location.href) || window.localStorage.debug * 1 > 0;
if (isDebug) {
  console.log('DEBUGING ${PACKAGE_NAME}', );
  // @ts-ignore
  window.${PACKAGE_NAME} = ${PACKAGE_NAME};
}

export default ${PACKAGE_NAME};

`
}


function main() {
  const codes = genCodes()
  fs.writeFileSync('src/index.ts', codes, 'utf-8')
  console.log('OUTPUT ENTRY JS DONE!!');
}

main()