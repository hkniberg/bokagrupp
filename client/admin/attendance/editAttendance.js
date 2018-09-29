import {getCourseWithAttendanceKey} from "../../../lib/methods/courseMethods"
import {getSlot} from "../../../lib/methods/slotMethods";
import {wasAttended} from "../../../lib/methods/attendanceMethods";

const selectedDateStringVar = new ReactiveVar(moment().format("YYYY-MM-DD"))

Template.editAttendance.helpers({
  course() {
    const attendanceKey = Template.currentData()
    return getCourseWithAttendanceKey(attendanceKey)
  },

  slotSelected() {
    const slot = Template.currentData()
    const selectedSlotId = Session.get("selectedSlotId")
    if (slot && slot._id == selectedSlotId) {
      return "selected"
    }
  },
  

  selectedSlot() {
    const selectedSlotId = Session.get("selectedSlotId")
    if (selectedSlotId) {
      return getSlot(selectedSlotId)
    } else {
      return null
    }
  },

  selectedDate() {
    return selectedDateStringVar.get()
  },
  
  checked() {
    const booking = Template.currentData()
    const slot = booking.slot()
    const date = getSelectedDate()
    if (date) {
      if (wasAttended(booking._id, slot._id, date)) {
        return "checked"
      }
    }
  }
})

Template.editAttendance.events({
  "change .selectedDate"() {
    const dateString = $(".selectedDate").val()
    if (dateString) {
      selectedDateStringVar.set(dateString)
    } else {
      selectedDateStringVar.set(null)
    }
  },

  "change .slotSelect"() {
    const slotId = $(".slotSelect").val()
    Session.set("selectedSlotId", slotId)
  },

  "change .attendanceCheckbox"(evt) {
    const checkbox = $(evt.target)
    const checked = checkbox.is(":checked")
    const bookingId = checkbox.data("bookingid")
    const slotId = Session.get("selectedSlotId")
    Meteor.call("setAttended", bookingId, slotId, getSelectedDate(), checked, function(err) {
      if (err) {
        console.log(err)
      }
    })
  }
})

function getSelectedDate() {
  const dateString = selectedDateStringVar.get()
  if (dateString) {
    return moment(dateString).toDate()
  } else {
    return null
  }
}
