
export function getLevelsSchema() {
  return new SimpleSchema({
    name: {
      type: String,
      label: "Namn"
    },
    sortKey: {
      type: Number,
      optional: true,
      defaultValue: 0,
      label: "Sortering"
    },
    prerequisite: {
      type: String,
      optional: true,
      label: "Förkunskapskrav"
    },
    description: {
      type: String,
      optional: true
    },
    minAge: {
      type: Number,
      label: "Minimiålder"
    },
    maxAge: {
      type: Number,
      label: "Maxålder"
    },
    courseId: {
      type: String
    }
  })
}