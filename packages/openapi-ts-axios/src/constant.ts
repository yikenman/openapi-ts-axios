import type { OpenAPIAxiosRequestConfig } from './types';
import { defaultPathSerializer } from './utils';

export const DEFAULT_CONFIGS: OpenAPIAxiosRequestConfig = {
  pathSerializer: defaultPathSerializer
};
