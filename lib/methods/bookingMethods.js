import {Bookings, Slots} from "../../lib/collection"
import {assertAdmin} from "../accounts";

Meteor.methods({
  addBooking(booking) {
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

export function getBooking(bookingId) {
  return Bookings.findOne({_id: bookingId})
}

export function removeBooking(bookingId) {
  Bookings.remove({_id: bookingId})
}