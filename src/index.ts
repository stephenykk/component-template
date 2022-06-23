import * as utils from './utils';
import components, { install } from './components';
import Api, { http, envNow, getMedia } from './api/main';
const { HelloComponent } = components;

export * from './utils';
export {
  HelloComponent,
  install,
  Api,
  http,
  getMedia,
  envNow,
};

// const PACKAGE_NAME = {
//   install,
//   ...components,
//   ...utils,
//   Api,
//   http,
//   getMedia,
//   envNow,
//   // @ts-ignore
//   version: VERSION
// };

// @ts-ignore
console.log(`%c[HelloCompoenntkkk] current version: ${VERSION}`, 'color: green;');

const isDebug =
  /debug=yes/i.test(window.location.href) || window.localStorage.debug * 1 > 0;
if (isDebug) {
  console.log('DEBUGING PACKAGE_NAME', );
  // @ts-ignore
  window.PACKAGE_NAME = PACKAGE_NAME;
}

export default PACKAGE_NAME;
