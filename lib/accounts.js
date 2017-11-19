AccountsTemplates.configure({
  defaultLayout: 'layout'
});

// Options: https://github.com/meteor-useraccounts/core/blob/master/Guide.md#basic-customization
AccountsTemplates.configure({
  enablePasswordChange: true,
  showForgotPasswordLink: true,
  overrideLoginErrors: false
});

export function assertSuperUser(userId) {
  console.assert(userId, "userId wasn't given")
  if (!Roles.userIsInRole(userId, 'superUser')) {
    console.log("User " + userId + ", must be superUser, and isn't!")
    throw new Meteor.Error("You don't have permission for this")
  }
}

export function assertAdmin(userId) {
  console.assert(userId, "userId wasn't given")
  if (!Roles.userIsInRole(userId, 'superUser') && !Roles.userIsInRole(userId, 'courseAdmin')) {
    console.log("User " + userId + ", must be superUser or courseAdmin, and isn't!")
    throw new Meteor.Error("You don't have permission for this")
  }
}