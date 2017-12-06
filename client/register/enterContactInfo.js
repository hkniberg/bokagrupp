import {getPublicRouteToCourse} from "../../lib/router";
import {getCurrentCourse} from "../bookingSession";
//TODO "Tyvärr hann din grupp precis bli fullbokad",

AutoForm.addHooks(['enterContactInfoForm'], {
  onSuccess: function(formType, bookingId) {
    const course = getCurrentCourse()
    Router.go(getPublicRouteToCourse(course) + "/bookingComplete/" + bookingId)
  }
})
