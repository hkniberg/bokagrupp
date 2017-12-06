import {Orgs} from "../../lib/collection"
import {getCurrentOrg} from "../helpers";
import {getAdminRouteToOrg} from "../../lib/router";
import {getOrg} from "../../lib/methods/orgMethods";

Template.orgSelector.onRendered(function() {
  this.subscribe("orgs")
})

Template.orgSelector.helpers({
  orgs() {
    return Orgs.find()
  },

  superAdminSelected() {
    if (!getCurrentOrg()) {
      return "selected"
    }
  },

  orgSelected() {
    const currentOrg = getCurrentOrg()
    if (currentOrg && currentOrg._id == this._id) {
      return "selected"
    }
  }
})

Template.orgSelector.events({
  "change .orgSelect"() {
    const orgId = $(".orgSelect").val()
    if (orgId) {
      Router.go(getAdminRouteToOrg(getOrg(orgId)))
    } else {
      Router.go("/admin/orgs")
    }
  }
})