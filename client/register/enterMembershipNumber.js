import {getCurrentBooking} from "./currentBooking";
import {getPublicRouteToCourse} from "../../lib/router";
import {updateCurrentBooking} from "../bookingSession";
import {getCurrentCourse} from "../bookingSession";

Template.enterMembershipNumber.onRendered(function() {
  AutoForm.addHooks(['membershipNumberForm'], {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      const membershipNumber = insertDoc.membershipNumber
      updateCurrentBooking("membershipNumber", membershipNumber)
      this.done()
      return false
    },
    onSuccess: function(formType, result) {
      const course = getCurrentCourse()
      Router.go(getPublicRouteToCourse(course) + "/enterContactInfo")
    }
  })
})


let schema

Template.enterMembershipNumber.helpers({
  membershipNumberSchema() {
    const course = getCurrentCourse()
    const courseId = course._id
    if (!schema) {
      schema = new SimpleSchema({
        membershipNumber: {
          type: String,
          label: "Barnets medlemsnummer",
          min: 6,
          max: 7,
          custom: function() {
            const membershipNumber = this.value

            //Ensure that the membership number isn't used by someone else
            //Since we don't have access to all membership numbers on the client,
            //we do this server-side
            if (Meteor.isClient && this.isSet) {
              console.log("Calling isDuplicateMembershipNumber")
              Meteor.call("isDuplicateMembershipNumber", membershipNumber, courseId, function (error, result) {
                console.log("=> got result " + result)
                if (result) {
                  console.log("Adding error")
                  schema.namedContext("membershipNumberForm").addInvalidKeys([{name: "childMembershipNumber", type: "duplicateMembershipNumber"}]);
                }
              });
            }
          }
        }
      })
    }
    return schema
  }
})