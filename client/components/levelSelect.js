import {getLevel} from "../../lib/methods/levelMethods";
Template.levelSelect.events({
  "change .levelSelect"() {
    const levelSelect = $(".levelSelect")
    const levelId = levelSelect.val()
    Session.set("selectedLevelId", levelId)
  }
})

Template.levelSelect.helpers({
  selected() {
    const level = Template.currentData()
    const selectedLevelId = getSelectedLevelId()
    if (selectedLevelId && level && level._id == selectedLevelId) {
      return "selected"
    }
  }
})

export function getSelectedLevel() {
  const levelId = getSelectedLevelId()
  if (levelId) {
    return getLevel(levelId)
  } else {
    return null
  }
}


export function getSelectedLevelId() {
  return Session.get("selectedLevelId")
}
//

