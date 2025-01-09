import dayjs from "dayjs";

export function convertDateOtherFormat(date: Date): string{
  return dayjs(date).format("DD/MM/YYYY").toString()
}