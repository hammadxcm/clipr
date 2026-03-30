/** Cloudflare Worker environment bindings. */
export interface Env {
  URLS: KVNamespace;
  API_TOKEN: string;
  BASE_URL: string;
}
