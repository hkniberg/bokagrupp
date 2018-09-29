
export function isAdmin(userId, orgId) {
  console.assert(userId, "userId wasn't given")
  if (isSuperUser(userId) || isOrgAdmin(userId, orgId)) {
    return true
  } else {
    return false
  }
}

export function isOrgAdmin(userId, orgId) {
  console.assert(userId, "userId wasn't given")
  return Roles.userIsInRole(userId, 'orgAdmin', orgId)
}

export function isSuperUser(userId) {
  console.assert(userId, "userId wasn't given")
  return Roles.userIsInRole(userId, 'superUser')
}

export function assertSuperUser(userId) {
  console.assert(userId, "userId wasn't given")
  if (!Roles.userIsInRole(userId, 'superUser')) {
    console.log("User " + userId + ", must be superUser, and isn't!")
    throw new Meteor.Error("You don't have permission for this")
  }
}

export function assertAdmin(userId, orgId) {
  if (!isAdmin(userId, orgId)) {
    console.log("User " + userId + ", must be superUser or orgAdmin, and isn't!")
    throw new Meteor.Error("You don't have permission for this")
  }
}