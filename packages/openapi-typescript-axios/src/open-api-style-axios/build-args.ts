import { type AxiosRequestConfig, mergeConfig } from 'axios';
import type { OpenAPIAxiosRequestConfig } from '../types';
import { type getMethodType, normalizeConfigs } from '../utils';

export const buildArgs = (
  args: [
    string?,
    {
      path?: Record<string, unknown>;
      query?: Record<string, unknown>;
      body?: Record<string, unknown>;
    }?,
    OpenAPIAxiosRequestConfig?
  ],
  methodType: Omit<ReturnType<typeof getMethodType>, 0>,
  defaultConfigs?: OpenAPIAxiosRequestConfig
) => {
  const [url, params, configs] = args;

  const { paramsConfigs, axiosConfigs } = normalizeConfigs(mergeConfig(defaultConfigs ?? {}, configs ?? {}));
  let newUrl = url || axiosConfigs.url;
  let newPath = params?.path || paramsConfigs.path;
  let newQuery = params?.query || paramsConfigs.query;
  let newBody = params?.body || paramsConfigs.body;
  let newConfig: AxiosRequestConfig = { ...axiosConfigs };

  if (paramsConfigs.pathSerializer && newUrl && newPath) {
    newUrl = paramsConfigs.pathSerializer(newUrl, newPath);
  }

  newConfig.params = newQuery;
  newConfig.paramsSerializer = paramsConfigs.querySerializer;

  if (paramsConfigs.bodySerializer && newBody) {
    newBody = paramsConfigs.bodySerializer(newBody);
  }
  newConfig.data = newBody;

  let newArgs: any[] = [];

  switch (methodType) {
    case 3:
      newArgs = [newUrl, newBody, newConfig];
      break;
    case 2:
      newArgs = [newUrl, newConfig];
      break;
    case 1:
    default:
      newArgs = [newConfig];
      break;
  }

  return newArgs;
};
