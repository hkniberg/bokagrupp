import {isAdmin} from "../../../lib/roles";
import {isCourseAdmin} from "../../../lib/roles";
import {isSuperUser} from "../../../lib/roles";
Template.editUser.helpers({
  noRoleChecked() {
    const user = Template.currentData()
    if (!isAdmin(user._id)) {
      return "checked"
    }
  },
  
  courseAdminChecked() {
    const user = Template.currentData()
    if (isCourseAdmin(user._id)) {
      return "checked"
    }
  },
  
  superUserChecked() {
    const user = Template.currentData()
    if (isSuperUser(user._id)) {
      return "checked"
    }
  },

  userIsMe() {
    const user = Template.currentData()
    return Meteor.user()._id == user._id
  }
})

Template.editUser.events({
  "change input[name='role']"() {
    const user = Template.currentData()
    const role = $("input[name='role']:checked").val()
    Meteor.call("setRole", user._id, role)
  },
  
  "click .deleteButton"() {
    const user = Template.currentData()
    sweetAlert({
      title: "Är du säker?",
      text: "Vill du verkligen ta bort användaren?",
      type: "warning",
      confirmButtonColor: "red",
      confirmButtonText: "Japp! Bort med användaren!",
      showCancelButton: true
    }, function(){
      Meteor.call("removeUser", user._id)
      Router.go("/admin/users")
    });    
  }
})