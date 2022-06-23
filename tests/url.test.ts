import * as Url from '@/utils/url';

describe('getQuery', () => {
  test('normal url', () => {
    expect(Url.getQuery('//test.com?hello=yes&world=1')).toEqual({
      hello: 'yes',
      world: '1'
    });
  });

  test('querystring some value miss', () => {
    expect(Url.getQuery('http://test.com?hello&world=&good=2')).toEqual({
      hello: undefined,
      world: '',
      good: '2'
    });
  });

  test('url without querystring', () => {
    expect(Url.getQuery('//test.com')).toEqual({});
  });
});

describe('toQueryStr', () => {
    test('normal query', () => {
        const query = {hello: 'world', foo: 1}
        expect(Url.toQueryStr(query)).toBe('hello=world&foo=1')
    })

    test('empty query', () => {
        expect(Url.toQueryStr({})).toBe('')
        expect(Url.toQueryStr()).toBe('')
    })
})

describe('addQuery', () => {
    test('url with querystring', () => {
        const url = 'http://test.com?hello=1&world=yes'
        const result = Url.addQuery(url, {other: 'yes', more: 1})
        expect(result).toMatch('other=yes')
        expect(result).toMatch('hello=1')
        expect(result).toMatch('http://test.com?')
    })
    test('url no querystring', () => {
        const url = 'http://test.com'
        const query = {other: 'yes', more: 1}
        const result = Url.addQuery(url, query)
        expect(result).toMatch('other=yes')
        expect(result).toMatch('more=1')

        const result2 = Url.addQuery(url, null)
        expect(result2).toBe(url + '?')
    })
})