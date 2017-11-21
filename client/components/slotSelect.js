import {getLevelsForCourse} from "../../lib/methods/levelMethods";
import {getSlotsForLevel} from "../../lib/methods/slotMethods";

Template.slotSelect.events({
  "change .slotSelect"() {
    const slotSelect = $(".slotSelect")
    const slotId = slotSelect.val()
    Session.set("selectedSlotId", slotId)
  }
})

Template.slotSelect.helpers({
  levels() {
    const course = Template.currentData()
    return getLevelsForCourse(course._id)
  },

  slots() {
    const level = Template.currentData()
    return getSlotsForLevel(level._id)
  },

  selected() {
    const slot = Template.currentData()
    const selectedSlotId = Session.get("selectedSlotId")
    if (selectedSlotId && slot && slot._id == selectedSlotId) {
      return "selected"
    }
  }
})