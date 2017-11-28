import {getLevelsForCourse} from "../../../lib/methods/levelMethods";
import {getSlotsForCourse} from "../../../lib/methods/slotMethods";
import {getSlot} from "../../../lib/methods/slotMethods";
import {getBookingsForCourse} from "../../../lib/methods/bookingMethods";

Template.viewCourse.helpers({
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
      Router.go("/admin/courses")
    });
  },

  "click .printBookingsButton"() {
    const course = Template.currentData()
    const datePeriod = Session.get("selectedDatePeriod")
    Router.go("/admin/printBookings/" + course.shortName + "/" + datePeriod)
  }
})