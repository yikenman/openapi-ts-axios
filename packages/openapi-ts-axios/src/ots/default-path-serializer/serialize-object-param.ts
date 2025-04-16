import { serializePrimitiveParam } from './serialize-primitive-param';

export function serializeObjectParam(
  name: string,
  value: Record<string, unknown>,
  options: {
    style: 'simple' | 'label' | 'matrix' | 'form' | 'deepObject';
    explode: boolean;
    allowReserved?: boolean;
  }
): string {
  if (!value || typeof value !== 'object') {
    return '';
  }
  const values: string[] = [];
  const joiner =
    {
      simple: ',',
      label: '.',
      matrix: ';'
    }[options.style] || '&';

  // explode: false
  if (options.style !== 'deepObject' && options.explode === false) {
    for (const k in value) {
      values.push(k, options.allowReserved === true ? (value[k] as string) : encodeURIComponent(value[k] as string));
    }
    const final = values.join(','); // note: values are always joined by comma in explode: false (but joiner can prefix)
    switch (options.style) {
      case 'form': {
        return `${name}=${final}`;
      }
      case 'label': {
        return `.${final}`;
      }
      case 'matrix': {
        return `;${name}=${final}`;
      }
      default: {
        return final;
      }
    }
  }

  // explode: true
  for (const k in value) {
    const finalName = options.style === 'deepObject' ? `${name}[${k}]` : k;
    values.push(serializePrimitiveParam(finalName, value[k] as string, options));
  }
  const final = values.join(joiner);
  return options.style === 'label' || options.style === 'matrix' ? `${joiner}${final}` : final;
}
