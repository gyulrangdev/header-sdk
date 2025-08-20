// 자동완성 API 관련 타입 정의

export interface AutoCompleteKeyword {
  keyword: string;
  featureCode: string;
  featureName?: string;
}

export interface DirectKeyword {
  id: string;
  content: string;
  linkUrl: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageSize: number;
  pageNumber: number;
  totalElements: number;
  totalPages: number;
}

export interface AutoCompleteResponse {
  autoComplete: AutoCompleteKeyword[];
  direct: DirectKeyword[];
}

export interface AutoCompleteParams {
  keyword: string;
  maxCount?: number;
}

export interface DirectParams {
  keyword: string;
}

export type AutoCompleteApiResponse = PaginatedResponse<AutoCompleteKeyword>;
export type DirectApiResponse = PaginatedResponse<DirectKeyword>;