import {getBooking} from "../../../lib/methods/bookingMethods";
import {getCourse} from "../../../lib/methods/courseMethods";
import {getSlot} from "../../../lib/methods/slotMethods";



AutoForm.addHooks(['addBookingForCourseForm'], {
  onSuccess: function(formType, bookingId) {
    const booking = getBooking(bookingId)
    const course = getCourse(booking.courseId)
    
    Router.go("/admin/bookings/" + course.shortName)
  }
})

Template.addBookingForCourse.helpers({
  slotId() {
    return Session.get("selectedSlotId")
  },

  levelId() {
    const slotId = Session.get("selectedSlotId")
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

