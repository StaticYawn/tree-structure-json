type ActivityData = {
  id: number,
  projectId: number,
  name: string
}

type ProjectData = {
  id: number,
  customerId: number,
  name: string,
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