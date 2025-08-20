// HTTP 클라이언트 구현

export interface HttpRequestOptions {
  query?: Record<string, any>;
  headers?: Record<string, string>;
  timeout?: number;
}

export class HttpClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string, defaultHeaders: Record<string, string> = {}) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders
    };
  }

  private buildUrl(endpoint: string, query?: Record<string, any>): string {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    return url.toString();
  }

  async get<T>(endpoint: string, options: HttpRequestOptions = {}): Promise<T> {
    const url = this.buildUrl(endpoint, options.query);
    console.log('🌐 HTTP GET Request:', url);
    
    const controller = new AbortController();
    const timeout = options.timeout || 10000;
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      console.log('📤 Sending request with headers:', {
        ...this.defaultHeaders,
        ...options.headers
      });
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          ...this.defaultHeaders,
          ...options.headers
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('📥 Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ HTTP Error response body:', errorText);
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Response body:', result);
      return result;
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('❌ HTTP Request failed:', error);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      
      throw error;
    }
  }
}