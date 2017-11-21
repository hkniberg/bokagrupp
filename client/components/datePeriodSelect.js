import {getDatePeriodsForCourse} from "../../lib/methods/slotMethods";

Template.datePeriodSelect.events({
  "change .datePeriodSelect"() {
    const datePeriodSelect = $(".datePeriodSelect")
    const datePeriod = datePeriodSelect.val()
    Session.set("selectedDatePeriod", datePeriod)
  }
})

Template.datePeriodSelect.helpers({
  datePeriods() {
    const course = Template.currentData()
    return getDatePeriodsForCourse(course._id)
  },

  selected() {
    const datePeriod = Template.currentData()
    const selectedDatePeriod = Session.get("selectedDatePeriod")
    if (selectedDatePeriod && datePeriod && selectedDatePeriod == datePeriod) {
      return "selected"
    }
  }
})