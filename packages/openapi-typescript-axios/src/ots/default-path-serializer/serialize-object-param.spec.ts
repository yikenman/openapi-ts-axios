import { serializeObjectParam } from './serialize-object-param';
import { serializePrimitiveParam } from './serialize-primitive-param';

vi.mock('./serialize-primitive-param', async () => {
  const actual = await vi.importActual('./serialize-primitive-param');
  return {
    ...actual,
    //@ts-ignore
    serializePrimitiveParam: vi.fn(actual.serializePrimitiveParam)
  };
});

describe('serializeObjectParam', () => {
  let obj: Record<string, unknown>;

  beforeEach(() => {
    obj = { a: '1', b: '2' };
  });

  it('should return empty string if input is null or not object', () => {
    expect(serializeObjectParam('key', null as any, { style: 'form', explode: false })).toBe('');
    expect(serializeObjectParam('key', 'str' as any, { style: 'form', explode: false })).toBe('');
  });

  describe('explode: false', () => {
    it('should serialize with style: form', () => {
      expect(serializeObjectParam('key', obj, { style: 'form', explode: false })).toBe('key=a,1,b,2');
    });

    it('should serialize with style: label', () => {
      expect(serializeObjectParam('key', obj, { style: 'label', explode: false })).toBe('.a,1,b,2');
    });

    it('should serialize with style: matrix', () => {
      expect(serializeObjectParam('key', obj, { style: 'matrix', explode: false })).toBe(';key=a,1,b,2');
    });

    it('should encode values when allowReserved is false', () => {
      const val = { q: 'a/b', x: 'c d' };
      expect(serializeObjectParam('key', val, { style: 'form', explode: false })).toBe('key=q,a%2Fb,x,c%20d');
    });

    it('should not encode values when allowReserved is true', () => {
      const val = { q: 'a/b', x: 'c d' };
      expect(serializeObjectParam('key', val, { style: 'form', explode: false, allowReserved: true })).toBe(
        'key=q,a/b,x,c d'
      );
    });

    it('should serialize with invalid style', () => {
      //@ts-ignore
      expect(serializeObjectParam('key', obj, { style: 'invalid', explode: false })).toBe('a,1,b,2');
    });
  });

  describe('explode: true', () => {
    it('should serialize with style: simple', () => {
      expect(serializeObjectParam('key', obj, { style: 'simple', explode: true })).toBe('a=1,b=2');
    });

    it('should serialize with style: label', () => {
      expect(serializeObjectParam('key', obj, { style: 'label', explode: true })).toBe('.a=1.b=2');
    });

    it('should serialize with style: matrix', () => {
      expect(serializeObjectParam('key', obj, { style: 'matrix', explode: true })).toBe(';a=1;b=2');
    });

    it('should serialize with style: deepObject', () => {
      expect(serializeObjectParam('key', obj, { style: 'deepObject', explode: true })).toBe('key[a]=1&key[b]=2');
    });

    it('should default to "&" if style unknown', () => {
      expect(serializeObjectParam('key', obj, { style: 'unknown' as any, explode: true })).toBe('a=1&b=2');
    });
  });
});
