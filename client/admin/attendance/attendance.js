import {getAttendanceDatesForSlot} from "../../../lib/methods/attendanceMethods";
import {wasAttended} from "../../../lib/methods/attendanceMethods";
import {getBookingsThatHaveAttendedSlot} from "../../../lib/methods/attendanceMethods";
import {getAdminRouteToOrg} from "../../../lib/router";
Template.attendance.helpers({
  attendanceLink() {
    const course = Template.currentData()
    return Meteor.absoluteUrl("attendance/" + course.attendanceKey)
  },

  /*
    All bookings currently associated to this slot,
    Plus all bookings that have ever attended this slot.
    Sorted by first name.
   */
  bookingsForSlot() {
    const slot = Template.currentData()
    const bookings = slot.bookings().fetch()
    const bookingsThatHaveAttended = getBookingsThatHaveAttendedSlot(slot._id)
    bookingsThatHaveAttended.forEach((bookingThatHasAttended) => {
      if (bookingThatHasAttended.slotId != slot._id) {
        bookingThatHasAttended.changedGroup = true
        bookings.push(bookingThatHasAttended)
      }
    })
    return bookings
  },

  attendanceDatesForSlot() {
    const slot = Template.currentData()
    return getAttendanceDatesForSlot(slot)
  },

  attendanceDatesForBooking() {
    const slot = Template.parentData()
    return getAttendanceDatesForSlot(slot)
  },
  
  wasPresent() {
    const date = Template.currentData()
    const booking = Template.parentData()
    return wasAttended(booking._id, booking.slot()._id, date)
  },

  attendanceCheckboxData() {
    const date = Template.currentData()
    const booking = Template.parentData()
    const slot = Template.parentData(2)
    return {
      booking: booking,
      slot: slot,
      date: date
    }
  },

  attendanceCellCss() {
    const date = Template.currentData()
    const booking = Template.parentData()
    const slot = Template.parentData(2)
    if (wasAttended(booking._id, slot._id, date)) {
      return "present"
    } else {
      return "notPresent"
    }
  },

  childNameCellCss() {
    const booking = Template.currentData()
    if (booking.changedGroup) {
      return "grayText"
    }
  },

  coursePath() {
    const course = Template.currentData()
    if (course) {
      const orgPath = getAdminRouteToOrg(course.org())
      return orgPath + "/course/" + course.shortName
    }
  }
})