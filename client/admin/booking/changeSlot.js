import {getSlotsForCourse} from "../../../lib/methods/slotMethods";
import {getCourse} from "../../../lib/methods/courseMethods";
import {getBooking} from "../../../lib/methods/bookingMethods";

AutoForm.addHooks(['changeSlotForm'], {
  onSuccess: function(formType, bookingId) {
    const booking = getBooking(bookingId)
    const course = getCourse(booking.courseId)

    Router.go("/admin/bookings/" + course.shortName)
  }
})

Template.changeSlot.helpers({
  slotSelectValues() {
    let options = []

    const booking = Template.currentData()
    const slots = getSlotsForCourse(booking.courseId)

    //Create an options list based on those customers
    slots.forEach(function (slot) {
      options.push({
        label: slot.name(),
        value: slot._id
      })
    })

    return options
  }
})