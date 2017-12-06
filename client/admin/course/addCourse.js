import {getCourse} from "../../../lib/methods/courseMethods";
import {getAdminRouteToCourse} from "../../../lib/router";
AutoForm.addHooks(['addCourseForm'], {
  onSuccess: function(formType, courseId) {
    const course = getCourse(courseId)
    Router.go(getAdminRouteToCourse(course))
  }
})

Template.addCourse.helpers({
  orgId() {
    const org = Template.currentData()
    if (org) {
      return org._id
    }
  }
})