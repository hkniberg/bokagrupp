import {getCourses} from "../../lib/methods/courseMethods";
Template.selectCourse.helpers({
  courses() {
    return getCourses()
  }
})

