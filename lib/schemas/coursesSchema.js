import {generateRandomId} from "../util";
let courseSchema


export function getCoursesSchema() {
  courseSchema = new SimpleSchema({
    orgId: {
      type: String
    },

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
    bookingOpenDate: {
      type: Date,
      label: "Bokningssidan öppnar",
      optional: true
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
    logoFile: {
      type: String,
      label: "Logga (visas längst upp på bokningssidan)",
      optional: true,
      autoform: {
        afFieldInput: {
          type: 'fileUpload',
          collection: 'uploads'
        }
      }
    },
    attendanceKey: {
      type: String,
      autoValue: function () {
        if (this.isInsert) {
          return generateRandomId(8)
        } else {
          this.unset();  // Prevent user from supplying their own value
        }
      }
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