import {assertSuperUser} from "../roles"
import {isOrgAdmin} from "../roles"
import {isSuperUser} from "../roles"

Meteor.methods({
  /*
      user should be something like:
      {
        email: ...
        password: ...
        role: superUser | courseAdmin
      }
   */
  addUser(userToAdd) {
    //TODO what if user already exists, for another org?

    console.assert(userToAdd, "user must be given")
    console.assert(userToAdd.email, "email must be given")
    console.assert(userToAdd.password, "password must be given")
    console.assert(userToAdd.role, "role must be given")

    if (Meteor.isServer) {
      if (!isSuperUser(this.userId)) {
        //I am not a superUser.
        //Make sure I am orgAdmin.

        const orgId = getUserOrgId(this.userId)
        if (!isOrgAdmin(this.userId, orgId)) {
          throw new Meteor.Error("You need to be superUser or orgAdmin to add new users!")
        }

        //OK I am orgAdmin.
        if (userToAdd.role != "orgAdmin" && userToAdd.role != "courseAdmin") {
          throw new Meteor.Error("As orgAdmin, you are only allowed to add other orgAdmin and courseAdmin roles, not " + userToAdd.role)
        }

        //Set the orgId of the new users to the same as my orgId.
        if (!orgId) {
          throw new Meteor.Error("You are not superUser, and I don't know which org you belong to, so I can't add a new user")
        }
        userToAdd.orgId = orgId

      } else {
        //OK I am a superUser, so anything goes.
      }

      let _id = Accounts.createUser({
        email: userToAdd.email,
        password: userToAdd.password
      });
      if (userToAdd.role == "superUser") {
        Roles.addUsersToRoles(_id, userToAdd.role);
      } else {
        Roles.addUsersToRoles(_id, userToAdd.role, userToAdd.orgId);
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

  removeUser(userIdToRemove, orgId) {
    console.assert(userIdToRemove, "userIdToRemove wasn't given")
    console.assert(orgId, "orgId wasn't given")

    const userToRemove = getUser(userIdToRemove)

    if (isSuperUser(this.userId)) {
      //superUser can do anything
    } else if (isOrgAdmin(this.userId, orgId)) {
      //orgAdmin can remove users from own org.
    } else {
      throw new Meteor.Error("Only superUser and orgAdmin can remove users")
    }


    const unset = {}
    unset["roles." + orgId] = 0

    Meteor.users.update({_id: userIdToRemove}, {$unset: unset})

    const user = getUser(userIdToRemove)
    if (!user.roles || Object.keys(user.roles).length == 0) {
      Meteor.users.remove({_id: userIdToRemove})
    }

  }

})

export function getUser(userId, validate=true) {
  const user = Meteor.users.findOne({_id: userId})
  if (validate) {
    console.assert(user, "Can't find a user with ID " + userId)
  }
  return user
}

export function getUserOrgId(userId) {
  const groups = Roles.getGroupsForUser(userId)
  if (groups.length == 0) {
    console.log("Strange, user " + userId + " doesn't belong to any group")
    return null
  }
  if (groups.length > 1) {
    console.log("Strange, user " + userId + " belongs to multiple groups", groups)
  }
  return groups[0]
}

export function getUsersForOrg(orgId) {
  console.assert(orgId, "orgId wasn't given")
  const selector = {}
  selector["roles." + orgId] = {$exists: true}
  return Meteor.users.find(selector)
}

export function getSuperUsers() {
  return Roles.getUsersInRole('superUser')
}