import {skischoolInfoUrl} from "./../lib/config";

Template.startPage.events({
  "click .skischoolInfoButton"() {
    window.open(skischoolInfoUrl)
  }
})