export interface ISchedule {
  studentId: number | string;
  studentName: string;
  year: number;
  term: number;
  startDate: Date;
  endDate: Date;
  items: IScheduleItem[];
  subjects: Subject[];
}

export interface Subject {
  id: string;
  name: string;
  classCode: string;
}

export interface IScheduleItem {
  startTime: Date; // Thời gian bắt đầu
  endTime: Date; // Thời gian kết thúc
  date: Date; // Date
  tbd: number; // tiết bắt đầu
  soTiet: number; // số tiết
  subject: Subject; // Môn học
  week: number; // tuần thứ
  day: number;
  room: string;
}
