
import {Slots, Bookings} from "../../lib/collection"
import {assertAdmin} from "../accounts";
import {removeBooking} from "./bookingMethods";
import {getLevel} from "./levelMethods";
import {getBookingsForSlot} from "./bookingMethods";

const slotSortOrder = [['time', 'asc'], ['levelSortKey', 'asc']]

Meteor.methods({
  addSlot(slot) {
    assertAdmin(this.userId)

    console.assert(slot, "slot missing")
    console.assert(slot.levelId, "slot.levelId missing")

    const level = getLevel(slot.levelId)
    slot.courseId = level.courseId


    return Slots.insert(slot)
  },

  updateSlot(modifier, _id) {
    assertAdmin(this.userId)
    Slots.update({_id: _id}, modifier)
    return _id

  },

  updateSlotWithoutValidation(modifier, _id) {
    assertAdmin(this.userId)
    Slots.update({_id: _id}, modifier, {validate: false})
    return _id

  },
  removeSlot(_id) {
    assertAdmin(this.userId)
    removeSlot(_id)
  }
})

export function getSlot(slotId) {
  const slot = Slots.findOne({_id: slotId})
  if (!slot) {
    throw new Error("Hey, there is no slot #" + slotId)
  }
  return slot
}

/**
 * Ordered by time, then levelSortKey
 * @param courseId
 * @returns {*}
 */
export function getSlotsForCourse(courseId) {
  return Slots.find({courseId: courseId}, {sort: slotSortOrder})
}

export function getSlotsForLevel(levelId) {
  return Slots.find({levelId: levelId}, {sort: slotSortOrder})
}

export function removeSlot(slotId) {
  if (getBookingsForSlot(slotId).count() > 0) {
    throw new Meteor.Error("Can't remove this slot, it has bookings!")
  }
  
  const bookings = Bookings.find({slotId: slotId})
  bookings.forEach((booking) => {
    removeBooking(booking._id)
  })
  Slots.remove({_id: slotId})
}

export function getSlotsForCourseAndDatePeriod(courseId, datePeriod) {
  console.assert(courseId, "courseId missing")
  console.assert(datePeriod, "datePeriod missing")
  return Slots.find(
    {courseId: courseId, datePeriod: datePeriod},
    {sort: slotSortOrder}
  )
}

export function getDatePeriodsForCourse(courseId, datePeriod) {
  const slots = getSlotsForCourse(courseId)
  const datePeriods = new Set()
  slots.forEach((slot) => {
    datePeriods.add(slot.datePeriod)
  })
  return Array.from(datePeriods.values())
}