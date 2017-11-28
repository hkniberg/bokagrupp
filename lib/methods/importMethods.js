import {Courses, Levels, Slots, Bookings} from "../../lib/collection"
import {assertAdmin} from "../accounts";
Meteor.methods({
  importData(pgUri) {
    if (Meteor.isServer) {
      //console.assert(pgUri, "pgUri not given!")
      assertAdmin(this.userId)
      return importData(pgUri)
    }
  }
})


/*
Returns something like this:

{
  courses: {
    vinter2017: {
      pgId: ...
      mongoId: ...
      imported: true,
      levels: {
        nybörjare: {
          pgId: ...
          mongoId: ...
          courseShortName: vinter2017
          imported: true,
          slots: {
            "lörsön 11:00":
              pgId: ...
              mongoId: ...
              courseShortName: ...
              levelName: ...
              imported: true,
              bookings: {
                "Tom Nilsson 7302717-0029": {
                  pgId: ...
                  mongoId: ...
                  courseShortName: ...
                  levelName: ...
                  slotName: ...
                  name: Tom Nilsson
                  imported: true
              }
            }
          ]
        }
      ]
    }
  ]
}



*/
function importData(pgUri) {
  console.log("Importing")
  const pgp = require('pg-promise')()

  const cn = {
    host: process.env.importHost,
    port: process.env.importPort,
    database: process.env.importDatabase,
    user: process.env.importUser,
    password: process.env.importPassword,
    ssl: true
  };
  console.log("cn", cn)

  const db = pgp(cn)
  const query = Meteor.wrapAsync(executeQuery)
  const reports = {
    courses: {},

    importedCourses: 0,
    ignoredCourses: 0,

    importedLevels: 0,
    ignoredLevels: 0,
    invalidLevels: 0,

    importedSlots: 0,
    ignoredSlots: 0,
    invalidSlots: 0,

    importedBookings: 0,
    ignoredBookings: 0,
    invalidBookings: 0
  }

  const courseIdMap = {}
  const levelIdMap = {}
  const slotIdMap = {}

  const courses = query(db, "SELECT * FROM courses")
  courses.forEach((pgCourse) => {
    pgCourse.short_name = pgCourse.short_name.trim()
    const courseReport = importCourse(pgCourse)
    courseIdMap[courseReport.pgId] = courseReport.mongoId
    reports.courses[pgCourse.short_name] = courseReport

    if (courseReport.imported) {
      reports.importedCourses += 1
    } else {
      reports.ignoredCourses += 1
    }
  })

  const levels = query(db, "SELECT * FROM levels")
  levels.forEach((pgLevel) => {
    pgLevel.name = pgLevel.name.trim()
    const levelReport = importLevel(courseIdMap, pgLevel)
    if (levelReport) {
      levelIdMap[levelReport.pgId] = levelReport.mongoId
      const courseReport = reports.courses[levelReport.courseShortName]
      //console.log("levelReport.courseShortName", levelReport.courseShortName)
      //console.log("courseReport", courseReport)
      //console.log("reports", reports)
      courseReport.levels[pgLevel.name] = levelReport

      if (levelReport.imported) {
        reports.importedLevels += 1
      } else {
        reports.ignoredLevels += 1
      }

    } else {
      reports.invalidLevels += 1
    }
  })

  const slots = query(db, "SELECT * FROM slots")
  slots.forEach((pgSlot) => {
    pgSlot.date_period = pgSlot.date_period.trim()
    pgSlot.time = pgSlot.time.trim()
    const slotReport = importSlot(levelIdMap, pgSlot)
    if (slotReport) {
      slotIdMap[slotReport.pgId] = slotReport.mongoId
      const courseReport = reports.courses[slotReport.courseShortName]
      const levelReport = courseReport.levels[slotReport.levelName]
      const slotName = pgSlot.date_period + " " + pgSlot.time
      levelReport.slots[slotName] = slotReport

      if (slotReport.imported) {
        reports.importedSlots += 1
      } else {
        reports.ignoredSlots += 1
      }

    } else {
      reports.invalidSlots += 1
    }
  })

  const bookings = query(db, "SELECT * FROM bookings")
  bookings.forEach((pgBooking) => {
    pgBooking.child_first_name = pgBooking.child_first_name.trim()
    pgBooking.child_last_name = pgBooking.child_last_name.trim()
    pgBooking.child_person_number = pgBooking.child_person_number.trim()
    const bookingReport = importBooking(slotIdMap, pgBooking)
    if (bookingReport) {
      const courseReport = reports.courses[bookingReport.courseShortName]
      const levelReport = courseReport.levels[bookingReport.levelName]
      const slotReport = levelReport.slots[bookingReport.slotName]
      const bookingName = pgBooking.child_first_name + " " + pgBooking.child_last_name + " " + pgBooking.child_person_number

      if (!slotReport) {
        console.log("Can't find slot " + bookingReport.slotName)
        console.log("---------------------")
        console.log("levelReport", levelReport)
        console.log("---------------------")
      }

      slotReport.bookings[bookingName] = bookingReport

      if (bookingReport.imported) {
        reports.importedBookings += 1
      } else {
        reports.ignoredBookings += 1
      }

    } else {
      reports.invalidBookings += 1
    }
  })

  console.log("Done!", "===================================", reports)
  return reports
}





