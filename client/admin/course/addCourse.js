AutoForm.addHooks(['addCourseForm'], {
  onSuccess: function(formType, result) {
    console.log("onSuccess")
    Router.go("/admin/courses")
  }
})