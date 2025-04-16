import type { Axios, AxiosInstance } from 'axios';
import axios, { mergeConfig } from 'axios';
import type { FilterKeys, HttpMethod, MediaType, PathsWithMethod, RequiredKeysOf } from 'openapi-typescript-helpers';
import { DEFAULT_CONFIGS } from '../constant';
import type {
  AxiosInstanceMethods,
  BodyObject,
  FetchOptions,
  FetchResponse,
  IfNotUnderfined,
  OpenAPIAxiosRequestConfig,
  OpenApiAxiosResponse,
  PickOptionParams
} from '../types';
import { getMethodType } from '../utils';
import { buildArgs } from './build-args';

type OpenApiStyleInstanceMethod<
  Paths extends Record<string, Record<HttpMethod, {}>>,
  Method extends HttpMethod,
  Media extends MediaType,
  PathType extends PathsWithMethod<Paths, Method> = PathsWithMethod<Paths, Method>
> = <
  T extends any = undefined,
  R extends any = IfNotUnderfined<T, OpenApiAxiosResponse<T>, undefined>,
  D extends any = undefined,
  Path extends PathType | {} = PathType | {},
  P extends Path extends PathType ? Paths[Path] : Record<HttpMethod, {}> = Path extends PathType
    ? Paths[Path]
    : Record<HttpMethod, {}>,
  PM extends IfNotUnderfined<P, P[Method], undefined> = IfNotUnderfined<P, P[Method], undefined>,
  O extends FetchOptions<FilterKeys<P, Method>> = FetchOptions<FilterKeys<P, Method>>,
  OD = O['body'],
  OP extends PickOptionParams<NonNullable<O['params']>> = PickOptionParams<NonNullable<O['params']>>,
  IT = IfNotUnderfined<T, T, IfNotUnderfined<PM, NonNullable<FetchResponse<PM, O, Media>['data']>, undefined>>,
  ID = IfNotUnderfined<D, D, OD> & {},
  FD extends ID = ID,
  IR = IfNotUnderfined<R, R, OpenApiAxiosResponse<IT, FD, OP>>,
  FR extends IR = IR,
  IParams = OP & BodyObject<FD> & {},
  Params extends IParams = IParams
>(
  url: Path,
  ...args: RequiredKeysOf<Params> extends never
    ? [params?: Params, config?: Partial<OpenAPIAxiosRequestConfig<FD, OP>>]
    : [params: Params, config?: Partial<OpenAPIAxiosRequestConfig<FD, OP>>]
) => Promise<FR>;

export interface OpenAPIStyleAxiosInstance<Paths extends {}> extends Omit<Axios, AxiosInstanceMethods> {
  <T = any, R = OpenApiAxiosResponse<T>, D = any>(config: OpenAPIAxiosRequestConfig<D>): Promise<R>;
  <T = any, R = OpenApiAxiosResponse<T>, D = any>(url: string, config?: OpenAPIAxiosRequestConfig<D>): Promise<R>;
  getUri(config?: OpenAPIAxiosRequestConfig): string;
  request<T = any, R = OpenApiAxiosResponse<T>, D = any>(config: OpenAPIAxiosRequestConfig<D>): Promise<R>;
  get: OpenApiStyleInstanceMethod<Paths, 'get', MediaType>;
  delete: OpenApiStyleInstanceMethod<Paths, 'delete', MediaType>;
  head: OpenApiStyleInstanceMethod<Paths, 'head', MediaType>;
  options: OpenApiStyleInstanceMethod<Paths, 'options', MediaType>;
  post: OpenApiStyleInstanceMethod<Paths, 'post', MediaType>;
  put: OpenApiStyleInstanceMethod<Paths, 'put', MediaType>;
  patch: OpenApiStyleInstanceMethod<Paths, 'patch', MediaType>;
  // openapi-typescript doesn't support filtering request body by media type.
  // so the function signature makes no difference with xxxForm.
  // see https://github.com/openapi-ts/openapi-typescript/blob/b19f43286baca978044ca632c80854e3fd30bc87/packages/openapi-typescript-helpers/index.d.ts#L115
  postForm: OpenApiStyleInstanceMethod<Paths, 'post', MediaType>;
  putForm: OpenApiStyleInstanceMethod<Paths, 'put', MediaType>;
  patchForm: OpenApiStyleInstanceMethod<Paths, 'patch', MediaType>;
}

export function OpenApiStyleAxios<Paths extends {}>(axiosInstance?: AxiosInstance): OpenAPIStyleAxiosInstance<Paths>;
export function OpenApiStyleAxios<Paths extends {}>(
  configs?: OpenAPIAxiosRequestConfig
): OpenAPIStyleAxiosInstance<Paths>;
export function OpenApiStyleAxios<Paths extends {}>(
  axiosInstance: AxiosInstance,
  configs?: OpenAPIAxiosRequestConfig
): OpenAPIStyleAxiosInstance<Paths>;
export function OpenApiStyleAxios<Paths extends {}>(...args: any[]): OpenAPIStyleAxiosInstance<Paths> {
  const [p0, p1] = args;

  let axiosInstance = typeof p0 === 'function' ? p0 : undefined;
  const defaultConfigs = mergeConfig(DEFAULT_CONFIGS, axiosInstance ? p1 : p0);

  if (!axiosInstance) {
    axiosInstance = axios.create();
  }

  const handler: ProxyHandler<AxiosInstance> = {
    get(target, prop: string, receiver) {
      const originalValue = Reflect.get(target, prop, receiver);

      const methodType = getMethodType(prop);

      if (!methodType) {
        return originalValue;
      }

      return (...args: [any?, any?, any?]) => {
        const newArgs = buildArgs(args, methodType, defaultConfigs);

        return Reflect.apply(originalValue, receiver, newArgs);
      };
    },
    apply(target, thisArg, args: [any?, any?]) {
      const methodType = args.length ? (typeof args[0] === 'string' ? 2 : 1) : 0;

      if (!methodType) {
        return Reflect.apply(target, thisArg, args);
      }

      const newArgs = buildArgs(
        methodType === 2 ? [args[0], undefined, args[1]] : [undefined, undefined, args[0]],
        methodType,
        defaultConfigs
      );

      return Reflect.apply(target, thisArg, newArgs);
    }
  };

  return new Proxy(axiosInstance, handler) as any;
}
