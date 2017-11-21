import {Bookings, Slots} from "../../lib/collection"
import {assertAdmin} from "../accounts";
import {getSlot} from "./slotMethods";
import {getSlotsForCourseAndDatePeriod} from "./slotMethods";

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

    const oldBooking = getBooking(_id)

    Bookings.update({_id: _id}, modifier)

    const newBooking = getBooking(_id)

    if (oldBooking.slotId != newBooking.slotId) {
      //Slot changed! Update the bookingCount for both slots
      Slots.update({_id: oldBooking.slotId}, {$inc: {bookingCount: -1}})
      Slots.update({_id: newBooking.slotId}, {$inc: {bookingCount: 1}})
      //Also update the levelId in case the new slot belongs to another level

      const slot = getSlot(newBooking.slotId)
      Bookings.update({_id: _id}, {$set: {levelId: slot.levelId}})
    }

    return _id
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

export function getBookingsForLevel(levelId) {
  return Bookings.find({levelId: levelId}, {sort: [['childFirstName', 'asc'], ['childLastName', 'asc']]})
}

export function getBookingsForSlot(slotId) {
  return Bookings.find({slotId: slotId}, {sort: [['childFirstName', 'asc'], ['childLastName', 'asc']]})
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

export function getBookingsForCourseAndDatePeriod(courseId, datePeriod) {
  const slots = getSlotsForCourseAndDatePeriod(courseId, datePeriod)
  const slotIds = slots.fetch().map((slot) => {
    return slot._id
  })
  return Bookings.find({
    slotId: {$in: slotIds}
  })
}

export function removeBooking(bookingId) {
  Bookings.remove({_id: bookingId})
}