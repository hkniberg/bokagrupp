import {wasAttended} from "../../lib/methods/attendanceMethods";
import {getBooking} from "../../lib/methods/bookingMethods";

Template.attendanceCheckbox.onRendered(function() {
  const data = Template.currentData()
  console.assert(data.booking, "attendanceCheckbox data context must have a booking")
  console.assert(data.slot, "attendanceCheckbox data context must have a slot")
  console.assert(data.date, "attendanceCheckbox data context must have a date")
})

Template.attendanceCheckbox.helpers({
  checked() {
    const data = Template.currentData()
    if (wasAttended(data.booking._id, data.slot._id, data.date)) {
      return "checked"
    }
  }
})

Template.attendanceCheckbox.events({
  "change .attendanceCheckbox"(evt) {
    const data = Template.currentData()
    const checkbox = $(evt.target)
    const checked = checkbox.is(":checked")
    const bookingId = data.booking._id
    const slotId = data.slot._id
    Meteor.call("setAttended", bookingId, slotId, data.date, checked, function(err) {
      if (err) {
        console.log(err)
      }
    })
  }
})

