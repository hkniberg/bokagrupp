import {Orgs} from "../../lib/collection"
import {assertAdmin} from "../roles";
import {getCoursesForOrg} from "./courseMethods";

Meteor.methods({
  addOrg(org) {
    assertAdmin(this.userId)
    return Orgs.insert(org)
  },
  
  updateOrg(modifier, _id) {
    assertAdmin(this.userId)
    Orgs.update({_id: _id}, modifier)
    return _id
  },

  updateOrgWithoutValidation(modifier, _id) {
    assertAdmin(this.userId)
    Orgs.update({_id: _id}, modifier, {validate: false})
    return _id
  },

  removeOrg(orgId) {
    assertAdmin(this.userId)
    if (getBookingsForOrg(orgId).count() > 0) {
      throw new Meteor.Error("Hey, you can't remove a org that has bookings!")
    }

    removeOrg(orgId)
  },

  isDuplicateOrgShortName(shortName) {
    return Orgs.find({shortName: shortName}).count() > 0
  }

})

export function removeOrg(orgId) {
  if (getCoursesForOrg(orgId).count() > 0) {
    throw new Meteor.Error("Can't remove this org, it has courses!")
  }
  Orgs.remove({_id: orgId})
}

export function getOrg(orgId, validate=false) {
  const org = Orgs.findOne({_id: orgId})
  if (validate) {
    console.assert(org, "Can't find a org with ID " + orgId)
  }
  return org
}

export function getDefaultOrgForUser(userId) {
  const orgId = getDefaultOrgIdForUser(userId)
  if (orgId) {
    return Orgs.findOne({_id: orgId})
  } else {
    return null
  }
}

export function getDefaultOrgIdForUser(userId) {
  console.assert(userId, "No userId was given")
  const groups = Roles.getGroupsForUser(userId)
  if (groups.length) {
    return groups[0]
  } else {
    return null
  }

}

export function getOrgs() {
  return Orgs.find({}, {sort: {name: 1}})
}

export function getOrgWithShortName(shortName, validate=true) {
  const org = Orgs.findOne({shortName: shortName})
  if (validate) {
    console.assert(org, "Can't find a org with shortName " + shortName)
  }
  return org

}