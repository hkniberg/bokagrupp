import {Courses, Levels} from "../../lib/collection"
import {removeLevel} from "./levelMethods";
import {getBookingsForCourse} from "./bookingMethods";
import {assertAdmin} from "../roles";
import {getOrgWithShortName} from "./orgMethods";
import {getLevelsForCourse} from "./levelMethods";
import {cloneLevel} from "./levelMethods";

Meteor.methods({
  addCourse(course) {
    assertAdmin(this.userId, course.orgId)
    return Courses.insert(course)
  },

  cloneCourse(courseId, newShortName) {
    const course = getCourse(courseId)
    assertAdmin(this.userId, course.orgId)
    cloneCourse(course, newShortName)
  },
  
  updateCourse(modifier, _id) {
    const course = getCourse(_id)
    assertAdmin(this.userId, course.orgId)
    Courses.update({_id: _id}, modifier)
    return _id
  },

  updateCourseWithoutValidation(modifier, _id) {
    const course = getCourse(_id)
    assertAdmin(this.userId, course.orgId)
    Courses.update({_id: _id}, modifier, {validate: false})
    return _id
  },

  removeCourse(courseId) {
    const course = getCourse(courseId)
    assertAdmin(this.userId, course.orgId)
    if (getBookingsForCourse(courseId).count() > 0) {
      throw new Meteor.Error("Hey, you can't remove a course that has bookings!")
    }

    removeCourse(courseId)
  },

  isDuplicateCourseShortName(shortName) {
    return Courses.find({shortName: shortName}).count() > 0
  }

})

export function cloneCourse(course, newShortName) {
  const oldCourseId = course._id
  delete course._id
  course.shortName = newShortName
  const newCourseId = Courses.insert(course)

  const levels = getLevelsForCourse(oldCourseId)
  levels.forEach((level) => {
    cloneLevel(level, newCourseId)
  })
}

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

export function getCourseWithOrgAndShortName(orgShortName, courseShortName, validate=true) {
  const org = getOrgWithShortName(orgShortName, validate)
  if (org) {
    const course = Courses.findOne({orgId: org._id, shortName: courseShortName})
    if (validate) {
      console.assert(course, "Can't find a course with shortName " + courseShortName + " in org " + orgShortName)
    }
    return course
  }
}

export function getCourseWithShortName(shortName, validate=true) {
  const course = Courses.findOne({shortName: shortName})
  if (validate) {
    console.assert(course, "Can't find a course with shortName " + shortName)
  }
  return course
}

export function getCourseWithAttendanceKey(attendanceKey, validate=true) {
  const course = Courses.findOne({attendanceKey: attendanceKey})
  if (validate) {
    console.assert(course, "Can't find a course with attendanceKey " + attendanceKey)
  }
  return course
}

export function getCourse(courseId, validate=true) {
  const course = Courses.findOne({_id: courseId})
  if (validate) {
    console.assert(course, "Can't find a course with ID " + courseId)
  }
  return course
}


export function getCoursesForOrg(orgId) {
  return Courses.find({orgId: orgId})
}