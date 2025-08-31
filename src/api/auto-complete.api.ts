// 자동완성 API 연동 함수 (Mock 데이터 사용)

import type {
  AutoCompleteResponse,
  AutoCompleteKeyword,
  DirectKeyword
} from './types.js';
import mockData from './mock-data.json';

// 기본 설정
const DEFAULT_MAX_COUNT = 10;

/**
 * 자동완성 키워드 Mock 데이터 조회
 * @param keyword 검색할 키워드
 * @param maxCount 최대 결과 수
 * @returns 자동완성 키워드 목록
 */
function getAutoCompleteKeywords(keyword: string, maxCount: number = DEFAULT_MAX_COUNT): AutoCompleteKeyword[] {
  const normalizedKeyword = keyword.toLowerCase().trim();
  
  // 키워드가 포함된 항목들을 찾기
  let results: AutoCompleteKeyword[] = [];
  
  for (const [key, items] of Object.entries(mockData.autoComplete)) {
    if (key.toLowerCase().includes(normalizedKeyword) || normalizedKeyword.includes(key.toLowerCase())) {
      results = results.concat(items as AutoCompleteKeyword[]);
    }
  }
  
  // 정확히 일치하는 키워드가 있으면 우선순위 부여
  const exactMatches = results.filter(item => 
    item.keyword.toLowerCase().includes(normalizedKeyword)
  );
  
  const otherMatches = results.filter(item => 
    !item.keyword.toLowerCase().includes(normalizedKeyword)
  );
  
  const combined = [...exactMatches, ...otherMatches];
  
  // 중복 제거 및 개수 제한
  const uniqueResults = combined
    .filter((item, index, self) => 
      index === self.findIndex(t => t.keyword === item.keyword)
    )
    .slice(0, maxCount);
    
  return uniqueResults;
}

/**
 * 바로가기 키워드 Mock 데이터 조회
 * @param keyword 검색할 키워드
 * @returns 바로가기 키워드 목록
 */
function getDirectKeywords(keyword: string): DirectKeyword[] {
  const normalizedKeyword = keyword.toLowerCase().trim();
  
  let results: DirectKeyword[] = [];
  
  for (const [key, items] of Object.entries(mockData.direct)) {
    if (key.toLowerCase().includes(normalizedKeyword) || normalizedKeyword.includes(key.toLowerCase())) {
      results = results.concat(items as DirectKeyword[]);
    }
  }
  
  return results;
}

/**
 * 자동완성 및 바로가기 키워드 통합 조회 (Mock 데이터 사용)
 * @param keyword 검색할 키워드
 * @param maxCount 자동완성 최대 결과 수 (기본값: 10)
 * @returns 통합된 자동완성 데이터
 */
export async function getV1KeywordsAutocompletes(
  keyword: string,
  maxCount: number = DEFAULT_MAX_COUNT
): Promise<AutoCompleteResponse> {
  console.log('🚀 Mock API Function called with:', { keyword, maxCount });
  
  // API 호출 시뮬레이션을 위한 지연 시간
  await new Promise(resolve => setTimeout(resolve, 200));
  
  try {
    console.log('📡 Getting mock data...');
    
    const autoComplete = getAutoCompleteKeywords(keyword, maxCount);
    const direct = getDirectKeywords(keyword);

    console.log('📥 AutoComplete mock result:', autoComplete);
    console.log('📥 Direct mock result:', direct);

    const result = {
      autoComplete,
      direct
    };
    
    console.log('🎯 Final combined result:', result);
    return result;
  } catch (error) {
    console.error('❌ Mock autocomplete error:', error);
    
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