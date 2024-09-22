/**
 * @param {Date} date - 변환할 날짜
 * @returns {string} - 변환된 한국식 날짜 문자열
 * @description 주어진 날짜를 한국식 문자열로 변환합니다.
 */
export function formatDateToKoreanString(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return date.toLocaleDateString("ko-KR", options);
}
