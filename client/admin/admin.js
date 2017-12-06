import {Orgs} from "../../lib/collection"
import {isSuperUser} from "../../lib/roles";

Template.admin.onRendered(function() {
  this.subscribe('orgs')
  const userId = Meteor.userId()
  if (!userId) {
    console.log("Strange, user is not logged in")
    return
  }

  if (isSuperUser(userId)) {
    Router.go('/admin/orgs')
  } else {
    const org = Orgs.findOne()
    if (!org) {
      console.log("Strange, user is logged in but doesn't have any orgs!")
    } else {
      Router.go('/admin/org/' + org.shortName + '/courses')
    }
  }
})