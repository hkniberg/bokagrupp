import {Courses} from "../../../lib/collection"
import {linkField} from "../../tableUtils";

Template.courses.helpers({
  courses() {
    return Courses.find()
  },

  tableSettings() {
    return {
      collection: Courses,
      fields: [
        courseShortNameField(),
        {key: "name", label: "Namn"},
        registrationUrlField()
      ],
      rowsPerPage: 20,
      showNavigation: "auto"
    }
  }

})

Template.courses.events({
  "click .createButton"() {
    Router.go("/admin/addCourse")
  }
})

export function courseShortNameField() {
  return linkField('shortName', 'Kortnamn', function(course) {
    return {
      href: '/admin/course/' + course.shortName,
      text: course.shortName
    }
  })
}
export function registrationUrlField() {
  return linkField('registrationUrl', 'Anmälningssida', function(course) {
    return {
      href: course.registrationUrl(),
      text: course.registrationUrl()
    }
  })
}
