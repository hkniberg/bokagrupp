import {PersonNumber} from "../personNumber";
import {getLevel} from "../methods/levelMethods";
import {isDuplicatePersonNumber} from "../methods/bookingMethods";

let bookingsSchema


export function getBookingsSchema() {

  bookingsSchema = new SimpleSchema({
    slotId: {
      type: String,
      label: "Grupp"
    },

    levelId: {
      type: String,
      label: "Nivå"
    },

    courseId: {
      type: String,
      label: "Kurs"
    },

    parentEmail: {
      type: String,
      regEx: SimpleSchema.RegEx.Email,
      label: "Din epost"
    },

    parentPhone: {
      type: String,
      label: "Ditt mobilnummer"
    },

    childFirstName: {
      type: String,
      label: "Barnets förnamn"
    },

    childLastName: {
      type: String,
      label: "Barnets efternamn"
    },

    //TODO: verify that it isn't a duplicate within the same course
    childPersonNumber: {
      type: String,
      label: "Barnets personnummer",
      custom: function() {
        const personNumber = new PersonNumber(this.value)

        //Ensure that it is valid
        if (!personNumber.isValid()) {
          return "invalidPersonNumber"
        }

        //Ensure that the kid isn't too old or too young
        const now = new Date()
        const age = personNumber.getAge(now)
        const levelField = this.siblingField("levelId")
        if (levelField.isSet) {
          const levelId = levelField.value
          const level = getLevel(levelId)
          if (level.minAge && age < level.minAge) {
            return "tooYoung"
          }
          if (level.maxAge && age > level.maxAge) {
            return "tooOld"
          }
        }

        //Ensure that the kid isn't already registered
        //Since we don't have access to all person numbers on the client,
        //we do this server-side
        if (Meteor.isClient && this.isSet) {
          const courseId = this.siblingField("courseId").value
          Meteor.call("isDuplicatePersonNumber", personNumber.toString(), courseId, function (error, result) {
            if (result) {
              bookingsSchema.namedContext("enterContactInfoForm").addInvalidKeys([{name: "childPersonNumber", type: "duplicatePersonNumber"}]);
            }
          });
        }        
      }
    },

    childZip: {
      type: String,
      label: "Barnets postnummer"
    },

    //TODO: verify that it isn't a duplicate within the same course
    childMembershipNumber: {
      type: String,
      label: "Barnets medlemsnummer"
    },

    paid: {
      type: Boolean,
      label: "Betald",
      defaultValue: false
    },

    comment: {
      type: String,
      label: "Kommentar",
      optional: true,
      autoform: {
        rows: 3
      }
    },

    creationTime: {
      type: Date,
      autoValue: function() {return new Date()}
    }
  })
  return bookingsSchema
}