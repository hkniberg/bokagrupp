
export function getCoursesSchema() {
  return new SimpleSchema({
    shortName: {
      type: String
    },
    name: {
      type: String
    },
    startDate: {
      type: Date
    },
    paymentInstructions: {
      type: String,
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