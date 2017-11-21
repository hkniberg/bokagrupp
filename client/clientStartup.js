import {attachSchemas} from "../lib/schemas/schemas";

Meteor.startup(function() {
  attachSchemas()
  TAPi18n.setLanguage('sv')
})
