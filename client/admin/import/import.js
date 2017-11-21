import {showError} from "../../helpers";
import {clearError} from "../../helpers";
const resultVar = new ReactiveVar()
const importingVar = new ReactiveVar(false)

Template.import.onRendered(function() {
  clearError("import")
})

Template.import.helpers({
  result() {
    return resultVar.get()
  },

  importing() {
    return importingVar.get()
  }
})

Template.import.events({
  "click .importButton"() {
    clearError("import")
    importingVar.set(true)
    resultVar.set(null)
    //const uri = $("#pgUri").val()
    console.log("Importing...")
    Meteor.call("importData", null, (err, result) => {
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