import { differenceInHours, differenceInMinutes, differenceInSeconds, isThisYear } from "date-fns";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";

const KOREA_TIMEZONE = "Asia/Seoul";

export const dateFormat = (date: Date) => {
  const now = new Date();

  // 현재 시간을 한국 시간으로 변환
  const nowInKST = toZonedTime(now, KOREA_TIMEZONE);
  const dateInKST = toZonedTime(date, KOREA_TIMEZONE);

  // 날짜와 현재 시간의 차이를 계산
  const diffInHours = differenceInHours(nowInKST, dateInKST);
  const diffInMinutes = differenceInMinutes(nowInKST, dateInKST);
  const diffInSeconds = differenceInSeconds(nowInKST, dateInKST);

  // 1분 이내인 경우
  if (diffInMinutes < 1) {
    return `${diffInSeconds}초 전`;
  }

  // 1시간 이내인 경우
  if (diffInHours < 1) {
    return `${diffInMinutes}분 전`;
  }

  // 24시간 이내인 경우
  if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  }

  // 같은 해인 경우
  if (isThisYear(dateInKST)) {
    return formatInTimeZone(dateInKST, KOREA_TIMEZONE, "M월 d일");
  }

  // 다른 해인 경우
  return formatInTimeZone(dateInKST, KOREA_TIMEZONE, "yy년 M월 d일");
};
