export function getBookingsSchemaForAdmin() {

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
      label: "Din epost",
      optional: true
    },

    parentPhone: {
      type: String,
      label: "Ditt mobilnummer",
      optional: true
    },

    childFirstName: {
      type: String,
      label: "Barnets förnamn"
    },

    childLastName: {
      type: String,
      label: "Barnets efternamn",
      optional: true
    },

    //TODO: verify that it isn't a duplicate within the same course
    childPersonNumber: {
      type: String,
      label: "Barnets personnummer",
      optional: true
    },

    childZip: {
      type: String,
      label: "Barnets postnummer",
      optional: true
    },

    //TODO: verify that it isn't a duplicate within the same course
    childMembershipNumber: {
      type: String,
      label: "Barnets medlemsnummer",
      optional: true
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
}