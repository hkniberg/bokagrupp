AutoForm.addHooks(['addCourseForm'], {
  onSuccess: function(formType, result) {
    Router.go("/admin/courses")
  }
})