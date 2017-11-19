import {Courses} from "../../lib/collection"
import {assertAdmin} from "../accounts";

Meteor.methods({
  addCourse(course) {
    Courses.insert(course)
  },
  
  updateCourse(modifier, _id) {
    assertAdmin(this.userId)
    Courses.update({_id: _id}, modifier)
  }
})