import {Bookings, Slots} from "../../lib/collection"
import {assertAdmin} from "../accounts";
import {getSlot} from "./slotMethods";
import {getSlotsForCourseAndDatePeriod} from "./slotMethods";
import {PersonNumber} from "../personNumber";

Meteor.methods({

  isDuplicatePersonNumber(childPersonNumber, courseId) {
    return isDuplicatePersonNumber(childPersonNumber, courseId)
  },

  isDuplicateMembershipNumber(childMembershipNumber, courseId) {
    return isDuplicateMembershipNumber(childMembershipNumber, courseId)
  },

  addBookingAndSendEmail(booking) {
    const bookingId = addBooking(booking)
    if (Meteor.isServer) {
      //TODO background task
      Meteor.setTimeout(() => {
        sendConfirmationEmailToParent(bookingId)
      }, 100)
    }
    return bookingId
  },

  addBooking(booking) {
    return addBooking(booking)
  },

  updateBooking(modifier, _id) {
    assertAdmin(this.userId)

    fixPersonNumber(modifier["$set"])

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

export function sendConfirmationEmailToParent(bookingId) {
  const booking = getBooking(bookingId)
  const slot = booking.slot()
  const level = booking.level()
  const course = booking.course()

  const thanks = `<p>Tack för din anmälan av ${booking.childFirstName} till gruppen ${level.name}, ${slot.time} perioden ${slot.datePeriod}.</p>`
  const emailText = thanks + course.paymentInstructions

  console.log("emailText", emailText)

  Email.send({
    from: course.confirmationEmailSender,
    to: booking.parentEmail,
    subject: course.confirmationEmailSubject,
    html: emailText
  })
  if (process.env.MAIL_URL) {
    console.log("Sent confirmation email to " + booking.parentEmail)
  } else {
    console.log("MAIL_URL is not sent, so I can't send the confirmation email to " + booking.parentEmail)
  }

}

export function isDuplicatePersonNumber(childPersonNumber, courseId) {
  const duplicate = Bookings.find({courseId: courseId, childPersonNumber: childPersonNumber}).count() > 0
  return duplicate
}

export function isDuplicateMembershipNumber(childMembershipNumber, courseId) {
  console.log("isDuplicateMembershipNumber", childMembershipNumber, courseId)
  const duplicate = Bookings.find({courseId: courseId, childMembershipNumber: childMembershipNumber}).count() > 0
  console.log(" => " + duplicate)
  return duplicate
}

export function addBooking(booking) {
  console.assert(booking, "booking missing")
  console.assert(booking.slotId, "booking.slotId missing")

  fixPersonNumber(booking)

  const slot = getSlot(booking.slotId)
  booking.levelId = slot.levelId
  booking.courseId = slot.courseId

  const bookingId = Bookings.insert(booking)
  Slots.update({_id: booking.slotId}, {$inc: {bookingCount: 1}})
  return bookingId

}

export function fixPersonNumber(booking) {
  if (booking.childPersonNumber) {
    booking.childPersonNumber = new PersonNumber(booking.childPersonNumber).toString()
  }
}

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