import {getUsersForOrg} from "../../../lib/methods/userMethods";
import {getUser} from "../../../lib/methods/userMethods";

const addingUserVar = new ReactiveVar(false)


Template.users.onRendered(function() {
  addingUserVar.set(false)


  const org = Template.currentData()
  if (getUsersForOrg(org._id).count() == 0) {
    addingUserVar.set(true)
  }

  AutoForm.addHooks(['addUserForm'], {
    onSuccess: function() {
      addingUserVar.set(false)
    }
  })

})

Template.users.helpers({
  addingUser() {
    return addingUserVar.get()
  },

  users() {
    const org = Template.currentData()
    if (org) {
      return getUsersForOrg(org._id)
    }
  },

  userIsMe() {
    const user = Template.currentData()
    return (user._id == Meteor.userId())
  }
})

Template.users.events({
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
      text: "Vill du verkligen ta bort " + user.emails[0].address + " som admin för " + org.name + "?",
      type: "warning",
      confirmButtonColor: "red",
      confirmButtonText: "Japp! Bort!",
      showCancelButton: true
    }, function(){
      Meteor.call("removeUser", userId, org._id)
    });
  }

})
