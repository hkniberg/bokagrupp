
export function getSlotsSchema() {
  return new SimpleSchema({
    levelId: {
      type: String,
      label: "Nivå"
    },
    courseId: {
      type: String,
      label: "Kurs",
      optional: true
    },
    orgId: {
      type: String,
      optional: true
    },
    datePeriod: {
      type: String,
      label: "Datumperiod"
    },
    time: {
      type: String,
      label: "Tid"
    },
    limit: {
      type: Number,
      label: "Antal platser"
    },
    levelSortKey: {
      type: Number,
      label: "Sortering",
      optional: true
    },
    bookingCount: {
      type: Number,
      label: "Antal bokningar",
      defaultValue: 0
    }
 })
}