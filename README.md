# openapi-ts-axios

[![NPM Version](https://img.shields.io/npm/v/openapi-ts-axios)
](https://www.npmjs.com/package/openapi-ts-axios)
![NPM License](https://img.shields.io/npm/l/openapi-ts-axios)
[![codecov](https://codecov.io/gh/yikenman/openapi-ts-axios/graph/badge.svg?token=43EG2T8LKS)](https://codecov.io/gh/yikenman/openapi-ts-axios)

An intelligent, type-safe [`Axios`](https://axios-http.com/) wrapper powered by OpenAPI schemas.

---

## Features

- ✅ Supports OpenAPI 3.0 and 3.1

- ✅ Zero codegen, 100% type-driven

- ✅ Fully compatible with [`Axios`](https://axios-http.com/)

- ✅ Intelligent type inference

- ✅ 100% test coverage


## Install

```bash
$ npm install --save openapi-ts-axios axios
```

## Basic Usage

### 1. Generate typescript definition with [`openapi-typescript`](https://openapi-ts.dev/introduction).

```bash
npx openapi-typescript https://petstore3.swagger.io/api/v3/openapi.yaml -o petstore.d.ts

```

### 2. Create typed Axios instance.

```ts
import axios from 'axios;
import { OpenApiAxios } from 'openapi-ts-axios';
import type { paths } from './petstore.d.ts';


const instance = OpenApiAxios<paths>(axios.create());

// will automatically provides type hints:
// instance.get('/pet/{petId}', { path: { petId: 1 } });
```

## APIs

`openapi-ts-axios` provides two API styles:

- `OpenApiAxios` – Provides same APIs as native Axios with types.

- `OpenApiStyleAxios` – Follows [`openapi-typescript style`](https://openapi-ts.dev/openapi-fetch/) for fully typed API calls.

See below differences:

### OpenApiAxios

```ts
import axios from 'axios;
import { OpenApiAxios } from 'openapi-ts-axios';
import type { paths } from './petstore.d.ts';


const instance = OpenApiAxios<paths>(axios.create());

// Axios style API:
// instance.get(path: string, configs?: OpenAPIAxiosRequestConfig)
instance.get('/pet/{petId}', { path: { petId: 1 }, headers: {'Authorization': 'Bearer xxx'} });
```

### OpenApiStyleAxios

```ts
import axios from 'axios;
import { OpenApiStyleAxios } from 'openapi-ts-axios';
import type { paths } from './petstore.d.ts';


const instance = OpenApiStyleAxios<paths>(axios.create());

// openapi-typescript style API:
// instance.get(path: string, params?: { path?: object, query?: object, body?: object }, configs?: OpenAPIAxiosRequestConfig)
instance.get('/pet/{petId}', { path: { petId: 1 } }, { headers: {'Authorization': 'Bearer xxx'} });
```

## License

MIT License