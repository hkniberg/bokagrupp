
export function getAttendanceSchema() {
  return new SimpleSchema({
    date: {
      type: Date
    },
    bookingId: {
      type: String
    },
    slotId: {
      type: String
    },
    levelId: {
      type: String
    },
    courseId: {
      type: String
    },
    attended: {
      type: Boolean,
      label: "Närvaro",
      defaultValue: false
    },
    comment: {
      type: String,
      optional: true
    }
  })
}