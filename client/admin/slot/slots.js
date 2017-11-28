import {Slots} from "../../../lib/collection"
import {getSlot} from "../../../lib/methods/slotMethods";
import {getLevelsForCourse} from "../../../lib/methods/levelMethods";

Template.slots.helpers({
  slots() {
    const course = Template.currentData()
    return Slots.find({courseId: course._id})
  },

  levelSelectValues() {
    const course = Template.currentData()
    const levels = getLevelsForCourse(course._id)

    //Create an options list based on those levels
    let options = []
    levels.forEach(function (level) {
      options.push({label: level.name, value: level._id})
    })
    return options
  }

})

Template.slots.events({
  "click .removeSlotButton"(event) {
    const slotId = $(event.target).data("slotid")
    const slot = getSlot(slotId)
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

})