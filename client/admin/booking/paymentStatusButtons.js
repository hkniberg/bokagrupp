Template.paymentStatusButtons.helpers({
  yesButtonClass() {
    const booking = Template.currentData().booking
    if (booking.paid) {
      return "payment_status_true"
    }
  },

  noButtonClass() {
    const booking = Template.currentData().booking
    if (!booking.paid) {
      return "payment_status_false"
    }
  }
})

Template.paymentStatusButtons.events({
  "click .yesButton"() {
    const booking = Template.currentData().booking
    const confirm = Template.currentData().confirm
    if (booking.paid) {
      return
    }

    if (confirm) {
      sweetAlert({
        title: "Ändra betalstatus till Ja?",
        text: booking.childFullName() + " har alltså betalat?",
        type: "warning",
        confirmButtonText: "Det stämmer",
        showCancelButton: true
      }, function(){
        Meteor.call("setBookingPaid", booking._id, true)
      });
    } else {
      Meteor.call("setBookingPaid", booking._id, true)
    }


  },
  "click .noButton"() {
    const booking = Template.currentData().booking
    const confirm = Template.currentData().confirm
    if (!booking.paid) {
      return
    }
    if (confirm) {
      sweetAlert({
        title: "Ändra betalstatus till Nej?",
        text: booking.childFullName() + " har alltså INTE betalat?",
        type: "warning",
        confirmButtonText: "Det stämmer",
        showCancelButton: true
      }, function(){
        Meteor.call("setBookingPaid", booking._id, false)
      });
    } else {
      Meteor.call("setBookingPaid", booking._id, false)
    }
  }

})