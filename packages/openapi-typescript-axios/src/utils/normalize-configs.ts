import type { NormalizedConfigs, OpenAPIAxiosRequestConfig } from '../types';

export const normalizeConfigs = (configs?: OpenAPIAxiosRequestConfig) => {
  let axiosConfigs: NormalizedConfigs['axiosConfigs'] = {};
  let paramsConfigs: NormalizedConfigs['paramsConfigs'] = {};

  if (!configs) {
    return { axiosConfigs, paramsConfigs };
  }

  const {
    path,
    pathSerializer,
    params,
    paramsSerializer,
    query,
    querySerializer,
    body,
    bodySerializer,
    data,
    dataSerializer,
    ...rest
  } = configs;

  axiosConfigs = rest;

  paramsConfigs = {
    path,
    pathSerializer,
    query: query ?? params,
    querySerializer: querySerializer ?? paramsSerializer,
    body: body ?? data,
    bodySerializer: bodySerializer ?? dataSerializer
  } as const;

  return { axiosConfigs, paramsConfigs };
};
