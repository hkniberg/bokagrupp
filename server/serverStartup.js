import {attachSchemas} from "../lib/schemas/schemas";
import {initDb} from "./initDb";

if (process.env.MAIL_URL) {
  console.log("Will use MAIL_URL " + process.env.MAIL_URL)
} else {
  console.log("Warning: MAIL_URL isn't set, so I can't send booking confirmation emails.")
}


Meteor.startup(() => {
  Migrations.migrateTo('latest')
  attachSchemas()
  initDb()
});


