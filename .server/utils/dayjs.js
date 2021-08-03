import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import isBetween from 'dayjs/plugin/isBetween';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
dayjs.extend(isBetween);
dayjs.locale('vi');
export { dayjs };
