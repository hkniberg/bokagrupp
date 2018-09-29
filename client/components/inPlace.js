import {Courses, Levels, Slots, Bookings} from "../../lib/collection"
import {getBookingsSchemaForAdmin} from "../../lib/schemas/bookingsSchemaForAdmin";
import {getSlotsSchema} from "../../lib/schemas/slotsSchema";
import {getLevelsSchema} from "../../lib/schemas/levelsSchema";
import {getCoursesSchema} from "../../lib/schemas/coursesSchema";

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

  isDate() {
    return Template.currentData().type == "date"
  },

  schema() {
    const data = Template.currentData()
    const collection = data.collection
    if (collection == Courses) {
      return getCoursesSchema()
    } else if (collection == Levels) {
      return getLevelsSchema()
    } else if (collection == Slots) {
      return getSlotsSchema()
    } else if (collection == Bookings) {
      return getBookingsSchemaForAdmin()
    } else {
      throw new Error("Invalid collection for inPlace: " + collection)
    }
  },

  methodName() {
    const data = Template.currentData()
    const collection = data.collection
    if (collection == Courses) {
      return "updateCourseWithoutValidation"
    } else if (collection == Levels) {
        return "updateLevelWithoutValidation"
    } else if (collection == Slots) {
      return "updateSlotWithoutValidation"
    } else if (collection == Bookings) {
      return "updateBookingWithoutValidation"
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