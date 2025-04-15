import { getMethodType } from './get-method-type';

describe('getMethodType', () => {
  it('should return 1 for getUri and request', () => {
    expect(getMethodType('getUri')).toBe(1);
    expect(getMethodType('request')).toBe(1);
  });

  it('should return 2 for get, delete, head, options', () => {
    expect(getMethodType('get')).toBe(2);
    expect(getMethodType('delete')).toBe(2);
    expect(getMethodType('head')).toBe(2);
    expect(getMethodType('options')).toBe(2);
  });

  it('should return 3 for post, put, patch, postForm, putForm, patchForm', () => {
    expect(getMethodType('post')).toBe(3);
    expect(getMethodType('put')).toBe(3);
    expect(getMethodType('patch')).toBe(3);
    expect(getMethodType('postForm')).toBe(3);
    expect(getMethodType('putForm')).toBe(3);
    expect(getMethodType('patchForm')).toBe(3);
  });

  it('should return 0 for unknown method', () => {
    expect(getMethodType('foobar')).toBe(0);
    expect(getMethodType('')).toBe(0);
    expect(getMethodType('CONNECT')).toBe(0);
  });
});
