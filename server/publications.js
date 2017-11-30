import {Courses, Levels, Slots, Bookings} from "../lib/collection"
import {Uploads} from "../lib/uploads"
import {assertSuperUser} from "../lib/accounts"
import {assertAdmin} from "../lib/accounts";
import {getSlotsForCourseAndDatePeriod} from "../lib/methods/slotMethods";
import {getBookingsForCourseAndDatePeriod} from "../lib/methods/bookingMethods";

Meteor.publish('users', function() {
  assertSuperUser(this.userId)
  return Meteor.users.find()
})

Meteor.publish('user', function(email) {
  assertSuperUser(this.userId)
  return Meteor.users.find({"emails.0.address": email})
})

Meteor.publish('courses', function() {
  return Courses.find()
})

Meteor.publish('course', function(shortName) {
  return [
    Courses.find({shortName: shortName}),
    Uploads.collection.find()
  ]
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

Meteor.publish('slot', function(slotId) {
  const slot = Slots.findOne({_id: slotId})
  const level = Levels.findOne({_id: slot.levelId})
  const course = Courses.findOne({_id: level.courseId})

  return [
    Slots.find({_id: slot._id}),
    Levels.find({_id: level._id}),
    Courses.find({_id: course._id}),
    Uploads.collection.find()
  ]
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
    Uploads.collection.find()
  ]
})

function getCourseWithShortName(shortName, validate=true) {
  const course = Courses.findOne({shortName: shortName})
  if (validate) {
    console.assert(course, "Can't find a course with shortName " + shortName)
  }
  return course

}