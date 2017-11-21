Template.paymentStatusButtons.helpers({
  yesButtonClass() {
    const booking = Template.currentData()
    if (booking.paid) {
      return "payment_status_true"
    }
  },

  noButtonClass() {
    const booking = Template.currentData()
    if (!booking.paid) {
      return "payment_status_false"
    }
  }
})

Template.paymentStatusButtons.events({
  "click .yesButton"() {
    const booking = Template.currentData()
    Meteor.call("setBookingPaid", booking._id, true)
  },
  "click .noButton"() {
    const booking = Template.currentData()
    Meteor.call("setBookingPaid", booking._id, false)
  }

})