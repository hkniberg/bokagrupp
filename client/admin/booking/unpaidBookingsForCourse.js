import {getUnpaidBookingsForCourse} from "../../../lib/methods/bookingMethods";
import {formatDate} from "../../../lib/dateUtil"

Template.unpaidBookingsForCourse.helpers({
  unpaidBookings() {
    const course = Template.currentData()
    return getUnpaidBookingsForCourse(course._id)
  },

  tableSettings() {
    const course = Template.currentData()

    return {
      collection: getUnpaidBookingsForCourse(course._id),
      fields: [
        {label: "Betalat?", tmpl: Template.unpaidBookingsForCourse_paymentStatusButton, sortable: false},
        {key: "childFirstName", label: "Förnamn"},
        {key: "childLastName", label: "Efternamn"},
        {key: "childMembershipNumber", label: "Medlemsnummer"},
        {key: "childBirthDate", label: "Födelsedatum", fn: function(birthDate) {
          return formatDate(birthDate)
        }},
        {key: "parentEmail", label: "Epost"},
        {key: "parentPhone", label: "Telefon"},
        {key: "comment", label: "Kommentar"}
      ],
      rowsPerPage: 100,
      showNavigation: "auto"
    }
  }
})