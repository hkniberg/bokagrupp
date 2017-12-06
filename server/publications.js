import {Orgs, Courses, Levels, Slots, Bookings} from "../lib/collection"
import {Uploads} from "../lib/uploads"
import {assertAdmin} from "../lib/roles";
import {getSlotsForCourseAndDatePeriod} from "../lib/methods/slotMethods";
import {getBookingsForCourseAndDatePeriod} from "../lib/methods/bookingMethods";
import {getOrgWithShortName} from "../lib/methods/orgMethods";
import {isSuperUser} from "../lib/roles";
import {getCourseWithShortName} from "../lib/methods/courseMethods";
import {getCourseWithOrgAndShortName} from "../lib/methods/courseMethods";
import {getUsersForOrg} from "../lib/methods/userMethods";
import {assertSuperUser} from "../lib/roles";
import {getSuperUsers} from "../lib/methods/userMethods";

Meteor.publish('users', function() {
  assertSuperUser(this.userId)
  return Meteor.users.find()
})

Meteor.publish('usersForOrgName', function(orgShortName) {
  const org = getOrgWithShortName(orgShortName)
  assertAdmin(this.userId, org._id)
  return [
    Orgs.find({_id: org._id}),
    getUsersForOrg(org._id)
  ]

})

Meteor.publish('superUsers', function(orgShortName) {
  assertSuperUser(this.userId)
  return getSuperUsers()

})

Meteor.publish('user', function(email) {
  assertSuperUser(this.userId)
  return Meteor.users.find({"emails.0.address": email})
})

Meteor.publish('courses', function(orgShortName) {
  console.log("subscribed to course for org", orgShortName)
  const org = getOrgWithShortName(orgShortName, false)
  if (org) {
    return [
      Orgs.find({_id: org._id}),
      Courses.find({orgId: org._id}),
      Uploads.collection.find()
    ]
  }
})

/**
 * All orgs that I have access to.
 * For superUser, that's all orgs.
 * For any other user, it's just my orgs.
 */
Meteor.publish('orgs', function() {
  console.log("subscribing to orgs")
  if (!this.userId) {
    console.log("Strange, user is not logged in, and still subscribing to orgs")
    return null
  }
  const orgs = getMyOrgs(this.userId)
  console.log("Found " + orgs.count() + " orgs for " + this.userId)
  return orgs
})

/**
 * Includes my orgs + the given course, including level and slots, and optionally the bookings as well.
 */
Meteor.publish('courseName', function(orgShortName, courseShortName, includeBookings) {
  try {
    console.log("subscribing to courseName", orgShortName, courseShortName, includeBookings)
    const course = getCourseWithOrgAndShortName(orgShortName, courseShortName)
    const org = getOrgWithShortName(orgShortName)
    const cursors = []
    cursors.push(Orgs.find({_id: org._id}))
    cursors.push(Courses.find({_id: course._id}))
    cursors.push(Levels.find({courseId: course._id}))
    cursors.push(Slots.find({courseId: course._id}))
    cursors.push(Uploads.collection.find())
    if (includeBookings) {
      assertAdmin(this.userId, org._id)
      cursors.push(Bookings.find({courseId: course._id}))
    }
    console.log("subscription course count: " + Courses.find({_id: course._id}).count())

    return cursors

  } catch (err) {
    console.log('courseName publication failed', err)
    throw err
  }
})



Meteor.publish('orgName', function(shortName) {
  const org = getOrgWithShortName(shortName, false)
  if (org) {
    return [
      Orgs.find({shortName: shortName}),
      Courses.find({orgId: org._id}),
      Roles.getUsersInRole("orgAdmin", org._id)
    ]
  }
})


Meteor.publish('levelsForCourse', function(courseShortName) {
  const course = getCourseWithShortName(courseShortName, false)
  if (course) {
    return [
      Courses.find({_id: course._id}),
      Levels.find({courseId: course._id}),
      Uploads.collection.find()
    ]
  } else {
    return []
  }
})

Meteor.publish('slotsForCourse', function(courseShortName) {
  const course = getCourseWithShortName(courseShortName, false)
  if (course) {
    return [
      Courses.find({_id: course._id}),
      Slots.find({courseId: course._id}),
      Uploads.collection.find()
    ]
  } else {
    return []
  }
})

Meteor.publish('bookingsForCourse', function(courseShortName) {
  assertAdmin(this.userId)
  const course = getCourseWithShortName(courseShortName, false)
  if (course) {
    return [
      Courses.find({_id: course._id}),
      Levels.find({courseId: course._id}),
      Slots.find({courseId: course._id}),
      Bookings.find({courseId: course._id}),
      Uploads.collection.find()
    ]
  } else {
    return []
  }
})

Meteor.publish('bookingsForCourseAndDatePeriod', function(courseShortName, datePeriod) {
  assertAdmin(this.userId)
  const course = getCourseWithShortName(courseShortName)
  return [
    Courses.find({_id: course._id}),
    Levels.find({courseId: course._id}),
    getSlotsForCourseAndDatePeriod(course._id, datePeriod),
    getBookingsForCourseAndDatePeriod(course._id, datePeriod),
    Uploads.collection.find()
  ]
})

Meteor.publish('slot', function(slotId, includeBookings) {
  const slot = Slots.findOne({_id: slotId})
  const level = Levels.findOne({_id: slot.levelId})
  const course = Courses.findOne({_id: level.courseId})
  const org = Orgs.findOne({_id: course.orgId})

  const cursors = [
    Slots.find({_id: slot._id}),
    Levels.find({_id: level._id}),
    Courses.find({_id: course._id}),
    Orgs.find({_id: org._id}),
    Uploads.collection.find()
  ]

  if (includeBookings) {
    assertAdmin(this.userId)
    cursors.push(Bookings.find({slotId: slot._id}))
  }
  return cursors

})

Meteor.publish('booking', function(bookingId) {
  const booking = Bookings.findOne({_id: bookingId})
  const slot = Slots.findOne({_id: booking.slotId})
  const level = Levels.findOne({_id: slot.levelId})
  const course = Courses.findOne({_id: level.courseId})

  return [
    Bookings.find({_id: booking._id}),
    Slots.find({courseId: course._id}),
    Levels.find({courseId: course._id}),
    Courses.find({_id: course._id}),
    Orgs.find({_id: course.orgId}),
    Uploads.collection.find()
  ]
})

function getMyOrgs(userId) {
  console.assert(userId, "userId wasn't given")
  if (isSuperUser(userId)) {
    return Orgs.find()
  } else {
    const orgIds = Roles.getGroupsForUser(userId)
    console.log("My orgs", orgIds)
    const orgs = Orgs.find({_id: {$in: orgIds}})
    console.log(" => " + orgs.count() + "orgs found")
    return orgs
  }

}


