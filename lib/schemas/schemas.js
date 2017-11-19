import {getCoursesSchema} from "./coursesSchema";
import {Courses, Levels} from "../collection"
import {getLevelsSchema} from "./levelsSchema";

//SimpleSchema.extendOptions(['autoform']);

export function attachSchemas() {
  Courses.attachSchema(getCoursesSchema())
  Levels.attachSchema(getLevelsSchema())
}