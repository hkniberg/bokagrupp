import {getLevelsForCourse} from "../../../lib/methods/levelMethods";
import {getSlotsForCourse} from "../../../lib/methods/slotMethods";

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
  }

})

Template.viewCourse.events({
  "click .removeButton"() {
    const course = Template.currentData()
    sweetAlert({
      title: "Är du säker?",
      text: "Vill du verkligen ta bort kursen? Alla anmälningar kommer försvinna!",
      type: "warning",
      confirmButtonColor: "red",
      confirmButtonText: "Japp! Bort med kursen!",
      showCancelButton: true
    }, function(){
      Meteor.call("removeCourse", course._id)
      Router.go("/admin/courses")
    });

  }
})