function importCourse(pgCourse) {
  const courseReport = {
    pgId: pgCourse.id,
    levels: {}
  }

  log("Importing course " + pgCourse.short_name + "....")
  const existingCourse = Courses.findOne({shortName: pgCourse.short_name})
  if (existingCourse) {
    log("... skipping this course, already exists.")
    courseReport.mongoId = existingCourse._id
    courseReport.imported = false
  } else {
    const _id = Courses.insert({
      shortName: pgCourse.short_name,
      name: pgCourse.name,
      startDate: pgCourse.start_date,
      homeUrl: pgCourse.home_url,
      confirmationEmailSender: pgCourse.confirmation_email_sender,
      confirmationEmailSubject: pgCourse.confirmation_email_subject,
      paymentInstructions: pgCourse.payment_instructions
    }, {validate: false})
    log("... imported course!")
    courseReport.mongoId = _id
    courseReport.imported = true
  }
  console.log("courseReport:", courseReport)
  return courseReport
}

function importLevel(courseIdMap, pgLevel) {
  const levelReport = {
    pgId: pgLevel.id,
    slots: {}
  }

  log("Importing level: " + pgLevel.name + " for course " + pgLevel.course_id)

  const courseId = courseIdMap[pgLevel.course_id]
  if (!courseId) {
    log("  ... skipping this level, it is associated with pg course #" + pgLevel.course_id + " in postgres, which doesn't seem to exist.")
    return null
  }
  levelReport.courseShortName = getCourseName(courseId)

  const existingLevel = Levels.findOne({courseId: courseId, name: pgLevel.name})
  if (existingLevel) {
    log("  ... skipping this level, already exists")
    levelReport.imported = false
    levelReport.mongoId = existingLevel._id
  } else {
    const _id = Levels.insert({
      name: pgLevel.name,
      courseId: courseId,
      sortKey: pgLevel.sort_key,
      prerequisite: pgLevel.prerequisite,
      description: pgLevel.description,
      minAge: pgLevel.min_age,
      maxAge: pgLevel.max_age
    })
    levelReport.imported = true
    levelReport.mongoId = _id
    log("  ... imported level!")
  }
  console.log("levelReport:", levelReport)
  return levelReport
}

