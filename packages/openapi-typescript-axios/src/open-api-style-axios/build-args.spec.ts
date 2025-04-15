import { mergeConfig } from 'axios';
import { normalizeConfigs } from '../utils';
import { buildArgs } from './build-args';

vi.mock('axios', async () => {
  const actual = await vi.importActual('axios');
  return {
    ...actual,
    //@ts-ignore
    mergeConfig: vi.fn(actual.mergeConfig)
  };
});

vi.mock('../utils', async () => {
  const actual = await vi.importActual('../utils');
  return {
    ...actual,
    //@ts-ignore
    normalizeConfigs: vi.fn(actual.normalizeConfigs)
  };
});

describe('buildArgs', () => {
  it('should handle methodType 3 with url, data, and config', () => {
    const pathSerializer = vi.fn((u, p) => `${u}?p=${p.id}`);
    const bodySerializer = vi.fn((b) => JSON.stringify(b));
    const querySerializer = vi.fn(() => 'query=1');

    const configs = {
      headers: { i: 2 },
      url: '/default',
      pathSerializer,
      bodySerializer,
      querySerializer
    };

    const args: [any, any, any] = [
      '/custom',
      {
        path: { id: 123 },
        body: { foo: 'bar' },
        query: { a: 1 }
      },
      { headers: { h: 1 } }
    ];
    const result = buildArgs(args, 3, { decompress: true, ...configs });

    expect(result[0]).toBe('/custom?p=123');
    expect(result[1]).toEqual(JSON.stringify({ foo: 'bar' }));
    expect(result[2]).toMatchObject({
      headers: { h: 1, i: 2 },
      decompress: true,
      params: { a: 1 },
      paramsSerializer: querySerializer,
      data: JSON.stringify({ foo: 'bar' })
    });

    expect(mergeConfig).toHaveBeenCalled();
    expect(normalizeConfigs).toHaveBeenCalledWith(vi.mocked(mergeConfig).mock.results[0].value);
    expect(bodySerializer).toHaveBeenCalled();
    expect(pathSerializer).toHaveBeenCalled();
    expect(querySerializer).not.toHaveBeenCalled();
  });

  it('should handle methodType 2 with url and config', () => {
    const result = buildArgs(['/path', { query: { q: 1 } }], 2);
    expect(result).toHaveLength(2);
    expect(result[0]).toBe('/path');
    expect(result[1]).toMatchObject({ params: { q: 1 } });
  });

  it('should handle methodType 1 with only config', () => {
    const result = buildArgs(['/path', { query: { q: 1 } }], 1);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ params: { q: 1 } });
  });

  it('should merge defaultConfigs when provided', () => {
    const result = buildArgs([undefined], 1, { baseURL: 'https://api', query: { a: 1 } });

    expect(result[0]).toMatchObject({
      baseURL: 'https://api',
      params: { a: 1 }
    });
  });
});
