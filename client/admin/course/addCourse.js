import {getCourse} from "../../../lib/methods/courseMethods";
AutoForm.addHooks(['addCourseForm'], {
  onSuccess: function(formType, courseId) {
    const course = getCourse(courseId)
    Router.go("/admin/course/" + course.shortName)
  }
})