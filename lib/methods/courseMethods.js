import {Courses, Levels} from "../../lib/collection"
import {assertAdmin} from "../accounts";
import {removeLevel} from "./levelMethods";

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
    const levels = Levels.find({courseId: courseId})
    levels.forEach((level) => {
      removeLevel(level._id)
    })
    Courses.remove({_id: courseId})    
  }


})

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