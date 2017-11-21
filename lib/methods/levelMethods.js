import {Levels, Slots} from "../../lib/collection"
import {assertAdmin} from "../accounts";
import {removeSlot} from "./slotMethods";
import {getBookingsForLevel} from "./bookingMethods";

Meteor.methods({
  addLevel(level) {
    assertAdmin(this.userId)
    console.assert(level, "level missing")
    console.assert(level.courseId, "level.courseId missing")

    const levelId = Levels.insert(level)
    copySortKeyToEachSlot(level)
    return levelId
  },
  
  updateLevel(modifier, _id) {
    assertAdmin(this.userId)
    Levels.update({_id: _id}, modifier)
    copySortKeyToEachSlot(getLevel(_id))
  },

  removeLevel(_id) {
    assertAdmin(this.userId)
    removeLevel(_id)
  }
})

export function copySortKeyToEachSlot(level) {
  Slots.update({levelId: level._id}, {$set: {levelSortKey: level.sortKey}}, {multi: true})
}

export function getLevel(levelId) {
  const level = Levels.findOne({_id: levelId})
  if (!level) {
    throw new Error("Hey, there is no level #" + levelId)
  }
  return level
}


export function getLevelsForCourse(courseId) {
  return Levels.find({courseId: courseId}, {sort: [['sortKey', 'asc'], ['name', 'asc']]})
}

export function removeLevel(levelId) {
  if (getBookingsForLevel(levelId).count() > 0) {
    throw new Meteor.Error("Can't remove this level, it has bookings!")
  }
  
  const slots = Slots.find({levelId: levelId})
  slots.forEach((slot) => {
    removeSlot(slot._id)
  })
  Levels.remove({_id: levelId})


}