function importSlot(levelIdMap, pgSlot) {
  const slotReport = {
    pgId: pgSlot.id,
    bookings: {}
  }

  log("Importing slot. LevelId=" + pgSlot.level_id + ", datePeriod=" + pgSlot.date_period + ", time=" + pgSlot.time)

  const levelId = levelIdMap[pgSlot.level_id]
  if (!levelId) {
    log("  ... skipping this slot, it is associated with level #" + pgSlot.level_id + " in postgres, which doesn't seem to be connected to any existing course.")
    return null
  }
  const level = getLevel(levelId)
  slotReport.levelName = level.name
  slotReport.courseShortName = getCourseName(level.courseId)

  const existingSlot = Slots.findOne({levelId: levelId, datePeriod: pgSlot.date_period, time: pgSlot.time})
  if (existingSlot) {
    log("  ... skipping this slot, already exists")
    slotReport.imported = false
    slotReport.mongoId = existingSlot._id

  } else {
    const level = Levels.findOne({_id: levelId})

    const _id = Slots.insert({
      courseId: level.courseId,
      levelId: levelId,
      datePeriod: pgSlot.date_period,
      time: pgSlot.time,
      limit: pgSlot.limit,
      levelSortKey: level.sortKey,
      bookingCount: 0
    })
    slotReport.imported = true
    slotReport.mongoId = _id

    log("  ... imported slot!")
  }
  console.log("slotReport:", slotReport)

  return slotReport
}

function importBooking(slotIdMap, pgBooking) {
  const bookingReport = {
    pgId: pgBooking.id
  }

  log("Importing booking. SlotId = " + pgBooking.slot_id + ", child_first_name = " + pgBooking.child_first_name)

  if (!pgBooking.child_zip) {
    pgBooking.child_zip = "-"
  }
  if (!pgBooking.parent_email || pgBooking.parent_email.indexOf("@") == -1) {
    pgBooking.parent_email = "invalid@email.address"
  }
  if (pgBooking.parent_email.split('@').length > 2) {
    pgBooking.parent_email = "invalid@email.address"
  }
  if (!pgBooking.paid) {
    pgBooking.paid = false
  }

  const slotId = slotIdMap[pgBooking.slot_id]
  if (!slotId) {
    log("  ... skipping this booking, it is associated with slot #" + pgBooking.slot_id + " in postgres, which doesn't seem to be connected to any existing course.")
    return null
  }
  const slot = getSlot(slotId)
  bookingReport.slotName = slot.datePeriod + " " + slot.time

  const level = getLevel(slot.levelId)
  bookingReport.levelName = level.name
  bookingReport.courseShortName = getCourseName(level.courseId)

  const existingBooking = Bookings.findOne(
    {
      slotId: slotId,
      childPersonNumber: pgBooking.child_person_number,
      childFirstName: pgBooking.child_first_name,
      childLastName: pgBooking.child_last_name
    })
  if (existingBooking) {
    log("  ... skipping this booking, already exists")
    bookingReport.imported = false
    bookingReport.mongoId = existingBooking._id

  } else {
    const _id = Bookings.insert({
      courseId: level.courseId,
      levelId: level._id,
      slotId: slot._id,
      parentEmail: pgBooking.parent_email,
      parentPhone: pgBooking.parent_phone,
      childFirstName: pgBooking.child_first_name,
      childLastName: pgBooking.child_last_name,
      childPersonNumber: pgBooking.child_person_number,
      childZip: pgBooking.child_zip,
      childMembershipNumber: pgBooking.child_membership_number,
      paid: pgBooking.paid,
      creationTime: pgBooking.created_at,
      comment: pgBooking.comment
    }, {
      validate: false
    })
    bookingReport.imported = true
    bookingReport.mongoId = _id

    Slots.update({_id: slot._id}, {$inc: {bookingCount: 1}})

    log("  ... imported booking!")
  }
  console.log("bookingReport:", bookingReport)

  return bookingReport
}



function log(text) {
  console.log(text)
}

function getCourseName(courseId) {
  const course = Courses.findOne({_id: courseId})
  return course.shortName
}

function getLevel(levelId) {
  return Levels.findOne({_id: levelId})
}

function getSlot(slotId) {
  return Slots.findOne({_id: slotId})
}

function executeQuery(db, queryString, callback) {
  db.any(queryString, [true])
    .then(function(result) {
      callback(null, result)
    })
    .catch(function(error) {
      console.log("error", error)
      callback(error)
    })
}

