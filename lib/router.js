import {Courses, Levels, Slots, Bookings} from "./collection"
import {getCourseWithShortName} from "./methods/courseMethods";
import {getBookingsForCourse} from "./methods/bookingMethods";
import {getLevel} from "./methods/levelMethods";
import {getSlot} from "./methods/slotMethods";
import {formatDateTime} from "./util";
import {getSlotsForCourseAndDatePeriod} from "./methods/slotMethods";
import {getBookingsForCourseAndDatePeriod} from "./methods/bookingMethods";
import {getBooking} from "./methods/bookingMethods";
import {getCourse} from "./methods/courseMethods";

Router.configure({
  layoutTemplate: 'layout',
  yieldTemplates: {
    navigation: {to: 'nav'}
  }
});

//======== PUBLIC ROUTES ================

Router.route('/', {
  name: 'startPage'
})


Router.route('/courses/:shortName', {
  name: 'selectSlot',
  waitOn: function() {
    return [
      Meteor.subscribe('course', this.params.shortName),
      Meteor.subscribe('levelsForCourse', this.params.shortName),
      Meteor.subscribe('slotsForCourse', this.params.shortName),
      Meteor.subscribe('bookingsForCourse', this.params.shortName)
    ]
  },
  data: function () {
    return Courses.findOne({shortName: this.params.shortName});
  }
})

Router.route('/enterMembershipNumber', {
  name: 'enterMembershipNumber',
  waitOn: function() {
    const selectedSlotId = Session.get("selectedSlotId")
    console.assert(selectedSlotId, "No selectedSlotId")
    return [
      Meteor.subscribe('slot', selectedSlotId)
    ]
  },
  data: function () {
    const selectedSlotId = Session.get("selectedSlotId")
    return Slots.findOne({_id: selectedSlotId});
  }
})

Router.route('/enterContactInfo', {
  name: 'enterContactInfo',
  waitOn: function() {
    const selectedSlotId = Session.get("selectedSlotId")
    console.assert(selectedSlotId, "No selectedSlotId")
    return [
      Meteor.subscribe('slot', selectedSlotId)
    ]
  },
  data: function () {
    const selectedSlotId = Session.get("selectedSlotId")
    return Slots.findOne({_id: selectedSlotId});
  }
})

Router.route('/bookingComplete/:bookingId', {
  name: 'bookingComplete',
  waitOn: function() {
    return [
      Meteor.subscribe('booking', this.params.bookingId)
    ]
  },
  data: function () {
    return Bookings.findOne({_id: this.params.bookingId});
  }
})

//======== ADMIN ROUTES =================

Router.route('/admin', {
  name: 'admin',
  before: function() {
    this.redirect('/admin/courses')
  }
})

Router.route('/admin/import', {
  name: 'import',
  layoutTemplate: 'adminLayout'
})


Router.route('/admin/users', {
  name: 'users',
  layoutTemplate: 'adminLayout',
  waitOn: function() {
    return Meteor.subscribe('users')
  }
})

Router.route('/admin/addUser', {
  name: 'addUser',
  layoutTemplate: 'adminLayout'
})


Router.route('/admin/users/:email', {
  name: 'editUser',
  layoutTemplate: 'adminLayout',
  waitOn: function() {
    return Meteor.subscribe('user', this.params.email)
  },
  data: function () {
    return Meteor.users.findOne({"emails.0.address": this.params.email});
  }
})


Router.route('/admin/courses', {
  name: 'courses',
  layoutTemplate: 'adminLayout',
  waitOn: function() {
    return Meteor.subscribe('courses')
  }
})

Router.route('/admin/addCourse', {
  name: 'addCourse',
  layoutTemplate: 'adminLayout',
  waitOn: function() {
    return Meteor.subscribe('courses')
  }
})

Router.route('/admin/editCourse/:shortName', {
  name: 'editCourse',
  layoutTemplate: 'adminLayout',
  waitOn: function() {
    return Meteor.subscribe('course', this.params.shortName)
  },
  data: function () {
    return Courses.findOne({shortName: this.params.shortName});
  }
})

Router.route('/admin/course/:shortName', {
  name: 'viewCourse',
  layoutTemplate: 'adminLayout',
  waitOn: function() {
    return [
      Meteor.subscribe('course', this.params.shortName),
      Meteor.subscribe('levelsForCourse', this.params.shortName),
      Meteor.subscribe('slotsForCourse', this.params.shortName),
      Meteor.subscribe('bookingsForCourse', this.params.shortName)
    ]
  },
  data: function () {
    return Courses.findOne({shortName: this.params.shortName});
  }
})

Router.route('/admin/course/:shortName/levels', {
  name: 'levels',
  layoutTemplate: 'adminLayout',
  waitOn: function() {
    return Meteor.subscribe('levelsForCourse', this.params.shortName)
  },
  data: function () {
    return Courses.findOne({shortName: this.params.shortName});
  }
})

