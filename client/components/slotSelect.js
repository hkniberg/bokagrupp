import {getLevelsForCourse} from "../../lib/methods/levelMethods";
import {getSlotsForLevel} from "../../lib/methods/slotMethods";

Template.slotSelect.onRendered(function() {
  const data = Template.currentData()
  console.assert(data.course || data.level, "slotSelect template requires a data context that contains a course or level")
})

Template.slotSelect.events({
  "change .slotSelect"() {
    const slotSelect = $(".slotSelect")
    const slotId = slotSelect.val()
    Session.set("selectedSlotId", slotId)
  }
})

Template.slotSelect.helpers({
  levels() {
    const data = Template.currentData()
    if (data.course) {
      return getLevelsForCourse(data.course._id)
    } else if (data.level) {
      return [data.level]
    }
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