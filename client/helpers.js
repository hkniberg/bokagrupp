import {isAdmin} from "../lib/roles"
import {Orgs, Courses, Levels, Slots, Bookings} from "../lib/collection"
import {formatDate} from "../lib/util"
import {isSuperUser} from "../lib/roles";
import {getUserSchema} from "../lib/schemas/userSchema";
import {getCurrentBooking} from "./bookingSession";
import {getCurrentCourse} from "./bookingSession";
import {getCurrentSlot} from "./bookingSession";
import {getAdminRouteToOrg} from "../lib/router";
import {getAdminRouteToCourse} from "../lib/router";
import {getOrgWithShortName} from "../lib/methods/orgMethods";

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
  if (!Meteor.userId()) {
    return false
  } else {
    return isAdmin(Meteor.userId(), getCurrentOrgId())
  }
})

Template.registerHelper('isSuperUser', function() {
  return Meteor.userId() && isSuperUser(Meteor.userId())
})

Template.registerHelper('currentOrg', function() {
  return getCurrentOrg()
})

Template.registerHelper('Orgs', function() {
  return Orgs
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

Template.registerHelper('currentBooking', function() {
  return getCurrentBooking()
})
Template.registerHelper('currentCourse', function() {
  return getCurrentCourse()
})
Template.registerHelper('currentSlot', function() {
  return getCurrentSlot()
})

Template.registerHelper('formatDate', function (date) {
  return formatDate(date)
})

Template.registerHelper('currentOrg', function() {
  return getCurrentOrg()
})

Template.registerHelper('orgPath', function (org) {
  if (!org) {
    org = getCurrentOrg()
  }
  if (org) {
    return getAdminRouteToOrg(org)
  }
})


Template.registerHelper('coursePath', function (course) {
  if (course) {
    return getAdminRouteToCourse(course)
  }
})

Template.registerHelper('courseRegistrationUrl', function (course) {
  if (!course) {
    course = Template.currentData()
  }
  if (course) {
    return getUrlRelativeToCurrent(course.registrationPath())
  }
})

Template.registerHelper('userSchema', () => {
  return getUserSchema()
})

export function getUrlRelativeToCurrent(path) {
  const href = window.location.href
  const pathname = window.location.pathname
  const base = href.substring(0, href.length - pathname.length)
  return base + path
}

export function setCurrentOrgId(orgId) {
  Session.set("currentOrgId", orgId)
}

export function getCurrentOrgId() {
  const org = getCurrentOrg()
  if (org) {
    return org._id
  } else {
    return null
  }
}

export function getCurrentOrg() {
  const route = Router.current()
  if (!route) {
    console.log("Strange, no route")
    return null
  }
  const orgShortName = route.params.orgShortName
  if (!orgShortName) {
    return null
  }
  return getOrgWithShortName(orgShortName, false)
}

