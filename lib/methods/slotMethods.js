
import {Slots, Bookings} from "../../lib/collection"
import {assertAdmin} from "../accounts";
import {removeBooking} from "./bookingMethods";

Meteor.methods({
  addSlot(slot) {
    assertAdmin(this.userId)
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
