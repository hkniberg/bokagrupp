
export function getCoursesSchema() {
  return new SimpleSchema({
    shortName: {
      type: String,
      label: "Kort namn",
      unique: true
    },
    name: {
      type: String,
      label: "Fullständigt namn"
    },
    startDate: {
      type: Date,
      label: "Startdatum"
    },
    homeUrl: {
      type: String,
      label: "Hemsida",
      optional: true
    },
    confirmation_email_sender: {
      type: String,
      regEx: SimpleSchema.RegEx.Email,
      label: "Epost avsändaradress",
      optional: true
    },
    confirmation_email_subject: {
      type: String,
      label: "Epost subjectrad",
      optional: true
    },
    paymentInstructions: {
      type: String,
      label: "Betalinfo",
      autoform: {
        afFieldInput: {
          type: 'tinyMCE',
          data: {
            /**
             *   tinyMCE initialization options
             *   "skin_url" is not customizable for now*
             *   See https://www.tinymce.com/docs/configure/editor-appearance/
             */
            height: 300,
            statusbar: false,
            menubar: false
          }
        }
      }
    }
  })
}