AutoForm.addHooks(['membershipNumberForm'], {
  onSubmit: function(insertDoc, updateDoc, currentDoc) {
    console.log("onSubmit")
    // You must call this.done()!
    //this.done(); // submitted successfully, call onSuccess
    //this.done(new Error('foo')); // failed to submit, call onError with the provided error
    //this.done(null, "foo"); // submitted successfully, call onSuccess with `result` arg set to "foo"
    const membershipNumber = insertDoc.membershipNumber
    Session.set("membershipNumber", membershipNumber)
    this.done()
    return false
  },
  onSuccess: function(formType, result) {
    Router.go("/enterContactInfo")
  }
})

Template.enterMembershipNumber.helpers({
  membershipNumberSchema() {
    return new SimpleSchema({
      membershipNumber: {
        type: String,
        label: "Barnets medlemsnummer",
        min: 6,
        max: 7
      }
    })
  }
})