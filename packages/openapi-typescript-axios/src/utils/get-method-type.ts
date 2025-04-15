import { type AxiosInstance } from 'axios';

export const getMethodType = (prop: string) => {
  switch (prop as keyof AxiosInstance) {
    case 'getUri':
    case 'request':
      return 1;
    case 'get':
    case 'delete':
    case 'head':
    case 'options':
      return 2;
    case 'post':
    case 'put':
    case 'patch':
    case 'postForm':
    case 'putForm':
    case 'patchForm':
      return 3;
    default:
      return 0;
  }
};
