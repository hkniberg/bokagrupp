import {Levels} from "../../../lib/collection"
import {getLevel} from "../../../lib/methods/levelMethods";
import {getAdminRouteToOrg} from "../../../lib/router";

Template.levels.helpers({
  levels() {
    const course = Template.currentData()
    return Levels.find({courseId: course._id})
  },

  orgPath() {
    const course = Template.currentData()
    if (course) {
      return getAdminRouteToOrg(course.org())
    }
  }

})

Template.levels.events({
  "click .removeLevelButton"(event) {
    const levelId = $(event.target).data("levelid")
    const level = getLevel(levelId)
    sweetAlert({
      title: "Är du säker?",
      text: "Vill du verkligen ta bort nivån " + level.name + "? Alla grupper kommer försvinna också.",
      type: "warning",
      confirmButtonColor: "red",
      confirmButtonText: "Japp! Bort med nivån!",
      showCancelButton: true
    }, function(){
      Meteor.call("removeLevel", levelId)
    });
  }

})