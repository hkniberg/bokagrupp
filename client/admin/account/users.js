import {linkField} from "../../tableUtils";
import {isSuperUser} from "../../../lib/roles";
import {isCourseAdmin} from "../../../lib/roles";
Template.users.helpers({
  users() {
    return Meteor.users.find()
  },

  tableSettings() {
    return {
      collection: Meteor.users,
      fields: [
        userEmailField(),
        roleField()
      ]
    }
  }
})

export function roleField() {
  return {
    key: "role",
    label: "Får administrera",
    fn: function(value, user, key) {
      if (isSuperUser(user._id)) {
        return "Allt"
      } else if (isCourseAdmin(user._id)) {
        return "Kurser"
      } else {
        return "Inget"
      }
    }
  }
}

export function userEmailField() {
  return linkField('emails', 'Email', function(user) {
    const email = user.emails[0].address
    return {
      href: '/admin/users/' + email,
      text: email
    }
  })
}
