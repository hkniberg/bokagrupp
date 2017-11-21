import {PersonNumber} from "../personNumber";
import {getLevel} from "../methods/levelMethods";
export function getBookingsSchema() {
  SimpleSchema.messages({
    "invalidPersonNumber": "Ogiltigt personnummer",
    "tooYoung": "Barnet är för ung för denna grupp",
    "tooOld": "Barnet är för gammal för denna grupp"
  });


  return new SimpleSchema({
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

    childPersonNumber: {
      type: String,
      label: "Barnets personnummer",
      custom: function() {
        const personNumber = new PersonNumber(this.value)
        if (!personNumber.isValid()) {
          return "invalidPersonNumber"
        }
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
      }
    },

    childZip: {
      type: String,
      label: "Barnets postnummer"
    },

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
      defaultValue: new Date()
    }
  })
}