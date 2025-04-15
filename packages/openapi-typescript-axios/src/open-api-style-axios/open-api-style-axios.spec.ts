import axios, { mergeConfig } from 'axios';
import { DEFAULT_CONFIGS } from '../constant';
import { getMethodType } from '../utils';
import { buildArgs } from './build-args';
import { OpenApiStyleAxios } from './open-api-style-axios';

vi.mock('axios', async () => {
  const actual = await vi.importActual('axios');
  return {
    ...actual,
    //@ts-ignore
    mergeConfig: vi.fn(actual.mergeConfig)
  };
});

vi.mock('./build-args', async () => {
  const actual = await vi.importActual('./build-args');
  return {
    ...actual,
    //@ts-ignore
    buildArgs: vi.fn(actual.buildArgs)
  };
});

vi.mock('../utils', async () => {
  const actual = await vi.importActual('../utils');
  return {
    ...actual,
    //@ts-ignore
    getMethodType: vi.fn(actual.getMethodType)
  };
});

describe('OpenApiAxios', () => {
  it('should create axios instance if no axiosInstance provided', () => {
    const spy = vi.spyOn(axios, 'create');
    const configs = { decompress: true };
    const instance = OpenApiStyleAxios(configs);

    expect(spy).toHaveBeenCalled();
    expect(typeof instance === 'function').toBeTruthy();
    expect(instance.defaults).toBeDefined();
    expect(instance.interceptors).toBeDefined();
    expect(instance.getUri).toBeDefined();
    expect(instance.request).toBeDefined();
    expect(instance.get).toBeDefined();
    expect(instance.delete).toBeDefined();
    expect(instance.head).toBeDefined();
    expect(instance.options).toBeDefined();
    expect(instance.post).toBeDefined();
    expect(instance.put).toBeDefined();
    expect(instance.patch).toBeDefined();
    expect(instance.postForm).toBeDefined();
    expect(instance.putForm).toBeDefined();
    expect(instance.patchForm).toBeDefined();
  });

  it('should use provided axios instance if passed', () => {
    const customAxiosInstance = axios.create();
    const configs = { decompress: true };
    const instance = OpenApiStyleAxios(customAxiosInstance, configs);

    expect(typeof instance === 'function').toBeTruthy();
    expect(instance.defaults).toBeDefined();
    expect(instance.interceptors).toBeDefined();
    expect(instance.getUri).toBeDefined();
    expect(instance.request).toBeDefined();
    expect(instance.get).toBeDefined();
    expect(instance.delete).toBeDefined();
    expect(instance.head).toBeDefined();
    expect(instance.options).toBeDefined();
    expect(instance.post).toBeDefined();
    expect(instance.put).toBeDefined();
    expect(instance.patch).toBeDefined();
    expect(instance.postForm).toBeDefined();
    expect(instance.putForm).toBeDefined();
    expect(instance.patchForm).toBeDefined();
  });

  it('should handle custom configs if no axiosInstance provided', () => {
    const configs = { decompress: true };
    OpenApiStyleAxios(configs);

    expect(mergeConfig).toHaveBeenCalledWith(DEFAULT_CONFIGS, configs);
  });

  it('should handle custom configs with provided axios instance', () => {
    const customAxiosInstance = axios.create();
    const configs = { decompress: true };
    OpenApiStyleAxios(customAxiosInstance, configs);

    expect(mergeConfig).toHaveBeenCalledWith(DEFAULT_CONFIGS, configs);
  });

  it('should call buildArgs if method is target method', async () => {
    const customAxiosInstance = axios.create();
    const spy = vi.spyOn(customAxiosInstance, 'get').mockResolvedValue(true);

    const configs = { decompress: true };
    const instance = OpenApiStyleAxios(customAxiosInstance, configs);

    const args = ['/path'] as const;
    await instance.get(...args);

    expect(getMethodType).toHaveBeenCalled();
    expect(vi.mocked(getMethodType).mock.results[0].value).toBeTruthy();
    expect(buildArgs).toHaveBeenCalledWith(
      args,
      vi.mocked(getMethodType).mock.results[0].value,
      vi.mocked(mergeConfig).mock.results[0].value
    );
    expect(spy).toHaveBeenCalledWith(...vi.mocked(buildArgs).mock.results[0].value);
  });

  it('should not call buildArgs if method is not target method', async () => {
    const customAxiosInstance = axios.create({
      baseURL: '/base'
    });

    const other = vi.fn();
    //@ts-ignore
    customAxiosInstance.other = other;

    const configs = { decompress: true };
    const instance = OpenApiStyleAxios(customAxiosInstance, configs);

    const args = ['/path'] as const;
    //@ts-ignore
    await instance.other(args);

    expect(getMethodType).toHaveBeenCalled();
    expect(vi.mocked(getMethodType).mock.results[0].value).toBeFalsy();
    expect(buildArgs).not.toHaveBeenCalled();
    expect(other).toHaveBeenCalledWith(args);
  });

  it('should call buildArgs if calling itself with arguments', async () => {
    const customAxiosInstance = vi.fn(axios.create()).mockResolvedValue(true);

    const configs = { decompress: true };
    //@ts-ignore
    const instance = OpenApiStyleAxios(customAxiosInstance, configs);

    const args = ['/path'] as const;
    await instance(...args);

    expect(buildArgs).toHaveBeenCalledWith(args, args.length, vi.mocked(mergeConfig).mock.results[0].value);
    expect(customAxiosInstance).toHaveBeenCalledWith(...vi.mocked(buildArgs).mock.results[0].value);
  });

  it('should not call buildArgs if calling itself without arguments', async () => {
    const customAxiosInstance = vi.fn(axios.create()).mockResolvedValue(true);

    const configs = { decompress: true };
    //@ts-ignore
    const instance = OpenApiStyleAxios(customAxiosInstance, configs);
    //@ts-ignore
    await instance();

    expect(buildArgs).not.toHaveBeenCalled();
    expect(customAxiosInstance).toHaveBeenCalledWith();
  });
});
