/**
 * @param {Date} date - 변환할 날짜
 * @param {{Intl.DateTimeFormatOptions}} options - 날짜 형식 옵션
 * @returns {string} - 변환된 한국식 날짜 문자열
 * @description 주어진 날짜를 한국식 문자열로 변환합니다.
 */
export function formatDateToKoreanString(
  date: Date,
  options?: Intl.DateTimeFormatOptions,
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const mergedOptions = options ? options : defaultOptions;

  return date.toLocaleDateString("ko-KR", mergedOptions);
}
