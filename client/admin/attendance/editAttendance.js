import {getCourseWithAttendanceKey} from "../../../lib/methods/courseMethods"
import {getSlot} from "../../../lib/methods/slotMethods";
import {wasAttended} from "../../../lib/methods/attendanceMethods";
import {getSelectedLevel} from "../../components/levelSelect";
import {getSelectedLevelId} from "../../components/levelSelect";

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

  selectedLevel() {
    return getSelectedLevel()
  },
  
  selectedSlot() {
    const selectedSlotId = Session.get("selectedSlotId")
    if (selectedSlotId) {
      const slot = getSlot(selectedSlotId)
      const selectedLevelId = getSelectedLevelId()
      if (slot.levelId == selectedLevelId) {
        return slot
      }
    } else {
      return null
    }
  },

  selectedDate() {
    return selectedDateStringVar.get()
  },
  
  attendanceCheckboxData() {
    const booking = Template.currentData()
    return {
      booking: booking,
      slot: booking.slot(),
      date: getSelectedDate()
    }
  },
 
  attendeeCss() {
    const booking = Template.currentData()
    if (isAttendeeChecked(booking)) {
      return "present"
    } else {
      return "notPresent"
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
  }
})

function getSelectedDate() {
  const dateString = selectedDateStringVar.get()
  if (dateString) {
    return moment.utc(dateString).toDate()
  } else {
    return null
  }
}

function isAttendeeChecked(booking) {
  const slot = booking.slot()
  const date = getSelectedDate()
  if (date) {
    if (wasAttended(booking._id, slot._id, date)) {
      return "checked"
    }
  }
}