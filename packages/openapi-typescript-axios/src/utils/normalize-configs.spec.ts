import { normalizeConfigs } from './normalize-configs';

describe('normalizeConfigs', () => {
  it('should return empty configs when input is undefined', () => {
    const result = normalizeConfigs();
    expect(result).toEqual({
      axiosConfigs: {},
      paramsConfigs: {}
    });
  });

  it('should return all values under axiosConfigs when no param-specific fields', () => {
    const result = normalizeConfigs({ timeout: 1000, headers: { a: 1 } });
    expect(result).toEqual({
      axiosConfigs: { timeout: 1000, headers: { a: 1 } },
      paramsConfigs: {}
    });
  });

  it('should normalize path and pathSerializer', () => {
    const result = normalizeConfigs({
      path: { id: 123 },
      pathSerializer: () => 'serialized-path'
    });
    expect(result.paramsConfigs).toEqual({
      path: { id: 123 },
      pathSerializer: expect.any(Function),
      query: undefined,
      querySerializer: undefined,
      body: undefined,
      bodySerializer: undefined
    });
  });

  it('should prioritize query over params', () => {
    const result = normalizeConfigs({
      params: { a: 1 },
      query: { q: 2 }
    });
    expect(result.paramsConfigs.query).toEqual({ q: 2 });
  });

  it('should fallback to params if query is undefined', () => {
    const result = normalizeConfigs({
      params: { p: 999 }
    });
    expect(result.paramsConfigs.query).toEqual({ p: 999 });
  });

  it('should prioritize querySerializer over paramsSerializer', () => {
    const querySerializer = () => 'qs';
    const paramsSerializer = () => 'ps';
    const result = normalizeConfigs({
      querySerializer,
      paramsSerializer
    });
    expect(result.paramsConfigs.querySerializer).toBe(querySerializer);
  });

  it('should fallback to paramsSerializer if querySerializer is not provided', () => {
    const paramsSerializer = () => 'ps';
    const result = normalizeConfigs({
      paramsSerializer
    });
    expect(result.paramsConfigs.querySerializer).toBe(paramsSerializer);
  });

  it('should prioritize body over data', () => {
    const result = normalizeConfigs({
      body: { foo: 'bar' },
      data: { bar: 'baz' }
    });
    expect(result.paramsConfigs.body).toEqual({ foo: 'bar' });
  });

  it('should fallback to data if body is not provided', () => {
    const result = normalizeConfigs({
      data: { d: 123 }
    });
    expect(result.paramsConfigs.body).toEqual({ d: 123 });
  });

  it('should prioritize bodySerializer over dataSerializer', () => {
    const bodySerializer = () => 'bs';
    const dataSerializer = () => 'ds';
    const result = normalizeConfigs({
      bodySerializer,
      dataSerializer
    });
    expect(result.paramsConfigs.bodySerializer).toBe(bodySerializer);
  });

  it('should fallback to dataSerializer if bodySerializer is not provided', () => {
    const dataSerializer = () => 'ds';
    const result = normalizeConfigs({
      dataSerializer
    });
    expect(result.paramsConfigs.bodySerializer).toBe(dataSerializer);
  });

  it('should only put non-special fields into axiosConfigs', () => {
    const result = normalizeConfigs({
      path: {},
      query: {},
      body: {},
      //@ts-ignore
      pathSerializer: () => {},
      //@ts-ignore
      querySerializer: () => {},
      bodySerializer: () => {},
      timeout: 1000,
      withCredentials: true
    });
    expect(result.axiosConfigs).toEqual({
      timeout: 1000,
      withCredentials: true
    });
  });
});
