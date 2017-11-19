import {Levels} from "../../../lib/collection"

Template.levels.helpers({
  levels() {
    const course = Template.currentData()
    return Levels.find({courseId: course._id})
  }
})