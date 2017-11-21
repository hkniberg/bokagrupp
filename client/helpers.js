import {isAdmin} from "../lib/roles"
import {Courses, Levels, Slots, Bookings} from "../lib/collection"


/**
 * Sets an error to be shown by the errorMessage template.
 * The context is optional. Could be for example the name of the form in which the error occurred.
 * This allows different error messages to be shown in different parts of a page.
 */
export function showError(err, context) {
  console.log("showError", err, context)
  let message
  if (err.message) {
    message = err.message
  } else {
    message = "" + err
  }

  if (context) {
    Session.set(context + ".error", message)
  } else {
    Session.set("error", message)
  }
}

export function clearError(context) {
  if (context) {
    Session.set(context + ".error", null)
  } else {
    Session.set("error", null)
  }
}

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
  return Meteor.userId() && isAdmin(Meteor.userId())
})

Template.registerHelper('Courses', function() {
  return Courses
})
Template.registerHelper('Levels', function() {
  return Levels
})
Template.registerHelper('Slots', function() {
  return Slots
})
Template.registerHelper('Bookings', function() {
  return Bookings
})

Template.registerHelper('formatDate', function (date) {
  return formatDate(date)
});

export const formatDate = function(date) {
  return moment(date).format('YYYY-MM-DD')
}


