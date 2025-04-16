import { serializePrimitiveParam } from './serialize-primitive-param';
import type { Style } from './types';

export function serializeArrayParam(
  name: string,
  value: unknown[],
  options: {
    style: Style;
    explode: boolean;
    allowReserved?: boolean;
  }
): string {
  if (!Array.isArray(value)) {
    return '';
  }

  // explode: false
  if (options.explode === false) {
    const joiner = { form: ',', spaceDelimited: '%20', pipeDelimited: '|' }[options.style] || ','; // note: for arrays, joiners vary wildly based on style + explode behavior
    const final = (options.allowReserved === true ? value : value.map((v) => encodeURIComponent(v as string))).join(
      joiner
    );
    switch (options.style) {
      case 'simple': {
        return final;
      }
      case 'label': {
        return `.${final}`;
      }
      case 'matrix': {
        return `;${name}=${final}`;
      }
      // case "spaceDelimited":
      // case "pipeDelimited":
      default: {
        return `${name}=${final}`;
      }
    }
  }

  // explode: true
  const joiner = { simple: ',', label: '.', matrix: ';' }[options.style] || '&';
  const values: string[] = [];
  for (const v of value) {
    if (options.style === 'simple' || options.style === 'label') {
      values.push(options.allowReserved === true ? (v as string) : encodeURIComponent(v as string));
    } else {
      values.push(serializePrimitiveParam(name, v as string, options));
    }
  }
  return options.style === 'label' || options.style === 'matrix'
    ? `${joiner}${values.join(joiner)}`
    : values.join(joiner);
}
