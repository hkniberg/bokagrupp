
export function getLevelsSchema() {
  return new SimpleSchema({
    name: {
      type: String
    },
    sortKey: {
      type: Number
    },
    prerequisite: {
      type: String
    },
    description: {
      type: String,
      optional: true
    },
    minAge: {
      type: Number
    },
    maxAge: {
      type: Number
    },
    courseId: {
      type: String
    }
  })
}