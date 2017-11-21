import {Bookings, Slots} from "../../lib/collection"
import {assertAdmin} from "../accounts";
import {getSlot} from "./slotMethods";

Meteor.methods({
  addBooking(booking) {
    console.assert(booking, "booking missing")
    console.assert(booking.slotId, "booking.slotId missing")

    const slot = getSlot(booking.slotId)
    booking.levelId = slot.levelId
    booking.courseId = slot.courseId

    const bookingId = Bookings.insert(booking)
    Slots.update({_id: booking.slotId}, {$inc: {bookingCount: 1}})
    return bookingId
  },

  updateBooking(modifier, _id) {
    assertAdmin(this.userId)
    Bookings.update({_id: _id}, modifier)
  },

  removeBooking(bookingId) {
    assertAdmin(this.userId)
    const booking = getBooking(bookingId)
    removeBooking(bookingId)
    Slots.update({_id: booking.slotId}, {$inc: {bookingCount: -1}})
  },

  setBookingPaid(bookingId, paid) {
    assertAdmin(this.userId)
    Bookings.update({_id: bookingId}, {$set: {paid: paid}})
  }

})

export function getBookingsForCourse(courseId) {
  return Bookings.find({courseId: courseId}, {sort: [['childFirstName', 'asc'], ['childLastName', 'asc']]})
}

export function getUnpaidBookingsForCourse(courseId) {
  return Bookings.find(
    {courseId: courseId, paid: false},
    {sort: [['childFirstName', 'asc'], ['childLastName', 'asc']]}
  )
}

export function getBooking(bookingId) {
  const booking = Bookings.findOne({_id: bookingId})
  if (!booking) {
    throw new Error("Hey, there is no booking #" + bookingId)
  }
  return booking
}


export function removeBooking(bookingId) {
  Bookings.remove({_id: bookingId})
}