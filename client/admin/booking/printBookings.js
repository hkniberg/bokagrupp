import {Slots, Courses} from "../../../lib/collection"
import {getBookingsForSlot} from "../../../lib/methods/bookingMethods";
import {getSlotsForCourseAndDatePeriod} from "../../../lib/methods/slotMethods";
Template.printBookings.helpers({
  slots() {
    const data = Template.currentData()
    const course = getCourse()
    if (course) {
      const slots = getSlotsForCourseAndDatePeriod(course._id, data.datePeriod)
      return slots
    }
  },

  bookings() {
    const slot = Template.currentData()
    const bookings = getBookingsForSlot(slot._id)
    return bookings
  }
})

function getCourse() {
  const data = Template.currentData()
  return Courses.findOne({shortName: data.courseShortName})
}