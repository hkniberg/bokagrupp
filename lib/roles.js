
export function isAdmin(userId) {
  console.assert(userId, "userId wasn't given")
  return Roles.userIsInRole(userId, 'superUser') || Roles.userIsInRole(userId, 'courseAdmin')
}

export function isCourseAdmin(userId) {
  console.assert(userId, "userId wasn't given")
  return Roles.userIsInRole(userId, 'courseAdmin')
}

export function isSuperUser(userId) {
  console.assert(userId, "userId wasn't given")
  return Roles.userIsInRole(userId, 'superUser')
}