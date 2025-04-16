import type {
  ErrorResponse,
  IsOperationRequestBodyOptional,
  MediaType,
  OperationRequestBodyContent,
  RequiredKeysOf,
  ResponseObjectMap,
  SuccessResponse
} from 'openapi-typescript-helpers';

export interface DefaultParamsOption {
  params?: {
    query?: Record<string, unknown>;
  };
}

export type ParamsOption<T> = T extends {
  parameters: any;
}
  ? RequiredKeysOf<T['parameters']> extends never
    ? { params?: T['parameters'] }
    : { params: T['parameters'] }
  : DefaultParamsOption;

export type RequestBodyOption<T> = OperationRequestBodyContent<T> extends never
  ? { body?: never }
  : IsOperationRequestBodyOptional<T> extends true
    ? { body?: OperationRequestBodyContent<T> }
    : { body: OperationRequestBodyContent<T> };

export type RequestOptions<T> = ParamsOption<T> & RequestBodyOption<T>;

export type FetchOptions<T> = RequestOptions<T>;

export type BodyType<T = unknown> = {
  json: T;
  text: Awaited<ReturnType<Response['text']>>;
  blob: Awaited<ReturnType<Response['blob']>>;
  arrayBuffer: Awaited<ReturnType<Response['arrayBuffer']>>;
  stream: Response['body'];
};
export type ParseAs = keyof BodyType;
export type ParseAsResponse<T, Options> = Options extends {
  parseAs: ParseAs;
}
  ? BodyType<T>[Options['parseAs']]
  : T;

export type FetchResponse<T extends Record<string | number, any>, Options, Media extends MediaType> =
  | {
      data: ParseAsResponse<SuccessResponse<ResponseObjectMap<T>, Media>, Options>;
      error?: never;
      response: Response;
    }
  | {
      data?: never;
      error: ErrorResponse<ResponseObjectMap<T>, Media>;
      response: Response;
    };
