import {getOrg} from "../../../lib/methods/orgMethods";
AutoForm.addHooks(['addOrgForm'], {
  onSuccess: function(formType, orgId) {
    const org = getOrg(orgId)
    Router.go("/admin/org/" + org.shortName + '/users')
  }
})