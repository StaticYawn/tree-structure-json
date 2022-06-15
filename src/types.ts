type ActivityData = {
  activityId: number,
  projectId: number,
  activityName: string
}

type ProjectData = {
  projectId: number,
  customerId: number,
  projectName: string,
}

type TicketData = {
  name: string,
  dates: Array<DateData>,
}

type DateData = {
  date: string,
  bookings: Array<BookingData>,
}

type BookingData = {
  time: string,
  projectId: number,
  activityId: number,
  activityType: number,
  taskId: number,
  note: boolean,
  image: boolean,
}

export type {  DateData, ProjectData, TicketData, BookingData, ActivityData }