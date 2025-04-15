import { defaultPathSerializer } from './default-path-serializer';
import { serializeArrayParam } from './serialize-array-param';
import { serializeObjectParam } from './serialize-object-param';
import { serializePrimitiveParam } from './serialize-primitive-param';

vi.mock('./serialize-array-param', async () => {
  const actual = await vi.importActual('./serialize-array-param');
  return {
    ...actual,
    //@ts-ignore
    serializeArrayParam: vi.fn(actual.serializeArrayParam)
  };
});

vi.mock('./serialize-object-param', async () => {
  const actual = await vi.importActual('./serialize-object-param');
  return {
    ...actual,
    //@ts-ignore
    serializeObjectParam: vi.fn(actual.serializeObjectParam)
  };
});

vi.mock('./serialize-primitive-param', async () => {
  const actual = await vi.importActual('./serialize-primitive-param');
  return {
    ...actual,
    //@ts-ignore
    serializePrimitiveParam: vi.fn(actual.serializePrimitiveParam)
  };
});

describe('defaultPathSerializer', () => {
  it('replaces simple path param with string value', () => {
    const result = defaultPathSerializer('/pet/{petId}', { petId: '123' });
    expect(result).toBe('/pet/123');
  });

  it('replaces label-style param with string value', () => {
    const result = defaultPathSerializer('/pet/{.petId}', { petId: 'abc/def' });
    expect(result).toBe('/pet/.abc%2Fdef'); // encoded
  });

  it('replaces matrix-style param with string value', () => {
    vi.mocked(serializePrimitiveParam).mockImplementation((name, value) => `${name}=${value}`);
    const result = defaultPathSerializer('/pet/{;petId}', { petId: '123' });
    expect(result).toBe('/pet/;petId=123');
    expect(serializePrimitiveParam).toHaveBeenCalledWith('petId', '123');
  });

  it('replaces array param using serializeArrayParam (simple)', () => {
    vi.mocked(serializeArrayParam).mockReturnValue('abc,def');
    const result = defaultPathSerializer('/tags/{tagIds*}', { tagIds: ['abc', 'def'] });
    expect(result).toBe('/tags/abc,def');
    expect(serializeArrayParam).toHaveBeenCalledWith('tagIds', ['abc', 'def'], { style: 'simple', explode: true });
  });

  it('replaces object param using serializeObjectParam (matrix)', () => {
    vi.mocked(serializeObjectParam).mockReturnValue(';x=1;y=2');
    const result = defaultPathSerializer('/location/{;coords}', { coords: { x: 1, y: 2 } });
    expect(result).toBe('/location/;x=1;y=2');
    expect(serializeObjectParam).toHaveBeenCalledWith('coords', { x: 1, y: 2 }, { style: 'matrix', explode: false });
  });

  it('skips path param if undefined/null', () => {
    const result = defaultPathSerializer('/pet/{petId}/tag/{tag}', { petId: undefined, tag: null });
    expect(result).toBe('/pet/{petId}/tag/{tag}');
  });

  it('handles multiple mixed path params', () => {
    vi.mocked(serializeArrayParam).mockReturnValue('a,b');
    vi.mocked(serializeObjectParam).mockReturnValue(';x=1;y=2');
    vi.mocked(serializePrimitiveParam).mockImplementation((k, v) => `${k}=${v}`);

    const result = defaultPathSerializer('/api/{id}/filter/{;filters}/labels/{tags*}/name/{.name}', {
      id: '999',
      filters: { x: 1, y: 2 },
      tags: ['a', 'b'],
      name: 'space here'
    });
    expect(result).toBe('/api/999/filter/;x=1;y=2/labels/a,b/name/.space%20here');
  });

  it('should handle empty pathname', () => {
    const result = defaultPathSerializer('', {});
    expect(result).toBe('');
  });
});
