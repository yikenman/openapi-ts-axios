import { serializePrimitiveParam } from './serialize-primitive-param';

describe('serializePrimitiveParam', () => {
  it('returns encoded string for normal value', () => {
    expect(serializePrimitiveParam('key', 'value')).toBe('key=value');
    expect(serializePrimitiveParam('key', 'a b')).toBe('key=a%20b');
  });

  it('respects allowReserved = true (no encoding)', () => {
    expect(serializePrimitiveParam('key', 'a/b', { allowReserved: true })).toBe('key=a/b');
  });

  it('encodes reserved characters when allowReserved is false', () => {
    expect(serializePrimitiveParam('key', 'a/b', { allowReserved: false })).toBe('key=a%2Fb');
  });

  it('returns empty string for undefined/null values', () => {
    expect(serializePrimitiveParam('key', undefined as any)).toBe('');
    expect(serializePrimitiveParam('key', null as any)).toBe('');
  });

  it('throws error when value is object', () => {
    expect(() => serializePrimitiveParam('key', {} as any)).toThrowError(
      "Deeply-nested arrays/objects aren't supported. Provide your own `querySerializer()` to handle these."
    );
  });
});
