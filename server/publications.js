import {Courses, Levels} from "../lib/collection"
import {assertSuperUser} from "../lib/accounts"

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

Meteor.publish('levels', function(courseShortName) {
  const course = getCourseWithShortName(courseShortName)
  return [
    Courses.find({_id: course._id}),
    Levels.find({courseId: course._id})
  ]
})

function getCourseWithShortName(shortName) {
  const course = Courses.findOne({shortName: shortName})
  console.assert(course, "Can't find a course with shortName " + shortName)
  return course

}