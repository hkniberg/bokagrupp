
export function getSlotsSchema() {
  return new SimpleSchema({
    courseId: {
      type: String,
      label: "Kurs"
    },
    levelId: {
      type: String,
      label: "Nivå"
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
    bookingCount: {
      type: Number,
      label: "Antal bokningar",
      defaultValue: 0
    }
 })
}