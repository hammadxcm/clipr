/** In-memory KVNamespace mock for testing. */
export function createMockKV(): KVNamespace {
  const store = new Map<string, string>();

  return {
    get(key: string, _opts?: unknown): Promise<string | null> {
      return Promise.resolve(store.get(key) ?? null);
    },
    put(key: string, value: string): Promise<void> {
      store.set(key, value);
      return Promise.resolve();
    },
    delete(key: string): Promise<void> {
      store.delete(key);
      return Promise.resolve();
    },
    list(opts?: { prefix?: string }): Promise<KVNamespaceListResult<unknown, string>> {
      let storeKeys = [...store.keys()];
      if (opts?.prefix) {
        storeKeys = storeKeys.filter((k) => k.startsWith(opts.prefix!));
      }
      const keys = storeKeys.map((name) => ({ name }));
      return Promise.resolve({
        keys,
        list_complete: true,
        cacheStatus: null,
      } as KVNamespaceListResult<unknown, string>);
    },
    getWithMetadata(): Promise<KVNamespaceGetWithMetadataResult<string, unknown>> {
      return Promise.resolve({ value: null, metadata: null, cacheStatus: null });
    },
  } as unknown as KVNamespace;
}
