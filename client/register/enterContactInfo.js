AutoForm.addHooks(['enterContactInfoForm'], {
  onSuccess: function(formType, bookingId) {
    Router.go("/bookingComplete/" + bookingId)
  }
})

Template.enterContactInfo.helpers({
  membershipNumber() {
    return Session.get("membershipNumber")
  }
})