Router.route('/admin/course/:shortName/slots', {
  name: 'slots',
  layoutTemplate: 'adminLayout',
  waitOn: function() {
    return [
      Meteor.subscribe('slotsForCourse', this.params.shortName),
      Meteor.subscribe('levelsForCourse', this.params.shortName)
    ]
  },
  data: function () {
    return Courses.findOne({shortName: this.params.shortName});
  }
})

Router.route('/admin/changeSlot/:bookingId', {
  name: 'changeSlot',
  layoutTemplate: 'adminLayout',
  waitOn: function() {
    return [
      Meteor.subscribe('booking', this.params.bookingId)
    ]
  },
  data: function () {
    return Bookings.findOne({_id: this.params.bookingId});
  }

})

Router.route('/admin/addBooking/:shortName', {
  name: 'addBookingForCourse',
  layoutTemplate: 'adminLayout',
  waitOn: function() {
    return [
      Meteor.subscribe('course', this.params.shortName),
      Meteor.subscribe('levelsForCourse', this.params.shortName),
      Meteor.subscribe('slotsForCourse', this.params.shortName),
      Meteor.subscribe('bookingsForCourse', this.params.shortName)
    ]
  },
  data: function () {
    return Courses.findOne({shortName: this.params.shortName});
  }

})

Router.route('/admin/unpaidBookings/:shortName', {
  name: 'unpaidBookingsForCourse',
  layoutTemplate: 'adminLayout',
  waitOn: function() {
    return [
      Meteor.subscribe('course', this.params.shortName),
      Meteor.subscribe('levelsForCourse', this.params.shortName),
      Meteor.subscribe('slotsForCourse', this.params.shortName),
      Meteor.subscribe('bookingsForCourse', this.params.shortName)
    ]
  },
  data: function () {
    return Courses.findOne({shortName: this.params.shortName});
  }

})

Router.route('/admin/printBookings/:shortName/:datePeriod', {
  name: 'printBookings',
  layoutTemplate: 'printLayout',
  waitOn: function() {
    return [
      Meteor.subscribe('bookingsForCourseAndDatePeriod', this.params.shortName, this.params.datePeriod)
    ]
  },
  data: function () {
    return {
      datePeriod: this.params.datePeriod,
      courseShortName: this.params.shortName
    }
  }
})


Router.route('/admin/export/:shortName', function() {
  const course = getCourseWithShortName(this.params.shortName)
  const bookings = getBookingsForCourse(course._id).fetch()
  //console.log("bookings", bookings)
  const fields = [
    {key: 'childFirstName', title: 'Förnamn'},
    {key: 'childLastName', title: 'Efternamn'},
    {key: 'childPersonNumber', title: 'Personnummer'},
    {key: 'childZip', title: 'Postnummer'},
    {key: 'childMembershipNumber', title: 'Medlemsnummer'},
    {key: 'parentPhone', title: 'Telefon'},
    {key: 'parentEmail', title: 'Epost'},
    {key: 'levelId', title: 'Nivå', transform: function(levelId, booking) {
      const level = getLevel(levelId)
      return level.name
    }},
    {key: 'slotId', title: 'Datumperiod', transform: function(slotId, booking) {
      const slot = getSlot(slotId)
      return slot.datePeriod
    }},
    {key: 'slotId', title: 'Tid', transform: function(slotId, booking) {
      const slot = getSlot(slotId)
      return slot.time
    }},
    {key: 'creationTime', title: 'Registeringstid', transform: function(creationTime, booking) {
      if (creationTime) {
        return formatDateTime(creationTime)
      } else {
        return ""
      }
    }},
    {key: 'comment', title: 'Kommentar'}
  ]

  var title = 'bokningar';
  var file = Excel.export(title, fields, bookings);
  var headers = {
    'Content-type': 'application/vnd.openxmlformats',
    'Content-Disposition': 'attachment; filename=' + title + '.xlsx'
  };

  this.response.writeHead(200, headers);
  this.response.end(file, 'binary');
}, { where: 'server' });


// Routes that don't require you to be logged in
const unprotectedRoutes = [
  'startPage',
  'selectCourse',
  'selectSlot',
  'enterMembershipNumber',
  'enterContactInfo',
  'bookingComplete',
  'atChangePwd',
  'atEnrollAccount',
  'atForgotPwd',
  'atResetPwd',
  'atChangePwd',
  'atSignIn',
  'atSignUp'
]

Router.plugin('ensureSignedIn', {
  except: unprotectedRoutes
});


//Enable account management routes  https://github.com/meteor-useraccounts/iron-routing
AccountsTemplates.configureRoute('changePwd');
AccountsTemplates.configureRoute('enrollAccount');
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('resetPwd');
AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');
