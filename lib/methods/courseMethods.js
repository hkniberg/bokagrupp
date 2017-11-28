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
    return _id
  },

  updateCourseWithoutValidation(modifier, _id) {
    assertAdmin(this.userId)
    Courses.update({_id: _id}, modifier, {validate: false})
    return _id
  },

  removeCourse(courseId) {
    assertAdmin(this.userId)
    if (getBookingsForCourse(courseId).count() > 0) {
      throw new Meteor.Error("Hey, you can't remove a course that has bookings!")
    }

    removeCourse(courseId)
  },

  isDuplicateCourseShortName(shortName) {
    return Courses.find({shortName: shortName}).count() > 0
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