import {Orgs} from "../../../lib/collection"

AutoForm.addHooks(['editOrgForm'], {
  onSuccess: function(formType, result) {
    const orgId = this.docId
    const updatedOrg = Orgs.findOne({_id: orgId})
    Router.go("/admin/org/" + updatedOrg.shortName)
  }
})

Template.editOrg.helpers({
  org() {
    return Template.currentData()
  }
})