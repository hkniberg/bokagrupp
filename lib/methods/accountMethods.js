import {assertSuperUser} from "../accounts";
Meteor.methods({
  setRole(userId, role) {
    console.assert(userId, "userId wasn't given")
    console.assert(role, "role wasn't given")

    assertSuperUser(this.userId)

    if (!role) {

      Roles.removeUsersFromRoles(userId, "superUser", Roles.GLOBAL_GROUP)
      Roles.removeUsersFromRoles(userId, "courseAdmin", Roles.GLOBAL_GROUP)

    } else if (role == 'courseAdmin') {

      Roles.removeUsersFromRoles(userId, "superUser", Roles.GLOBAL_GROUP)
      Roles.addUsersToRoles(userId, role, Roles.GLOBAL_GROUP)

    } else if (role == 'superUser') {

      Roles.removeUsersFromRoles(userId, "courseAdmin", Roles.GLOBAL_GROUP)
      Roles.addUsersToRoles(userId, role, Roles.GLOBAL_GROUP)

    } else {
      throw new Meteor.Error("Role must be empty, courseAdmin, or superUser")
    }
  },

  removeUser(userId) {
    console.assert(userId, "userId wasn't given")
    assertSuperUser(this.userId)

    Meteor.users.remove({_id: userId})
    console.log("Removed user " + userId)

  }
})