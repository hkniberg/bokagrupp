import {Courses} from "../lib/collection"

import {getUploadUrl} from "./../lib/uploads";
Template.layout.helpers({
  logoFilePath() {
    let course
    if (this.logoFile) {
      course = this
    } else if (this.courseId) {
      course = Courses.findOne({_id: this.courseId})
    } else {
      return null
    }
    if (course && course.logoFile) {
      return getUploadUrl(course.logoFile)
    }
  }
})