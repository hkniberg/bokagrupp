
import {Slots, Bookings} from "../../lib/collection"
import {assertAdmin} from "../roles";
import {removeBooking} from "./bookingMethods";
import {getLevel} from "./levelMethods";
import {getBookingsForSlot} from "./bookingMethods";
import {getCourse} from "./courseMethods";

const slotSortOrder = [['time', 'asc'], ['levelSortKey', 'asc']]

Meteor.methods({
  addSlot(slot) {
    console.assert(slot, "slot missing")

    const level = getLevel(slot.levelId)
    const course = getCourse(level.courseId)
    assertAdmin(this.userId, course.orgId)

    slot.courseId = level.courseId
    slot.orgId = course.orgId

    return Slots.insert(slot)
  },

  updateSlot(modifier, _id) {
    const slot = getSlot(_id)
    assertAdmin(this.userId, slot.orgId)

    Slots.update({_id: _id}, modifier)
    return _id

  },

  updateSlotWithoutValidation(modifier, _id) {
    const slot = getSlot(_id)
    assertAdmin(this.userId, slot.orgId)
    
    Slots.update({_id: _id}, modifier, {validate: false})
    return _id

  },
  removeSlot(slotId) {
    const slot = getSlot(slotId)
    assertAdmin(this.userId, slot.orgId)

    if (getBookingsForSlot(slotId).count() > 0) {
      throw new Meteor.Error("Hey, you can't remove a slot that has bookings!")
    }
    removeSlot(slotId)
  }
})

export function cloneSlot(slot, toLevelId) {
  console.log("cloneSlot", slot, toLevelId)
  delete slot._id
  const level = getLevel(toLevelId)
  slot.levelId = toLevelId
  slot.courseId = level.courseId
  slot.bookingCount = 0
  const result = Slots.insert(slot)
  console.log("Slot create result: " + result)
}


export function getSlot(slotId, validate=true) {
  const slot = Slots.findOne({_id: slotId})
  if (validate) {
    console.assert(slot, "Can't find a slot with ID " + slotId)
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