import {getAge} from "../dateUtil";
import {getSlot} from "../methods/slotMethods";

let bookingsSchema


export function getBookingsSchema() {

  bookingsSchema = new SimpleSchema({
    slotId: {
      type: String,
      label: "Grupp"
    },

    levelId: {
      type: String,
      label: "Nivå",
      optional: true
    },

    courseId: {
      type: String,
      label: "Kurs",
      optional: true
    },

    orgId: {
      type: String,
      optional: true
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

    childGender: {
      type: String,
      label: "Barnets kön",
      allowedValues: ['pojke', 'flicka'],
      autoform: {
        firstOption: "",
        options: [
          {label: "Flicka", value: "flicka"},
          {label: "Pojke", value: "pojke"}
        ]
      }
    },

    childBirthDate: {
      type: Date,
      label: "Barnets födelsedatum",
      custom: function() {
        //Ensure that the kid isn't too old or too young
        const birthDate = this.value

        const slotField = this.siblingField("slotId")
        if (slotField.isSet) {
          const slotId = slotField.value
          const slot = getSlot(slotId)
          const level = slot.level()
          const course = slot.course()

          const age = getAge(birthDate, course.startDate)

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

    //TODO: verify that it isn't a duplicate within the same course
    childMembershipNumber: {
      type: String,
      label: "Barnets medlemsnummer"
    },

    gdpr: {
      type: Boolean,
      label: "JA",
      defaultValue: false,
      custom: function() {
        const gdprAccept = this.value
        if (!gdprAccept) {
          return "gdprRequired"
        }
      }
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
    },

    modifiedTime: {
      type: Date,
      optional: true
    }
  })
  return bookingsSchema
}