import {getLevelsForCourse} from "../../lib/methods/levelMethods";
import {getSlotsForLevel} from "../../lib/methods/slotMethods";
import {getSlotsForCourse} from "../../lib/methods/slotMethods";
import {getPublicRouteToCourse} from "../../lib/router";
import {startNewBooking} from "../bookingSession";
import {getCurrentCourse} from "../bookingSession";

Template.selectSlot.helpers({
  course() {
    return Template.currentData()
  },

  levels() {
    const course = Template.currentData()
    return getLevelsForCourse(course._id)
  },
  
  slots() {
    const level = Template.currentData()
    return getSlotsForLevel(level._id)
  },

  hasSlots() {
    const course = Template.currentData()
    return getSlotsForCourse(course._id).count() > 0
  }
})

Template.selectSlot.events({
  "click .selectSlotButton"(event) {
    const slotId = $(event.target).data("slotid")
    startNewBooking(slotId)
    const course = getCurrentCourse()
    Router.go(getPublicRouteToCourse(course) + "/enterMembershipNumber")
  }
})