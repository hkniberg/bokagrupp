import {Courses} from "../../../lib/collection"
import {linkField} from "../../tableUtils";
import {getUrlRelativeToCurrent} from "../../helpers";

Template.courses.helpers({
  courses() {
    return Courses.find({}, {sort: {name: 1}})
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
    const org = Template.currentData()
    Router.go("/admin/org/" + org.shortName + "/addCourse")
  }
})

export function courseShortNameField() {
  const org = Template.currentData()
  if (org) {
    return linkField('shortName', 'Kortnamn', function(course) {
      return {
        href: '/admin/org/' + org.shortName + '/course/' + course.shortName,
        text: course.shortName
      }
    })
  }
}
export function registrationUrlField() {

  return linkField('registrationUrl', 'Anmälningssida', function(course) {
    const path = course.registrationPath()
    const url = getUrlRelativeToCurrent(path)
    return {
      href: url,
      text: url
    }
  })
}
