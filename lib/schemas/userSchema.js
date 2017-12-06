
export function getUserSchema() {
  return new SimpleSchema({
    orgId: {
      type: String,
      optional: true
    },
    email: {
      type: String,
      regEx: SimpleSchema.RegEx.Email,
      label: "Epost"
    },
    password: {
      type: String,
      label: "Lösenord"
    },
    role: {
      type: String,
      label: "Får administrera",
      optional: true,
      autoform: {
        options: function() {
          return [
            {label: "Allt", value: "superUser"},
            {label: "Kurser", value: "courseAdmin"}
          ]
        }
      }
      
    }
  })
}