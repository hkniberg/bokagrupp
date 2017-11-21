import {getLevelsForCourse} from "../../../lib/methods/levelMethods";
import {getSlotsForCourse} from "../../../lib/methods/slotMethods";
import {getSlot} from "../../../lib/methods/slotMethods";

Template.viewCourse.helpers({
  levelSelectValues() {
    const course = Template.currentData()
    const levels = getLevelsForCourse(course._id)

    //Create an options list based on those levels
    let options = []
    levels.forEach(function (level) {
      options.push({label: level.name, value: level._id})
    })
    return options
  },

  levels() {
    const course = Template.currentData()
    return getLevelsForCourse(course._id)
  },

  slots() {
    const course = Template.currentData()
    return getSlotsForCourse(course._id)
  },

  selectedDatePeriod() {
    return Session.get("selectedDatePeriod")
  }
})

Template.viewCourse.events({
  "click .removeButton"() {
    const course = Template.currentData()
    sweetAlert({
      title: "Är du säker?",
      text: "Vill du verkligen ta bort kursen?",
      type: "warning",
      confirmButtonColor: "red",
      confirmButtonText: "Japp! Bort med kursen!",
      showCancelButton: true
    }, function(){
      Meteor.call("removeCourse", course._id)
      Router.go("/admin/courses")
    });
  },

  "click .removeSlotButton"(event) {
    const slotId = $(event.target).data("slotid")
    const slot = getSlot(slotId)
    console.log("slotId", slotId)
    sweetAlert({
      title: "Är du säker?",
      text: "Vill du verkligen ta bort gruppen " + slot.level().name + " " + slot.datePeriod + " " + slot.time + "?",
      type: "warning",
      confirmButtonColor: "red",
      confirmButtonText: "Japp! Bort med gruppen!",
      showCancelButton: true
    }, function(){
      Meteor.call("removeSlot", slotId)
    });
  },

  "click .printBookingsButton"() {
    const course = Template.currentData()
    const datePeriod = Session.get("selectedDatePeriod")
    Router.go("/admin/printBookings/" + course.shortName + "/" + datePeriod)
  }
})