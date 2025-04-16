import { serializeArrayParam } from './serialize-array-param';
import { serializePrimitiveParam } from './serialize-primitive-param';

vi.mock('./serialize-primitive-param', async () => {
  const actual = await vi.importActual('./serialize-primitive-param');
  return {
    ...actual,
    //@ts-ignore
    serializePrimitiveParam: vi.fn(actual.serializePrimitiveParam)
  };
});

describe('serializeArrayParam', () => {
  let arr: string[];

  beforeEach(() => {
    arr = ['a', 'b', 'c'];
  });

  it('should return empty string if value is not array', () => {
    expect(serializeArrayParam('key', null as any, { style: 'simple', explode: false })).toBe('');
    expect(serializeArrayParam('key', 'str' as any, { style: 'simple', explode: false })).toBe('');
  });

  it('should call serializePrimitiveParam when explode=true and style=matrix', () => {
    vi.mocked(serializePrimitiveParam).mockImplementation((name, value) => `${name}=${value}-mock`);

    const result = serializeArrayParam('key', ['a', 'b'], {
      style: 'matrix',
      explode: true
    });

    expect(result).toBe(';key=a-mock;key=b-mock');
    expect(serializePrimitiveParam).toHaveBeenCalledTimes(2);
    expect(serializePrimitiveParam).toHaveBeenCalledWith('key', 'a', {
      style: 'matrix',
      explode: true
    });
  });

  it('should skip calling serializePrimitiveParam when style is simple', () => {
    const result = serializeArrayParam('key', ['a', 'b'], {
      style: 'simple',
      explode: true
    });

    expect(result).toBe('a,b');
    expect(serializePrimitiveParam).not.toHaveBeenCalled();
  });

  describe('explode: false', () => {
    it('should serialize with style: simple', () => {
      expect(serializeArrayParam('key', arr, { style: 'simple', explode: false })).toBe('a,b,c');
    });

    it('should serialize with style: label', () => {
      expect(serializeArrayParam('key', arr, { style: 'label', explode: false })).toBe('.a,b,c');
    });

    it('should serialize with style: matrix', () => {
      expect(serializeArrayParam('key', arr, { style: 'matrix', explode: false })).toBe(';key=a,b,c');
    });

    it('should encode if allowReserved is false', () => {
      const value = ['a/b', 'c d'];
      expect(serializeArrayParam('key', value, { style: 'simple', explode: false })).toBe('a%2Fb,c%20d');
    });

    it('should not encode if allowReserved is true', () => {
      const value = ['a/b', 'c d'];
      expect(serializeArrayParam('key', value, { style: 'simple', explode: false, allowReserved: true })).toBe(
        'a/b,c d'
      );
    });
    it('should serialize with invalid style', () => {
      //@ts-ignore
      expect(serializeArrayParam('key', arr, { style: 'invalid', explode: false })).toBe('key=a,b,c');
    });
  });

  describe('explode: true', () => {
    it('should serialize with style: simple', () => {
      expect(serializeArrayParam('key', arr, { style: 'simple', explode: true })).toBe('a,b,c');
    });

    it('should serialize with style: label', () => {
      expect(serializeArrayParam('key', arr, { style: 'label', explode: true })).toBe('.a.b.c');
    });

    it('should serialize with style: matrix', () => {
      expect(serializeArrayParam('key', arr, { style: 'matrix', explode: true })).toBe(';key=a;key=b;key=c');
    });

    it('should default to "&" joiner if unknown style', () => {
      expect(serializeArrayParam('key', arr, { style: 'unknown' as any, explode: true })).toBe('key=a&key=b&key=c');
    });

    it('should not encode if allowReserved is true', () => {
      const value = ['a/b', 'c d'];
      expect(serializeArrayParam('key', value, { style: 'simple', explode: true, allowReserved: true })).toBe(
        'a/b,c d'
      );
    });
  });
});
