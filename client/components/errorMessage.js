Template.errorMessage.helpers({
  errorMessage() {
    let error
    const context = Template.currentData()
    if (context) {
      error = Session.get(context + ".error")
    } else {
      error = Session.get("error")
    }

    if (error && error.message) {
      return error.message
    } else {
      return error
    }
  }
})