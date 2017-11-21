Template.slotAvailability.helpers({
  cssClass() {
    const slot = Template.currentData()
    const available = slot.availableSpace()
    if (available <= 0) {
      return "slot-full-message"
    } else {
      return "slot-spaces-left"
    }
  },

  description() {
    const slot = Template.currentData()
    const available = slot.availableSpace()
    if (available <= 0) {
      return "(Fullbokat)"
    } else if (available == 1) {
      return "1 plats kvar"
    } else {
      return "" + available + " platser kvar"
    }
  }
})