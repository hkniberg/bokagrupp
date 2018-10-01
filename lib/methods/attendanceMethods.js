import {Attendance, Bookings} from "../collection"
import {getSlot} from "./slotMethods";

Meteor.methods({
  setAttended(bookingId, slotId, date, attended, comment) {
    setAttended(bookingId, slotId, date, attended, comment)
  }
})

/*
  Returns all bookings that have ever attended the given slot
 */
export function getBookingsThatHaveAttendedSlot(slotId) {
  const bookingIdsSet = new Set()
  Attendance.find({slotId: slotId, attended: true}).forEach((attendance) => {
    bookingIdsSet.add(attendance.bookingId)
  })
  const bookingIdsArray = Array.from(bookingIdsSet)
  return Bookings.find({_id: {$in: bookingIdsArray}})
}

/*
True if the given booking attended the given slot at the given date
 */
export function wasAttended(bookingId, slotId, date) {
  console.assert(bookingId, "bookingId is required")
  console.assert(slotId, "slotId is required")
  console.assert(date, "date is required")

  const attendance = Attendance.findOne({bookingId, slotId, date})
  if (attendance) {
    return attendance.attended
  } else {
    return false
  }
}

export function setAttended(bookingId, slotId, date, attended, comment) {
  console.assert(bookingId, "bookingId is required")
  console.assert(slotId, "slotId is required")
  console.assert(date, "date is required")
  console.assert(attended != null, "attended is required")
  const slot = getSlot(slotId)
  const levelId = slot.level()._id
  const courseId = slot.course()._id

  if (attended == false && !comment) {
    Attendance.remove({bookingId, slotId, date})
  } else {
    Attendance.upsert({bookingId, slotId, date}, {$set: {bookingId, slotId, levelId, courseId, date, attended, comment}})
  }

}

/*
 An array of all dates that have attendance data for the given booking
 */
export function getAttendanceDatesForBooking(booking) {
  const times = new Set()
  Attendance.find({bookingId: booking._id}).forEach((attendance) => {
    times.add(attendance.date.getTime())
  })

  const dates = []
  times.forEach((time) => {
    dates.push(new Date(time))
  })
  dates.sort()
  return dates
}


/*
An array of all dates that have attendance data for the given slot
 */
export function getAttendanceDatesForSlot(slot) {
  const times = new Set()
  Attendance.find({slotId: slot._id}).forEach((attendance) => {
    times.add(attendance.date.getTime())
  })

  const dates = []
  times.forEach((time) => {
    dates.push(new Date(time))
  })
  sortDates(dates)
  return dates
}

/*
 An array of all dates that have attendance data for the given course
 */
export function getAttendanceDatesForCourse(course) {
  const times = new Set()
  Attendance.find({courseId: course._id}).forEach((attendance) => {
    times.add(attendance.date.getTime())
  })

  const dates = []
  times.forEach((time) => {
    dates.push(new Date(time))
  })
  sortDates(dates)
  return dates
}

function sortDates(dates) {
  dates.sort((date1, date2) => {
    return date1.getTime() - date2.getTime()
  })
}

