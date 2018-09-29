import {Orgs, Courses, Levels, Slots, Bookings} from "../collection"
import {getOrgsSchema} from "./orgsSchema";
import {getCoursesSchema} from "./coursesSchema";
import {getLevelsSchema} from "./levelsSchema";
import {getSlotsSchema} from "./slotsSchema";
import {getBookingsSchema} from "./bookingsSchema";

//SimpleSchema.extendOptions(['autoform']);

export let bookingsSchema



export function attachSchemas() {
  Orgs.attachSchema(getOrgsSchema())
  Courses.attachSchema(getCoursesSchema())
  Levels.attachSchema(getLevelsSchema())
  Slots.attachSchema(getSlotsSchema())
  Bookings.attachSchema(getBookingsSchema())

  Meteor.setTimeout(function() {
    SimpleSchema.messages({
      "required": "Vi vill gärna veta [label]",
      "notUnique": "[label] måste vara unikt",
      "invalidPersonNumber": "Ogiltigt personnummer",
      "tooYoung": "Barnet är för ung för denna grupp",
      "tooOld": "Barnet är för gammal för denna grupp",
      "duplicatePersonNumber": "Det finns redan en bokning med detta personnummer",
      "duplicateMembershipNumber": "Det finns redan en bokning med detta medlemsnummer"
    })
  }, 100)

}