import {Courses} from "./collection"

Router.configure({
  layoutTemplate: 'layout',
  yieldTemplates: {
    navigation: {to: 'nav'}
  }
});

Router.route('/', {
  name: 'courseList',
  waitOn: function() {
    return Meteor.subscribe('courses')
  }
})

Router.route('/admin', {
  name: 'admin'
})

Router.route('/admin/users', {
  name: 'users',
  waitOn: function() {
    return Meteor.subscribe('users')
  }
})

Router.route('/admin/users/:email', {
  name: 'editUser',
  waitOn: function() {
    return Meteor.subscribe('user', this.params.email)
  },
  data: function () {
    return Meteor.users.findOne({"emails.0.address": this.params.email});
  }
})


Router.route('/admin/courses', {
  name: 'courses',
  waitOn: function() {
    return Meteor.subscribe('courses')
  }
})

Router.route('/admin/addCourse', {
  name: 'addCourse'
})

Router.route('/admin/editCourse/:shortName', {
  name: 'editCourse',
  waitOn: function() {
    return Meteor.subscribe('course', this.params.shortName)
  },
  data: function () {
    return Courses.findOne({shortName: this.params.shortName});
  }
})

Router.route('/admin/course/:shortName', {
  name: 'viewCourse',
  waitOn: function() {
    return Meteor.subscribe('course', this.params.shortName)
  },
  data: function () {
    return Courses.findOne({shortName: this.params.shortName});
  }
})

Router.route('/admin/course/:shortName/levels', {
  name: 'levels',
  waitOn: function() {
    return Meteor.subscribe('levels', this.params.shortName)
  },
  data: function () {
    return Courses.findOne({shortName: this.params.shortName});
  }
})


// Routes that don't require you to be logged in
const unprotectedRoutes = [
  'courseList',
  'atChangePwd',
  'atEnrollAccount',
  'atForgotPwd',
  'atResetPwd',
  'atChangePwd',
  'atSignIn',
  'atSignUp',
  'myMeterWithDirectLogin',
  'dashboard1'
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