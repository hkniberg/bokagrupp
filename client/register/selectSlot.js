import {getLevelsForCourse} from "../../lib/methods/levelMethods";
import {getSlotsForLevel} from "../../lib/methods/slotMethods";

Template.selectSlot.helpers({
  levels() {
    const course = Template.currentData()
    return getLevelsForCourse(course._id)
  },
  
  slots() {
    const level = Template.currentData()
    return getSlotsForLevel(level._id)
  }
})

Template.selectSlot.events({
  "click .selectSlotButton"(event) {
    const slotId = $(event.target).data("slotid")
    Session.set("selectedSlotId", slotId)
    Router.go("/enterMembershipNumber")
  }
})