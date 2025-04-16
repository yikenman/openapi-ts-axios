import type {
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponseHeaders,
  CustomParamsSerializer,
  ParamsSerializerOptions,
  RawAxiosResponseHeaders
} from 'axios';
import type { RequiredKeysOf } from 'openapi-typescript-helpers';
export * from './ots/types';

export type AxiosInstanceHttpMethods = 'get' | 'delete' | 'head' | 'options';
export type AxiosInstanceHttpDataMethods = 'post' | 'put' | 'patch' | 'postForm' | 'putForm' | 'patchForm';

export type AxiosInstanceMethods = 'getUri' | 'request' | AxiosInstanceHttpMethods | AxiosInstanceHttpDataMethods;

export type IfNotUnderfined<Cond, TrueResult, FalseResult> = Cond extends undefined ? FalseResult : TrueResult;

export type DefaultOptionParams = {
  query?: Record<string, unknown>;
  path?: Record<string, unknown>;
};

export type PickOptionParams<Params extends DefaultOptionParams, Keys = keyof Params> = ('query' extends Keys
  ? Pick<Params, 'query'> & { query?: Record<string, unknown> }
  : { query?: Record<string, unknown> }) &
  ('path' extends Keys
    ? Pick<Params, 'path'> & { path?: Record<string, unknown> }
    : { path?: Record<string, unknown> });

export type BodyObject<Data> = RequiredKeysOf<Data> extends never ? { body?: Data & {} } : { body: Data & {} };

export type NormalizedConfigs = {
  axiosConfigs: Omit<AxiosRequestConfig, 'params' | 'paramsSerializer' | 'data'>;
  paramsConfigs: Partial<
    Pick<OpenAPIAxiosRequestConfig, 'path' | 'pathSerializer' | 'query' | 'querySerializer' | 'body' | 'bodySerializer'>
  >;
};

export type OpenAPIAxiosRequestConfig<Data = any, Params = DefaultOptionParams> = Omit<
  AxiosRequestConfig,
  'query' | 'path' | 'params' | 'data' | 'withXSRFToken'
> &
  Params & {
    querySerializer?: ParamsSerializerOptions | CustomParamsSerializer;
    params?: any;
    paramsSerializer?: ParamsSerializerOptions | CustomParamsSerializer;
    pathSerializer?: (pathname: string, pathParams: Record<string, unknown>) => string;
    body?: Data;
    bodySerializer?: (data?: Data) => any;
    data?: Data;
    dataSerializer?: (data?: Data) => any;
    withXSRFToken?:
      | boolean
      | ((config: Omit<InternalOpenApiAxiosRequestConfig<Data, Params>, 'withXSRFToken'>) => boolean | undefined);
  };

export type InternalOpenApiAxiosRequestConfig<D = any, P = DefaultOptionParams> = OpenAPIAxiosRequestConfig<D, P> & {
  headers: AxiosRequestHeaders;
};

export type OpenApiAxiosResponse<T = any, D = any, P = DefaultOptionParams> = {
  data: T;
  status: number;
  statusText: string;
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders;
  config: InternalOpenApiAxiosRequestConfig<D, P>;
  request?: any;
};
