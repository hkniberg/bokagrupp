import {Courses, Levels, Slots, Bookings} from "../lib/collection"
import {assertSuperUser} from "../lib/accounts"
import {assertAdmin} from "../lib/accounts";
import {getSlotsForCourseAndDatePeriod} from "../lib/methods/slotMethods";
import {getBookingsForCourseAndDatePeriod} from "../lib/methods/bookingMethods";

Meteor.publish('users', function() {
  assertSuperUser(this.userId)
  console.log("publish users")
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
  const course = getCourseWithShortName(shortName)
  return Courses.find({_id: course._id})
})

Meteor.publish('levelsForCourse', function(courseShortName) {
  const course = getCourseWithShortName(courseShortName)
  return [
    Courses.find({_id: course._id}),
    Levels.find({courseId: course._id})
  ]
})

Meteor.publish('slotsForCourse', function(courseShortName) {
  const course = getCourseWithShortName(courseShortName)
  return [
    Courses.find({_id: course._id}),
    Slots.find({courseId: course._id})
  ]
})

Meteor.publish('bookingsForCourse', function(courseShortName) {
  assertAdmin(this.userId)
  const course = getCourseWithShortName(courseShortName)
  return [
    Courses.find({_id: course._id}),
    Levels.find({courseId: course._id}),
    Slots.find({courseId: course._id}),
    Bookings.find({courseId: course._id})
  ]
})

Meteor.publish('bookingsForCourseAndDatePeriod', function(courseShortName, datePeriod) {
  console.log("publication opened: bookingsForCourseAndDatePeriod")
  assertAdmin(this.userId)
  const course = getCourseWithShortName(courseShortName)
  return [
    Courses.find({_id: course._id}),
    Levels.find({courseId: course._id}),
    getSlotsForCourseAndDatePeriod(course._id, datePeriod),
    getBookingsForCourseAndDatePeriod(course._id, datePeriod)
  ]
})

Meteor.publish('slot', function(slotId) {
  const slot = Slots.findOne({_id: slotId})
  const level = Levels.findOne({_id: slot.levelId})
  const course = Courses.findOne({_id: level.courseId})

  return [
    Slots.find({_id: slot._id}),
    Levels.find({_id: level._id}),
    Courses.find({_id: course._id})
  ]
})

Meteor.publish('booking', function(bookingId) {
  const booking = Bookings.findOne({_id: bookingId})
  const slot = Slots.findOne({_id: booking.slotId})
  const level = Levels.findOne({_id: slot.levelId})
  const course = Courses.findOne({_id: level.courseId})

  return [
    Bookings.find({_id: booking._id}),
    Slots.find({_id: slot._id}),
    Levels.find({_id: level._id}),
    Courses.find({_id: course._id})
  ]
})

function getCourseWithShortName(shortName) {
  const course = Courses.findOne({shortName: shortName})
  console.assert(course, "Can't find a course with shortName " + shortName)
  return course

}