import * as lang from '@/utils/lang';

describe('promisify', () => {
  beforeEach(function() {
    var error = jest.spyOn(global.console, 'error').mockImplementation()
    var warn = jest.spyOn(global.console, 'warn').mockImplementation()
  })
  test('promisfy return a fn return promise', () => {
    const hello = function() {
      return 'hello';
    };
    const phello = lang.promisify(hello);
    expect(phello()).toBeInstanceOf(Promise);

    const hi = function(resolve) {
      setTimeout(() => resolve('hi'), 1000);
    };
    const phi = lang.promisify(hi);
    return expect(phi()).resolves.toBe('hi');
  });

  test('promisify handle fn reject', () => {
    const hi2 = function(_, reject) {
      setTimeout(() => reject('hi2'), 1000);
    };
    const phi2 = lang.promisify(hi2);
    return expect(phi2()).resolves.toBe(false);
  });

  test('promisify handle fn inside error', () => {
    jest.spyOn(global.console, 'error').mockImplementation
    
    const hi3 = function() {
      // @ts-ignore
      window.notExists();
      return 'test';
    };
    const phi3 = lang.promisify(hi3);
    expect(() => phi3()).not.toThrow();
    return expect(phi3()).resolves.toBe(false);
  });

  test('promisify with not fn param', () => {
    const str = 'good' as unknown;
    const pstr = lang.promisify(str as OD.Fn);
    expect(pstr).toBeInstanceOf(Function);
    expect(pstr()).toBeInstanceOf(Promise);
    expect(pstr()).resolves.toBe(str);
  });
});

describe('toChunks', () => {
  beforeEach(function() {
    var error = jest.spyOn(global.console, 'error').mockImplementation()
    var warn = jest.spyOn(global.console, 'warn').mockImplementation()
  })

  const arr = Array.from({ length: 40 }).map((v, i) => i);
  test('toChunks with size', () => {
    const size = 10;
    const chunks = lang.toChunks(arr, size);
    expect(chunks.length).toBe(4);
    expect(chunks.every(chunk => Array.isArray(chunk))).toBe(true);
    expect(
      chunks.every((chunk, i) =>
        i !== chunks.length - 1 ? chunk.length === size : chunk.length <= size
      )
    ).toBe(true);
    expect(chunks.slice().pop()).toEqual(arr.slice(-10));
  });

  test('toChunks handle not list', () => {
    const str = 'hello';
    expect(lang.toChunks(str as any)).toBe(str);
  });
});

describe('pick', () => {
  const data = { name: 'zhang', age: 12, color: 'blue' };
  const keys = ['name'];
  const renameKeys = ['name', ['age', 'year']];
  test('pick keys', () => {
    expect(lang.pick(data, keys)).toEqual({ name: 'zhang' });
  });
  test('pick keys and rename some key', () => {
    expect(lang.pick(data, renameKeys)).toEqual({ name: 'zhang', year: 12 });
  });
});


describe('sleep', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.spyOn(global, 'setTimeout')
  })
  afterEach(() => {
    jest.useRealTimers()
  })

  test('sleep 1s', () => {
    const ms = 1000
    expect(lang.sleep(ms)).toBeInstanceOf(Promise)
    expect(setTimeout).toHaveBeenCalledTimes(1)
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), ms)
  })
})

describe('createLogger', () => {
  test('createLogger return obj with 3 log fns', () => {
    expect(lang.createLogger('demo')).toMatchObject({
      log: expect.any(Function),
      warn: expect.any(Function),
      errlog: expect.any(Function)
    })
  })
})

describe('appendItem', () => {
  test('appendItem add new ele', () => {
    const arr = [1, 2]
    expect(lang.appendItem(arr, 3)).toContain(3)
  })
  test('appendItem add a exists ele', () => {
    const arr = [1, 2]
    const result = lang.appendItem(arr, 1)
    expect(result.length).toBe(2)
    expect(result).toEqual(arr)
  })
})


describe('kabebCase', () => {
  it('kabebCase for camelCase string', ()=> {
    expect(lang.kabebCase('helloWorld')).toBe('hello-world')
    expect(lang.kabebCase('HelloWorld')).toBe('hello-world')
  })

  it('kabebCase no effect for lower string', () => {
    expect(lang.kabebCase('one_two')).toBe('one_two')
    expect(lang.kabebCase('onetwo')).toBe('onetwo')
  })
})