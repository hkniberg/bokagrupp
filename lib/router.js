import {Courses, Levels, Slots, Bookings} from "./collection"

Router.configure({
  layoutTemplate: 'layout',
  yieldTemplates: {
    navigation: {to: 'nav'}
  }
});

//======== PUBLIC ROUTES ================

Router.route('/', {
  name: 'selectCourse',
  waitOn: function() {
    return Meteor.subscribe('courses')
  }
})


Router.route('/courses/:shortName', {
  name: 'selectSlot',
  waitOn: function() {
    return [
      Meteor.subscribe('course', this.params.shortName),
      Meteor.subscribe('levelsForCourse', this.params.shortName),
      Meteor.subscribe('slotsForCourse', this.params.shortName)
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

Router.route('/admin/bookings/:shortName', {
  name: 'bookingsForCourse',
  layoutTemplate: 'adminLayout',
  waitOn: function() {
    return Meteor.subscribe('bookingsForCourse', this.params.shortName)
  },
  data: function () {
    return Courses.findOne({shortName: this.params.shortName});
  }
})

Router.route('/admin/addBookingForCourse/:shortName', {
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



// Routes that don't require you to be logged in
const unprotectedRoutes = [
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
