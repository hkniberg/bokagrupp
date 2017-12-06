import {Courses} from "../../../lib/collection"
import {getBookingsForSlot} from "../../../lib/methods/bookingMethods";
import {getSlotsForCourseAndDatePeriod} from "../../../lib/methods/slotMethods";
Template.printBookings.helpers({
  slots() {
    const data = Template.currentData()
    const course = getCourse()
    if (course) {
      return getSlotsForCourseAndDatePeriod(course._id, data.datePeriod)
    }
  },

  bookings() {
    const slot = Template.currentData()
    return getBookingsForSlot(slot._id)
  }
})

function getCourse() {
  const data = Template.currentData()
  return Courses.findOne({shortName: data.courseShortName})
}