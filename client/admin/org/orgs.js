import {Orgs} from "../../../lib/collection"
import {linkField} from "../../tableUtils";

Template.orgs.helpers({
  orgs() {
    return Orgs.find()
  },

  tableSettings() {
    return {
      collection: Orgs,
      fields: [
        orgShortNameField(),
        {key: "name", label: "Namn"}
      ],
      rowsPerPage: 20,
      showNavigation: "auto"
    }
  }

})

Template.orgs.events({
  "click .createButton"() {
    Router.go("/admin/addOrg")
  }
})

export function orgShortNameField() {
  return linkField('shortName', 'Kortnamn', function(org) {
    return {
      href: '/admin/editOrg/' + org.shortName,
      text: org.shortName
    }
  })
}
