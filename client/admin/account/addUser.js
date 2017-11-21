import {getUserSchema} from "../../../lib/schemas/userSchema";
AutoForm.addHooks(['addUserForm'], {
  onSuccess: function(formType, result) {
    Router.go("/admin/users")
  }
})

Template.addUser.helpers({
  userSchema() {
    console.log("returning userSchema")
    return getUserSchema()
  }
})