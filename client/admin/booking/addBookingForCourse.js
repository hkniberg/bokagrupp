import {getBooking} from "../../../lib/methods/bookingMethods";
import {getCourse} from "../../../lib/methods/courseMethods";
import {getLevelsForCourse} from "../../../lib/methods/levelMethods";
import {getSlotsForLevel} from "../../../lib/methods/slotMethods";
import {getSlot} from "../../../lib/methods/slotMethods";

const slotIdVar = new ReactiveVar()

AutoForm.addHooks(['addBookingForCourseForm'], {
  onSuccess: function(formType, bookingId) {
    const booking = getBooking(bookingId)
    const course = getCourse(booking.courseId)
    
    Router.go("/admin/bookings/" + course.shortName)
  }
})

Template.addBookingForCourse.helpers({
  levels() {
    const course = Template.currentData()
    return getLevelsForCourse(course._id)
  },

  slots() {
    const level = Template.currentData()
    return getSlotsForLevel(level._id)
  },

  slotId() {
    return slotIdVar.get()
  },

  levelId() {
    const slotId = slotIdVar.get()
    if (slotId) {
      const slot = getSlot(slotId)
      return slot.levelId
    }
  },

  courseId() {
    const course = Template.currentData()
    return course._id
  }
})

Template.addBookingForCourse.events({
  "change .slotSelect"() {
    const slotSelect = $(".slotSelect")
    const slotId = slotSelect.val()
    slotIdVar.set(slotId)
  }
})