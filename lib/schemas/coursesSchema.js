let courseSchema


export function getCoursesSchema() {
  courseSchema = new SimpleSchema({
    shortName: {
      type: String,
      label: "Kort namn",
      unique: true,
      custom: function() {
        const shortName = this.value.trim()
        //Ensure that there is no course with that shortname
        if (Meteor.isClient && this.isSet) {
          Meteor.call("isDuplicateCourseShortName", shortName, function (error, result) {
            if (result) {
              courseSchema.namedContext("addCourseForm").addInvalidKeys([{name: "shortName", type: "notUnique"}]);
            }
          });
        }
      }
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
    confirmationEmailSender: {
      type: String,
      regEx: SimpleSchema.RegEx.Email,
      label: "Epost avsändaradress"
    },
    confirmationEmailSubject: {
      type: String,
      label: "Epost subjectrad"
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
  return courseSchema
}