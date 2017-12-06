let orgSchema


export function getOrgsSchema() {
  orgSchema = new SimpleSchema({
    shortName: {
      type: String,
      label: "Kort namn",
      unique: true,
      custom: function() {
        const shortName = this.value.trim()
        //Ensure that there is no org with that shortname
        if (Meteor.isClient && this.isSet) {
          Meteor.call("isDuplicateOrgShortName", shortName, function (error, result) {
            if (result) {
              orgSchema.namedContext("addOrgForm").addInvalidKeys([{name: "shortName", type: "notUnique"}]);
            }
          });
        }
      }
    },
    name: {
      type: String,
      label: "Namn"
    }
  })
  return orgSchema
}