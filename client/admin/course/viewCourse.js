import {getLevelsForCourse} from "../../../lib/methods/levelMethods";
import {getSlotsForCourse} from "../../../lib/methods/slotMethods";
import {getBookingsForCourse} from "../../../lib/methods/bookingMethods";
import {getUploadUrl} from "../../../lib/uploads";
import {getAdminRouteToOrg} from "../../../lib/router";
import {getAdminRouteToCourse} from "../../../lib/router";

Template.viewCourse.helpers({
  org() {
    const course = Template.currentData()
    if (course) {
      return course.org()
    }
  },

  orgPath() {
    const course = Template.currentData()
    if (course) {
      return getAdminRouteToOrg(course.org())
    }
  },

  coursePath() {
    const course = Template.currentData()
    if (course) {
      const orgPath = getAdminRouteToOrg(course.org())
      return orgPath + "/course/" + course.shortName
    }
  },

  levels() {
    const course = Template.currentData()
    return getLevelsForCourse(course._id)
  },

  slots() {
    const course = Template.currentData()
    return getSlotsForCourse(course._id)
  },

  bookings() {
    const course = Template.currentData()
    return getBookingsForCourse(course._id)
  },

  selectedDatePeriod() {
    return Session.get("selectedDatePeriod")
  },

  logoFilePath() {
    return getUploadUrl(this.logoFile)
  }
})

Template.viewCourse.events({
  "click .removeCourseButton"() {
    const course = Template.currentData()
    sweetAlert({
      title: "Är du säker?",
      text: "Vill du verkligen ta bort kursen? Alla nivåer och grupper kommer försvinna!",
      type: "warning",
      confirmButtonColor: "red",
      confirmButtonText: "Japp! Bort med kursen!",
      showCancelButton: true
    }, function(){
      Meteor.call("removeCourse", course._id)
      Router.go(getAdminRouteToOrg(course.org()) + "/courses")
    });
  },

  "click .printBookingsButton"() {
    const course = Template.currentData()
    const datePeriod = Session.get("selectedDatePeriod")
    Router.go(getAdminRouteToCourse(course) + "/print/" + datePeriod)
  }
})