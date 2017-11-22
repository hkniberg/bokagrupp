import {Courses, Levels, Slots, Bookings} from "../collection"
import {getCoursesSchema} from "./coursesSchema";
import {getLevelsSchema} from "./levelsSchema";
import {getSlotsSchema} from "./slotsSchema";
import {getBookingsSchema} from "./bookingsSchema";

//SimpleSchema.extendOptions(['autoform']);

export let bookingsSchema

export function attachSchemas() {
  Courses.attachSchema(getCoursesSchema())
  Levels.attachSchema(getLevelsSchema())
  Slots.attachSchema(getSlotsSchema())
  Bookings.attachSchema(getBookingsSchema())

}