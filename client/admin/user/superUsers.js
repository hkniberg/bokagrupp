import {getUser} from "../../../lib/methods/userMethods";
import {getSuperUsers} from "../../../lib/methods/userMethods";

const addingUserVar = new ReactiveVar(false)


Template.superUsers.onRendered(function() {
  if (getSuperUsers().count() == 0) {
    addingUserVar.set(true)
  }

  AutoForm.addHooks(['addSuperUserForm'], {
    onSuccess: function(formType, result) {
      addingUserVar.set(false)
    }
  })

})

Template.superUsers.helpers({
  addingUser() {
    return addingUserVar.get()
  },

  users() {
    return getSuperUsers()
  },

  userIsMe() {
    const user = Template.currentData()
    return (user._id == Meteor.userId())
  }
})

Template.superUsers.events({
  "click .createUserButton"() {
    addingUserVar.set(true)
  },

  "click .cancelButton"() {
    addingUserVar.set(false)
  },

  "click .removeUserButton"(event) {
    const org = Template.currentData()
    const userId = $(event.target).data("userid")
    const user = getUser(userId)
    sweetAlert({
      title: "Är du säker?",
      text: "Vill du verkligen ta bort " + user.emails[0].address + " som superanvändare?",
      type: "warning",
      confirmButtonColor: "red",
      confirmButtonText: "Japp! Bort!",
      showCancelButton: true
    }, function(){
      Meteor.call("removeUser", userId, org._id)
    });
  }

})
