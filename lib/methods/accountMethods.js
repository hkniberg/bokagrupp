import {assertSuperUser} from "../accounts";
Meteor.methods({
  /*
      user should be something like:
      {
        email: ...
        password: ...
        role: superUser | courseAdmin
      }
   */
  addUser(user) {
    if (Meteor.isServer) {
      let _id = Accounts.createUser({
        email: user.email,
        password: user.password
      });
      if (user.role) {
        Roles.addUsersToRoles(_id, user.role, Roles.GLOBAL_GROUP);
      }
    }
  },
  
  setRole(userId, role) {
    console.assert(userId, "userId wasn't given")

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

  }
})