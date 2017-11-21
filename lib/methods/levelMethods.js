import {Levels, Slots} from "../../lib/collection"
import {assertAdmin} from "../accounts";
import {removeSlot} from "./slotMethods";

Meteor.methods({
  addLevel(level) {
    assertAdmin(this.userId)
    return Levels.insert(level)
  },
  
  updateLevel(modifier, _id) {
    assertAdmin(this.userId)
    Levels.update({_id: _id}, modifier)
  },

  removeLevel(_id) {
    assertAdmin(this.userId)
    removeLevel(_id)
  }
})

export function getLevelsForCourse(courseId) {
  return Levels.find({courseId: courseId}, {sort: {name: 1}})
}

export function removeLevel(levelId) {
  const slots = Slots.find({levelId: levelId})
  slots.forEach((slot) => {
    removeSlot(slot._id)
  })
  Levels.remove({_id: levelId})


}