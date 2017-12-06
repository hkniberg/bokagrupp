import {getSlot} from "../lib/methods/slotMethods";

export function resetCurrentBooking() {
  setCurrentBooking(null)
}

export function startNewBooking(slotId) {
  console.assert(slotId, "slotId missing")
  setCurrentBooking({slotId: slotId})
}

export function getCurrentBooking() {
  return Session.get("currentBooking")
}

export function hasCurrentBooking() {
  return !!getCurrentBooking()
}

export function updateCurrentBooking(fieldName, fieldValue) {
  const booking = getCurrentBooking()
  console.assert(booking, "No current booking")
  booking[fieldName] = fieldValue
  setCurrentBooking(booking)
}

export function getCurrentSlot() {
  const booking = getCurrentBooking()
  if (booking) {
    return getSlot(booking.slotId)
  } else {
    return null
  }
}

export function setCurrentBooking(booking) {
  Session.set("currentBooking", booking)
}

export function getCurrentCourse() {
  const slot = getCurrentSlot()
  if (slot) {
    return slot.course()
  } else {
    return null
  }
}