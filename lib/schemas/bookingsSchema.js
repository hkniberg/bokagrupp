
export function getBookingsSchema() {
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
      label: "Barnets personnummer"
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
      optional: true
    },

    creationTime: {
      type: Date,
      defaultValue: new Date()
    }
  })
}