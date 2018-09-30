import {Courses} from "../../../lib/collection"
import {getCourse} from "../../../lib/methods/courseMethods";
import {showError} from "../../helpers";
import {clearError} from "../../helpers";
import {getCourseWithShortName} from "../../../lib/methods/courseMethods";

const selectedCourseIdVar = new ReactiveVar()
const cloningVar = new ReactiveVar(false)

Template.addCourse.onRendered(function() {
  clearError("addCourse")
  cloningVar.set(false)
})

Template.addCourse.helpers({
  courses() {
    return Courses.find({}, {sort: {name: 1}})
  },

  selectedCourse() {
    const courseId = selectedCourseIdVar.get()
    if (courseId) {
      return getCourse(courseId)
    }
  },

  isCloning() {
    return cloningVar.get()
  }
})

Template.addCourse.events({
  "change .courseSelect"() {
    const courseId = $(".courseSelect").val()
    selectedCourseIdVar.set(courseId)
  },

  "click .emptyButton"() {
    const org = Template.currentData()
    Router.go("/admin/org/" + org.shortName + "/addEmptyCourse")
  },

  "click .cloneButton"() {
    const org = Template.currentData()
    const newShortName = $(".shortNameField").val()
    if (!newShortName) {
      showError("Kursen behöver ett kortnamn", "addCourse")
      return
    }

    const existingCourse = getCourseWithShortName(newShortName, false)
    console.log("shortName", newShortName)
    console.log("existingCourse", existingCourse)
    if (existingCourse) {
      showError("Kortnamnet '" + newShortName + "' används redan. Skriv något unikt.", "addCourse")
      return
    }

    const courseId = $(".courseSelect").val()

    clearError("addCourse")

    cloningVar.set(true)
    Meteor.call("cloneCourse", courseId, newShortName, function(err) {
      cloningVar.set(false)
      if (err) {
        showError(err, "addCourse")
      } else {
        Router.go("/admin/org/" + org.shortName + "/editClonedCourse/" + newShortName)
      }
    })

  }
})