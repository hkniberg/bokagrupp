import {Courses} from "../../../lib/collection"

AutoForm.addHooks(['editCourseForm'], {
  onSuccess: function(formType, result) {
    const courseId = this.docId
    const updatedCourse = Courses.findOne({_id: courseId})
    Router.go("/admin/course/" + updatedCourse.shortName)
  }
})

Template.editCourse.helpers({
  course() {
    const course = Template.currentData()
    return course
  }
})