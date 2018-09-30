import {Courses} from "../../../lib/collection"
import {getAdminRouteToCourse} from "../../../lib/router";

AutoForm.addHooks(['editClonedCourseForm'], {
  onSuccess: function(formType, result) {
    const courseId = this.docId
    const updatedCourse = Courses.findOne({_id: courseId})
    Router.go(getAdminRouteToCourse(updatedCourse))
  }
})

Template.editClonedCourse.helpers({
  course() {
    return Template.currentData()
  }
})