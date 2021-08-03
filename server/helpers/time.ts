import dayjs from "dayjs";
import "dayjs/locale/vi";
import isBetween from "dayjs/plugin/isBetween";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(customParseFormat);
dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(relativeTime);
dayjs.locale("vi");

export default dayjs;

const mNames = [
  "Giêng",
  "Hai",
  "Ba",
  "Tư",
  "Năm",
  "Sáu",
  "Bảy",
  "Tám",
  "Chín",
  "Mười",
  "Mười Một",
  "Mười Hai",
];

export const dNames = ["CN", "Hai", "Ba", "Tư", "Năm", "Sáu", "Bảy"];

export const parseTime = (str: string) => {
  const [, dm, y] = str.split(",").map((e) => e.trim());
  const date = Number(dm.split(" ").shift());
  const month = mNames.indexOf(dm.slice(10).trim());
  const year = Number(y.replace("Năm ", ""));
  return new Date(year, month, date);
};
