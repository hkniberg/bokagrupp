import {getAttendanceDatesForSlot} from "../../../lib/methods/attendanceMethods";
import {wasAttended} from "../../../lib/methods/attendanceMethods";
Template.attendance.helpers({
  attendanceLink() {
    const course = Template.currentData()
    return Meteor.absoluteUrl("attendance/" + course.attendanceKey)
  },
  
  attendanceDatesForSlot() {
    const slot = Template.currentData()
    return getAttendanceDatesForSlot(slot)
  },

  attendanceDatesForBooking() {
    const booking = Template.currentData()

    return getAttendanceDatesForSlot(booking.slot())
  },
  
  wasPresent() {
    const date = Template.currentData()
    const booking = Template.parentData()
    return wasAttended(booking._id, booking.slot()._id, date)
  },

  attendanceCheckboxData() {
    const date = Template.currentData()
    const booking = Template.parentData()
    return {
      booking: booking,
      slot: booking.slot(),
      date: date
    }
  },

  attendanceCellCss() {
    const date = Template.currentData()
    const booking = Template.parentData()
    const slot = booking.slot()
    if (wasAttended(booking._id, slot._id, date)) {
      return "present"
    } else {
      return "notPresent"
    }
  }
})