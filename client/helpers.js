import {isAdmin} from "../lib/roles"
import {Courses, Levels} from "../lib/collection"


Template.registerHelper('user', function () {
  return Meteor.user()
})

Template.registerHelper('userEmail', function (userId) {
  if (userId) {
    const user = Meteor.users.findOne({_id: userId})
    if (user) {
      return user.emails[0].address
    } else {
      return null
    }
  } else {
    return Meteor.user().emails[0].address
  }
})

Template.registerHelper('isAdmin', function() {
  return isAdmin(Meteor.userId())
})

Template.registerHelper('Courses', function() {
  return Courses
})
Template.registerHelper('Levels', function() {
  return Levels
})
