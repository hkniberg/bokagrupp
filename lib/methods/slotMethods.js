
import {Slots, Bookings} from "../../lib/collection"
import {assertAdmin} from "../accounts";
import {removeBooking} from "./bookingMethods";
import {getLevel} from "./levelMethods";

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

export function getSlotsForCourse(courseId) {
  return Slots.find({courseId: courseId})
}

export function getSlotsForLevel(levelId) {
  return Slots.find({levelId: levelId})
}

export function removeSlot(slotId) {
  const bookings = Bookings.find({slotId: slotId})
  bookings.forEach((booking) => {
    removeBooking(booking._id)
  })
  Slots.remove({_id: slotId})
}
