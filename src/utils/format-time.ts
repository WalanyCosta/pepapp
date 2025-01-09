import dayjs from "dayjs";

export function formatTime(date: Date){
  return dayjs(date).format("hh:mm A");
}