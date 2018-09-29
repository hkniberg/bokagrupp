Template.attendance.helpers({
  attendanceLink() {
    const course = Template.currentData()
    return Meteor.absoluteUrl("attendance/" + course.attendanceKey)
  }
})