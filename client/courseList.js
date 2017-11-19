import {Courses} from "../lib/collection"

Template.courseList.helpers({
  courses() {
    return Courses.find()
  }
})