import { type OpenAPIAxiosInstance, type OpenAPIStyleAxiosInstance, OpenApiAxios, OpenApiStyleAxios } from '../src';
import type { OpenApiAxiosResponse } from '../src/types';
import type { paths } from './stripe-api.d';

describe('OpenAPIAxiosInstance', () => {
  type InstanceType = OpenAPIAxiosInstance<paths>;
  const instance = OpenApiAxios<paths>();

  beforeEach(() => {
    vi.spyOn(instance, 'get').mockResolvedValue({});
    vi.spyOn(instance, 'post').mockResolvedValue({});
  });

  it('should return OpenAPIAxiosInstance type with correct generic', () => {
    assertType<InstanceType>(instance);
  });

  it('should hint required parameters correctly (path)', async () => {
    const result = await instance.get('/v1/accounts/{account}/bank_accounts/{id}', {
      path: { account: 'account', id: 'id' }
    });

    assertType<
      paths['/v1/accounts/{account}/bank_accounts/{id}']['get']['responses']['200']['content']['application/json']
    >(result.data);
  });

  it('should hint required parameters correctly (query)', async () => {
    const result = await instance.get('/v1/apps/secrets', {
      query: { scope: { type: 'account' } }
    });

    assertType<paths['/v1/apps/secrets']['get']['responses']['200']['content']['application/json']>(result.data);
  });

  it('should hint required parameters correctly (path/query)', async () => {
    const result = await instance.get('/v1/billing/meters/{id}/event_summaries', {
      path: { id: 'id' },
      query: { customer: 'customer', end_time: 0, start_time: 0 }
    });

    assertType<
      paths['/v1/billing/meters/{id}/event_summaries']['get']['responses']['200']['content']['application/json']
    >(result.data);
  });

  it('should hint required parameters correctly (path/body)', async () => {
    const result = await instance.post(
      '/v1/accounts/{account}/reject',
      { reason: 'reason' },
      { path: { account: 'account' } }
    );

    assertType<paths['/v1/accounts/{account}/reject']['post']['responses']['200']['content']['application/json']>(
      result.data
    );
  });

  it('should support unlisted properties (path/query)', async () => {
    const result = await instance.get('/v1/billing/meters/{id}/event_summaries', {
      path: { id: 'id', other: 'other' },
      query: { customer: 'customer', end_time: 0, start_time: 0, other: 'other' }
    });

    assertType<
      paths['/v1/billing/meters/{id}/event_summaries']['get']['responses']['200']['content']['application/json']
    >(result.data);
  });

  it('should support unlisted properties (path/body)', async () => {
    const result = await instance.post(
      '/v1/accounts/{account}/reject',
      { reason: 'reason', other: 'other' },
      { path: { account: 'account', other: 'other' } }
    );

    assertType<paths['/v1/accounts/{account}/reject']['post']['responses']['200']['content']['application/json']>(
      result.data
    );
  });

  it('should support custom url', async () => {
    const result = await instance.post('/not/in/paths', undefined);

    assertType<never>(result.data);
  });

  it('should support custom url with generics (T)', async () => {
    const result = await instance.post<{ key1: string }>('/not/in/paths', undefined);

    assertType<{ key1: string }>(result.data);
  });

  it('should support custom url with generics (T/R)', async () => {
    const result = await instance.post<{ key1: string }, OpenApiAxiosResponse<{ key2: string }>>(
      '/not/in/paths',
      undefined
    );

    assertType<{ key2: string }>(result.data);
  });

  it('should support custom url with generics (T/R/D)', async () => {
    const result = await instance.post<{ key1: string }, OpenApiAxiosResponse<{ key2: string }>, { key3: string }>(
      '/not/in/paths',
      { key3: 'value3' }
    );

    assertType<{ key2: string }>(result.data);
  });
});

describe('OpenAPIStyleAxiosInstance', () => {
  type StyledInstanceType = OpenAPIStyleAxiosInstance<paths>;
  const styledInstance = OpenApiStyleAxios<paths>();

  beforeEach(() => {
    vi.spyOn(styledInstance, 'get').mockResolvedValue({});
    vi.spyOn(styledInstance, 'post').mockResolvedValue({});
  });

  it('should return OpenAPIAxiosInstance type with correct generic', () => {
    assertType<StyledInstanceType>(styledInstance);
  });

  it('should hint required parameters correctly (path)', async () => {
    const result = await styledInstance.get('/v1/accounts/{account}/bank_accounts/{id}', {
      path: { account: 'account', id: 'id' }
    });

    assertType<
      paths['/v1/accounts/{account}/bank_accounts/{id}']['get']['responses']['200']['content']['application/json']
    >(result.data);
  });

  it('should hint required parameters correctly (query)', async () => {
    const result = await styledInstance.get('/v1/apps/secrets', {
      query: { scope: { type: 'account' } }
    });

    assertType<paths['/v1/apps/secrets']['get']['responses']['200']['content']['application/json']>(result.data);
  });

  it('should hint required parameters correctly (path/query)', async () => {
    const result = await styledInstance.get('/v1/billing/meters/{id}/event_summaries', {
      path: { id: 'id' },
      query: { customer: 'customer', end_time: 0, start_time: 0 }
    });

    assertType<
      paths['/v1/billing/meters/{id}/event_summaries']['get']['responses']['200']['content']['application/json']
    >(result.data);
  });

  it('should hint required parameters correctly (path/body)', async () => {
    const result = await styledInstance.post('/v1/accounts/{account}/reject', {
      path: { account: 'account' },
      body: { reason: 'reason' }
    });

    assertType<paths['/v1/accounts/{account}/reject']['post']['responses']['200']['content']['application/json']>(
      result.data
    );
  });

  it('should support unlisted properties (path/query)', async () => {
    const result = await styledInstance.get('/v1/billing/meters/{id}/event_summaries', {
      path: { id: 'id', other: 'other' },
      query: { customer: 'customer', end_time: 0, start_time: 0, other: 'other' }
    });

    assertType<
      paths['/v1/billing/meters/{id}/event_summaries']['get']['responses']['200']['content']['application/json']
    >(result.data);
  });

  it('should support unlisted properties (path/body)', async () => {
    const result = await styledInstance.post('/v1/accounts/{account}/reject', {
      path: { account: 'account', other: 'other' },
      body: { reason: 'reason', other: 'other' }
    });

    assertType<paths['/v1/accounts/{account}/reject']['post']['responses']['200']['content']['application/json']>(
      result.data
    );
  });

  it('should support custom url', async () => {
    const result = await styledInstance.post('/not/in/paths', undefined);

    assertType<never>(result.data);
  });

  it('should support custom url with generics (T)', async () => {
    const result = await styledInstance.post<{ key1: string }>('/not/in/paths', undefined);

    assertType<{ key1: string }>(result.data);
  });

  it('should support custom url with generics (T/R)', async () => {
    const result = await styledInstance.post<{ key1: string }, OpenApiAxiosResponse<{ key2: string }>>(
      '/not/in/paths',
      undefined
    );

    assertType<{ key2: string }>(result.data);
  });

  it('should support custom url with generics (T/R/D)', async () => {
    const result = await styledInstance.post<
      { key1: string },
      OpenApiAxiosResponse<{ key2: string }>,
      { key3: string }
    >('/not/in/paths', { body: { key3: 'value3' } });

    assertType<{ key2: string }>(result.data);
  });
});
