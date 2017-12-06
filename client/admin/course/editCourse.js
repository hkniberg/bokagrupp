import {Courses} from "../../../lib/collection"
import {getAdminRouteToCourse} from "../../../lib/router";

AutoForm.addHooks(['editCourseForm'], {
  onSuccess: function(formType, result) {
    const courseId = this.docId
    const updatedCourse = Courses.findOne({_id: courseId})
    Router.go(getAdminRouteToCourse(updatedCourse))
  }
})

Template.editCourse.helpers({
  course() {
    return Template.currentData()
  }
})