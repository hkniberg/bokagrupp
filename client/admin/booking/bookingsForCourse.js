import {getBooking} from "../../../lib/methods/bookingMethods";
Template.bookingsForCourse.events({
  "click .removeButton"(event) {
    const bookingId = $(event.target).data("bookingid")
    const booking = getBooking(bookingId)
    sweetAlert({
      title: "Är du säker?",
      text: "Vill du verkligen ta bort bokningen för " + booking.childFullName() + "?",
      type: "warning",
      confirmButtonColor: "red",
      confirmButtonText: "Japp! Bort med " + booking.childFirstName + "!",
      showCancelButton: true
    }, function(){
      Meteor.call("removeBooking", bookingId)
    });
  },
  
  "click .changeSlotButton"(event) {
    const bookingId = $(event.target).data("bookingid")
    const booking = getBooking(bookingId)
    Router.go("/admin/changeSlot/" + bookingId)

  }
})