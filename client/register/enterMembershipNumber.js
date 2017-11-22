



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

let schema

Template.enterMembershipNumber.helpers({
  membershipNumberSchema() {
    const slot = Template.currentData()
    if (!slot) {
      return
    }
    const course = slot.course()
    const courseId = course._id
    if (!schema) {
      schema = new SimpleSchema({
        membershipNumber: {
          type: String,
          label: "Barnets medlemsnummer",
          min: 6,
          max: 7,
          custom: function() {
            const membershipNumber = this.value

            //Ensure that the membership number isn't used by someone else
            //Since we don't have access to all membership numbers on the client,
            //we do this server-side
            if (Meteor.isClient && this.isSet) {
              console.log("Calling isDuplicateMembershipNumber")
              Meteor.call("isDuplicateMembershipNumber", membershipNumber, courseId, function (error, result) {
                console.log("=> got result " + result)
                if (result) {
                  console.log("Adding error")
                  schema.namedContext("membershipNumberForm").addInvalidKeys([{name: "childMembershipNumber", type: "duplicateMembershipNumber"}]);
                }
              });
            }
          }
        }
      })
    }
    return schema
  }
})