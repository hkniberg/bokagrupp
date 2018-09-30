import {Levels, Slots} from "../../lib/collection"
import {assertAdmin} from "../roles";
import {removeSlot} from "./slotMethods";
import {getBookingsForLevel} from "./bookingMethods";
import {getCourse} from "./courseMethods";
import {getSlotsForLevel} from "./slotMethods";
import {cloneSlot} from "./slotMethods";

Meteor.methods({
  addLevel(level) {
    console.assert(level, "level missing")

    const course = getCourse(level.courseId)
    assertAdmin(this.userId, course.orgId)

    level.orgId = course.orgId
    const levelId = Levels.insert(level)
    copySortKeyToEachSlot(level)
    return levelId
  },
  
  updateLevel(modifier, _id) {
    const level = getLevel(_id)
    assertAdmin(this.userId, level.orgId)
    return updateLevel(modifier, _id, true)
  },

  updateLevelWithoutValidation(modifier, _id) {
    const level = getLevel(_id)
    assertAdmin(this.userId, level.orgId)
    return updateLevel(modifier, _id, false)
  },

  removeLevel(levelId) {
    const level = getLevel(levelId)
    assertAdmin(this.userId, level.orgId)

    if (getBookingsForLevel(levelId).count() > 0) {
      throw new Meteor.Error("Hey, you can't remove a level that has bookings!")
    }
    removeLevel(levelId)
  }
})

function updateLevel(modifier, _id, validate) {
  console.assert(modifier, "modifier missing")
  console.assert(_id, "_id missing")

  Levels.update({_id: _id}, modifier, {validate: validate})
  copySortKeyToEachSlot(getLevel(_id))
  return _id


}

export function cloneLevel(level, toCourseId) {
  const oldLevelId = level._id
  delete level._id
  level.courseId = toCourseId
  const newLevelId = Levels.insert(level)

  console.log("Get slots for level", oldLevelId)
  const slots = getSlotsForLevel(oldLevelId)
  console.log("Found " + slots.length + " slots")
  slots.forEach((slot) => {
    cloneSlot(slot, newLevelId)
  })
}

export function copySortKeyToEachSlot(level) {
  Slots.update({levelId: level._id}, {$set: {levelSortKey: level.sortKey}}, {multi: true})
}

export function getLevel(levelId, validate=true) {
  const level = Levels.findOne({_id: levelId})
  if (validate) {
    console.assert(level, "Can't find a level with ID " + levelId)
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