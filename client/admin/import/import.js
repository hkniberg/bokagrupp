import {showError} from "../../helpers";
import {clearError} from "../../helpers";
import {Orgs} from "../../../lib/collection"

const resultVar = new ReactiveVar()
const importingVar = new ReactiveVar(false)

Template.import.onRendered(function() {
  clearError("import")
  Meteor.subscribe("orgs")
})

Template.import.helpers({
  result() {
    return resultVar.get()
  },

  importing() {
    return importingVar.get()
  },

  orgs() {
    return Orgs.find()
  }
})

Template.import.events({
  "click .importButton"() {
    const orgId = $(".importToOrgSelect").val()
    if (!orgId) {
      showError("Du mäste välja en organisation", "import")
      return
    }
    
    clearError("import")
    importingVar.set(true)
    resultVar.set(null)
    //const uri = $("#pgUri").val()
    console.log("Importing to org " + orgId + "...")
    Meteor.call("importData", orgId, (err, result) => {
      importingVar.set(false)
      if (err) {
        showError(err, "import")
        return
      }
      console.log("Success! Result: ", result)
      resultVar.set(result)
    })
  }

})