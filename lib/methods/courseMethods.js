import {Courses, Levels} from "../../lib/collection"
import {assertAdmin} from "../accounts";
import {removeLevel} from "./levelMethods";
import {getBookingsForCourse} from "./bookingMethods";

Meteor.methods({
  addCourse(course) {
    assertAdmin(this.userId)
    return Courses.insert(course)
  },
  
  updateCourse(modifier, _id) {
    assertAdmin(this.userId)
    Courses.update({_id: _id}, modifier)
  },

  removeCourse(courseId) {
    assertAdmin(this.userId)
    removeCourse(courseId)
  }


})

export function removeCourse(courseId) {
  if (getBookingsForCourse(courseId).count() > 0) {
    throw new Meteor.Error("Can't remove this course, it has bookings!")
  }
  const levels = Levels.find({courseId: courseId})
  levels.forEach((level) => {
    removeLevel(level._id)
  })
  Courses.remove({_id: courseId})

}

export function getCourseWithShortName(shortName) {
  const course = Courses.findOne({shortName: shortName})
  if (!course) {
    throw new Error("Hey, there is no course with shortName " + shortName)
  }
  return course
  
}

export function getCourse(courseId) {
  const course = Courses.findOne({_id: courseId})
  if (!course) {
    throw new Error("Hey, there is no course #" + courseId)
  }
  return course
}


export function getCourses() {
  return Courses.find({}, {sort: {startDate: 1}})
}