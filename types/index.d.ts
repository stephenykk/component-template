// OpenData 命名空间 简写为 OD
declare namespace OD {
  interface LoadScript {
    (src: string, allowOnlyOne: boolean): Promise<any>;
    _cachePromises?: {
      [index: string]: Promise<any>;
    };
  }

  type Fn = (...args: any[]) => any;

  type Script = HTMLScriptElement & {
    onreadystatechange: Fn;
    readyState: string;
  };

  interface GetQuery {
    (url?: string): Record<string, any>;
    _cache?: Record<string, any>;
  }

  type sourceCodeEnum = import('../src/enums').sourceCodeEnum;

  type Env = 'dev' | 'tcstress' | 'stg' | 'prod';
}

declare interface Window {
  envConfig: any;
}
/* 
declare var wx: {
  agentConfig: OD.Fn;
  config: OD.Fn;
  ready: OD.Fn;
  error: OD.Fn;
};

declare var WWOpenData: {
  bindAll: OD.Fn;
  checkSession: OD.Fn;
};

declare var DTOpenData: {
  init: OD.Fn;
  update: OD.Fn;
  initTimes: number;
  initOK: boolean;
};

declare var XXOpenData: {
  init: Function,
  update: OD.Fn;
  initTimes?: number;
  initOK?: boolean;
  _cryptoJS?: any,
  _decode?: any
};

declare module 'yxt-open-data' {
  type Env = 'dev' | 'tcdev' | 'tcstress' | 'stg' | 'prod' | 'tcprod';
  // type Vue = typeof import('vue');
  type Vue = any;
  type ApiConfig = {
    env?: string;
    domain?: Record<string, string>;
    autoDomain?: boolean;
    [key: string]: any;
  };

  type ComponentOptions = {
    nam: string;
    render: (...args: any[]) => any;
  }
  interface Install {
    (vue: Vue, config: ApiConfig, component?: ComponentOptions): void;
  }

  interface ApiInstall {
    (vue: Vue | ApiConfig, config?: ApiConfig): void;
  }
  type Axios = typeof import('axios');
  type Config = {
    [key in Env]: {
      qidaApi: string;
      media: string;
      orginit: string;
      globalApi: string;
    };
  };

  type CmpNames =
    | 'DdOpenData'
    | 'OpenData'
    | 'UserName'
    | 'PositionName'
    | 'DeptName';

  type Components = Record<
    CmpNames,
    {
      name: string;
      install: (vue: Vue) => void;
    }
  >;

  interface IOpenData {
    orgId: string;
    elements: Array<HTMLElement>;
    isStarted: () => boolean;
    isReady: () => boolean;
    loadSDK: (lives?: number) => Promise<boolean>;
    addElement: (ele: HTMLElement) => void;
    init: (orgId?: string) => Promise<any>;
    update: (isAll?: boolean) => void;
    debUpdate: (ele?: HTMLElement) => void;
    tag: (shortType: 'user' | 'dept', openid: string) => string;
  }

  interface WeiXin {
    openData: IOpenData;
    wxConfig: (orgId?: string) => Promise<any>;
    agentConfig: (orgId?: string) => Promise<any>;
  }

  interface DingTalk {
    openData: IOpenData;
  }

  interface XuanXin {
    openData: IOpenData;
  }

  type Tools = typeof import('../src/utils/tools')
  interface Utils {
    weixin: WeiXin;
    dingtalk: DingTalk;
    xuanxin: XuanXin,
    sourceCodeEnum: import('../src/enums').sourceCodeEnum;
  }
  interface API {
    name: string;
    config: Config;
    create: (...args: Array<any>) => any;
    setConfig: (...args: Array<any>) => any;
    install: ApiInstall;
    [index: string]: any;
  }

  const YxtOpenData: {
    Api: API;
    http: Record<string, Axios>;
    getMedia: () => string;
    envNow: Env;
    install: Install;
  } & Components &
    Utils & Tools;

  export default YxtOpenData;
} */
