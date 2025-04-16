import { type AxiosRequestConfig, mergeConfig } from 'axios';
import type { OpenAPIAxiosRequestConfig } from '../types';
import { type getMethodType, normalizeConfigs } from '../utils';

export const buildArgs = (
  args: [any?, any?, any?],
  methodType: Omit<ReturnType<typeof getMethodType>, 0>,
  defaultConfigs?: OpenAPIAxiosRequestConfig
) => {
  let url = undefined;
  let data = undefined;
  let configs = undefined;

  switch (methodType) {
    case 3:
      [url, data, configs] = args;
      break;
    case 2:
      [url, configs] = args;
      break;
    case 1:
    default:
      [configs] = args;
      break;
  }

  const { paramsConfigs, axiosConfigs } = normalizeConfigs(mergeConfig(defaultConfigs ?? {}, configs ?? {}));
  let newUrl = url || axiosConfigs.url;
  let newPath = paramsConfigs.path;
  let newQuery = paramsConfigs.query;
  let newBody = data || paramsConfigs.body;
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
