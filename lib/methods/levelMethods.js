import {Levels} from "../../lib/collection"
import {assertAdmin} from "../accounts";

Meteor.methods({
  addLevel(level) {
    Levels.insert(level)
  },
  
  updateLevel(modifier, _id) {
    assertAdmin(this.userId)
    Levels.update({_id: _id}, modifier)
  }
})