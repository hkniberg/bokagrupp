import {Courses, Levels, Slots, Bookings} from "../../lib/collection"

let counter = 0

Template.inPlace.onRendered(function() {
  const data = Template.currentData()

  AutoForm.addHooks(['InPlaceForm for ' + data.doc._id], {
    onSuccess: function(formType, newId) {
      Session.set("inPlaceEditing", null)
    }
  })

})

Template.inPlace.helpers({
  collection() {
    const data = Template.currentData()
    return data.collection
  },

  methodName() {
    const data = Template.currentData()
    const collection = data.collection
    if (collection == Courses) {
      return "updateCourse"
    } else if (collection == Levels) {
        return "updateLevel"
    } else if (collection == Slots) {
      return "updateSlot"
    } else if (collection == Bookings) {
      return "updateBooking"
    } else {
      throw new Error("Invalid collection for inPlace: " + collection)
    }
  },

  formId() {
    const data = Template.currentData()
    return "InPlaceForm for " + data.doc._id
  },

  doc() {
    const data = Template.currentData()
    return data.doc
  },

  fieldValue() {
    const data = Template.currentData()
    return data.doc[data.field]
  },

  editing() {
    const data = Template.currentData()
    return Session.get("inPlaceEditing") == data.doc._id + " " + data.field
  }


})

Template.inPlace.events({
  "click .inPlaceField"(event) {
    const data = Template.currentData()
    Session.set("inPlaceEditing", data.doc._id + " " + data.field)
  }
})