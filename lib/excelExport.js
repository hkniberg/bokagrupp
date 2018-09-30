import {getBookingsForCourse} from "./methods/bookingMethods"
import {formatDateTime, formatDate} from "./dateUtil"
import {getLevel} from "./methods/levelMethods";
import {getSlot} from "./methods/slotMethods";
import {getAttendanceDatesForCourse} from "./methods/attendanceMethods";
import {getAttendanceDatesForBooking} from "./methods/attendanceMethods";

export function exportToExcel(course) {

  const bookings = getBookingsForCourse(course._id).fetch()
  const fields = [
    {key: 'childFirstName', title: 'Förnamn'},
    {key: 'childLastName', title: 'Efternamn'},
    {key: 'childBirthDate', title: 'Födelsedatum', transform: function(birthDate) {
      return formatDate(birthDate)
    }},
    {key: 'childGender', title: 'Kön'},
    {key: 'childZip', title: 'Postnummer'},
    {key: 'childMembershipNumber', title: 'Medlemsnummer'},
    {key: 'parentPhone', title: 'Telefon'},
    {key: 'parentEmail', title: 'Epost'},
    {key: 'levelId', title: 'Nivå', transform: function(levelId, booking) {
      const level = getLevel(levelId)
      return level.name
    }},
    {key: 'slotId', title: 'Datumperiod', transform: function(slotId, booking) {
      const slot = getSlot(slotId)
      return slot.datePeriod
    }},
    {key: 'slotId', title: 'Tid', transform: function(slotId, booking) {
      const slot = getSlot(slotId)
      return slot.time
    }},
    {key: 'creationTime', title: 'Registeringstid', transform: function(creationTime, booking) {
      if (creationTime) {
        return formatDateTime(creationTime)
      } else {
        return ""
      }
    }},
    {key: 'comment', title: 'Kommentar'}
  ]
  
  const dates = getAttendanceDatesForCourse(course)
  console.log("dates", dates)
  dates.forEach((date) => {
    const dateString = moment(date).format("YYYY-MM-DD")
    fields.push(
      {key: dateString, title: dateString, type: "number", width: 10}
    )
  })
  
  bookings.forEach((booking) => {
    const dates = getAttendanceDatesForBooking(booking)
    dates.forEach((date) => {
      const dateString = moment(date).format("YYYY-MM-DD")
      booking[dateString] = 1
    })
  })
  
  var title = 'bokningar'
  return Excel.export(title, fields, bookings);
}