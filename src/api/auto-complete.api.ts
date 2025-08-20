// 자동완성 API 연동 함수

import { HttpClient } from './http-client.js';
import type {
  AutoCompleteResponse,
  AutoCompleteParams,
  DirectParams,
  AutoCompleteApiResponse,
  DirectApiResponse
} from './types.js';

// 기본 설정
const DEFAULT_BASE_URL = '/Search/api/display';
const DEFAULT_MAX_COUNT = 10;

// HTTP 클라이언트 인스턴스
const httpClient = new HttpClient(DEFAULT_BASE_URL);

/**
 * 자동완성 키워드 API 호출
 * @param params 검색 파라미터
 * @returns 자동완성 키워드 목록
 */
async function getAutoCompleteKeywords(params: AutoCompleteParams): Promise<AutoCompleteApiResponse> {
  try {
    const response = await httpClient.get<AutoCompleteApiResponse>('/v1/keywords/autocompletes', {
      query: {
        keyword: params.keyword,
        maxCount: params.maxCount || DEFAULT_MAX_COUNT
      }
    });
    
    return response;
  } catch (error) {
    console.error('Auto complete API error:', error);
    
    // 에러 발생 시 빈 결과 반환
    return {
      content: [],
      pageSize: 0,
      pageNumber: 0,
      totalElements: 0,
      totalPages: 0
    };
  }
}

/**
 * 바로가기 키워드 API 호출
 * @param params 검색 파라미터
 * @returns 바로가기 키워드 목록
 */
async function getDirectKeywords(params: DirectParams): Promise<DirectApiResponse> {
  try {
    const response = await httpClient.get<DirectApiResponse>('/v1/keywords/directs', {
      query: {
        keyword: params.keyword
      }
    });
    
    return response;
  } catch (error) {
    console.error('Direct keywords API error:', error);
    
    // 에러 발생 시 빈 결과 반환
    return {
      content: [],
      pageSize: 0,
      pageNumber: 0,
      totalElements: 0,
      totalPages: 0
    };
  }
}

/**
 * 자동완성 및 바로가기 키워드 통합 API 호출
 * 두 API를 병렬로 호출하여 결과를 통합 반환
 * @param keyword 검색할 키워드
 * @param maxCount 자동완성 최대 결과 수 (기본값: 10)
 * @returns 통합된 자동완성 데이터
 */
export async function getV1KeywordsAutocompletes(
  keyword: string,
  maxCount: number = DEFAULT_MAX_COUNT
): Promise<AutoCompleteResponse> {
  console.log('🚀 API Function called with:', { keyword, maxCount });
  console.log('📍 Base URL:', DEFAULT_BASE_URL);
  
  try {
    console.log('📡 Making parallel API calls...');
    
    // 병렬로 API 호출
    const [autoComplete, direct] = await Promise.all([
      getAutoCompleteKeywords({ keyword, maxCount }),
      getDirectKeywords({ keyword })
    ]);

    console.log('📥 AutoComplete API result:', autoComplete);
    console.log('📥 Direct API result:', direct);

    const result = {
      autoComplete: autoComplete.content,
      direct: direct.content
    };
    
    console.log('🎯 Final combined result:', result);
    return result;
  } catch (error) {
    console.error('❌ Combined autocomplete API error:', error);
    
    // 에러 발생 시 빈 결과 반환
    return {
      autoComplete: [],
      direct: []
    };
  }
}

/**
 * 검색어 유효성 검사
 * 한글, 영문, 숫자, 특수문자(-+#()[]%&,.㈜㈔'/) 허용, 최대 30자
 * @param keyword 검증할 키워드
 * @returns 유효성 검사 결과
 */
export function validateSearchKeyword(keyword: string): boolean {
  if (!keyword || keyword.length === 0) {
    return false;
  }
  
  if (keyword.length > 30) {
    return false;
  }
  
  // 허용된 문자: 한글, 영문, 숫자, 특수문자(-+#()[]%&,.㈜㈔'/)
  const allowedPattern = /^[가-힣a-zA-Z0-9\-\+#\(\)\[\]%&,\.㈜㈔'\/\s]+$/;
  
  return allowedPattern.test(keyword);
}

/**
 * 디바운스 함수
 * @param func 실행할 함수
 * @param delay 지연 시간 (ms)
 * @returns 디바운스된 함수
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: number;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}