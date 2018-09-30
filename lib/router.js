import {Orgs, Bookings} from "./collection"
import {isSuperUser} from "./roles";
import {getOrgWithShortName} from "./methods/orgMethods";
import {getCourseWithOrgAndShortName, getCourseWithShortName} from "./methods/courseMethods";
import {exportToExcel} from "./excelExport";

Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  yieldTemplates: {
    navigation: {to: 'nav'}
  }
});




//======== ADMIN ROUTES ===================================================

Router.route('/admin', {
  name: 'admin',
  waitOn: function () {
    return Meteor.subscribe('orgs')
  }
})

Router.route('/admin/import', {
  name: 'import',
  layoutTemplate: 'adminLayout'
})

Router.route('/attendance/:attendanceKey', {
  name: 'editAttendance',
  waitOn: function () {
    return Meteor.subscribe('attendance', this.params.attendanceKey)
  },
  data: function() {
    return this.params.attendanceKey
  }
})


// ========= Users ==============================================

Router.route('/admin/org/:orgShortName/users', {
  name: 'users',
  layoutTemplate: 'adminLayout',
  waitOn: function() {
    return Meteor.subscribe('usersForOrgName', this.params.orgShortName)
  },
  data: function() {
    return getOrgWithShortName(this.params.orgShortName, false)
  }
})

Router.route('/admin/superUsers', {
  name: 'superUsers',
  layoutTemplate: 'adminLayout',
  waitOn: function() {
    return Meteor.subscribe('superUsers')
  }
})

//======== Orgs =============================================


Router.route('/admin/orgs', {
  name: 'orgs',
  layoutTemplate: 'adminLayout',
  waitOn: function() {
    return Meteor.subscribe('orgs')
  }
})

Router.route('/admin/addOrg', {
  name: 'addOrg',
  layoutTemplate: 'adminLayout',
  waitOn: function() {
    return Meteor.subscribe('orgs')
  }
})

Router.route('/admin/editOrg/:orgShortName', {
  name: 'editOrg',
  layoutTemplate: 'adminLayout',
  waitOn: function() {
    return Meteor.subscribe('orgName', this.params.orgShortName)
  },
  data: function () {
    return Orgs.findOne({shortName: this.params.orgShortName});
  }
})

Router.route('/admin/org/:orgShortName', {
  name: 'viewOrg',
  layoutTemplate: 'adminLayout',
  before: function() {
    if (isSuperUser(Meteor.userId())) {
      this.next()
    } else {
      Router.go('/admin/org/' + this.params.orgShortName + '/courses')
    }
  },
  waitOn: function() {
    return Meteor.subscribe('orgName', this.params.orgShortName)
  },
  data: function () {
    return Orgs.findOne({shortName: this.params.orgShortName});
  }
})
export function getAdminRouteToOrg(org) {
  return `/admin/org/${org.shortName}`
}


//======== Courses =============================================


Router.route('/admin/org/:orgShortName/courses', {
  name: 'courses',
  layoutTemplate: 'adminLayout',
  waitOn: function() {
    return Meteor.subscribe('courses', this.params.orgShortName)
  },
  data: function() {
    return getOrgWithShortName(this.params.orgShortName, false)
  }
})

Router.route('/admin/org/:orgShortName/addCourse', {
  name: 'addCourse',
  layoutTemplate: 'adminLayout',
  waitOn: function() {
    return Meteor.subscribe('courses', this.params.orgShortName)
  },
  data: function() {
    return getOrgWithShortName(this.params.orgShortName, false)
  }
})

Router.route('/admin/org/:orgShortName/addEmptyCourse', {
  name: 'addEmptyCourse',
  layoutTemplate: 'adminLayout',
  waitOn: function() {
    return Meteor.subscribe('courses', this.params.orgShortName)
  },
  data: function() {
    return getOrgWithShortName(this.params.orgShortName, false)
  }
})

Router.route('/admin/org/:orgShortName/course/:courseShortName', {
  name: 'viewCourse',
  layoutTemplate: 'adminLayout',
  waitOn: subscribeToCourseAndBookingsForParams,
  data: getCourseForParams
})
export function getAdminRouteToCourse(course) {
  return `/admin/org/${course.org().shortName}/course/${course.shortName}`
}

Router.route('/admin/org/:orgShortName/editCourse/:courseShortName', {
  name: 'editCourse',
  layoutTemplate: 'adminLayout',
  waitOn: subscribeToCourseForParams,
  data: getCourseForParams
})

Router.route('/admin/org/:orgShortName/editClonedCourse/:courseShortName', {
  name: 'editClonedCourse',
  layoutTemplate: 'adminLayout',
  waitOn: subscribeToCourseForParams,
  data: getCourseForParams
})

//======== Levels =============================================

Router.route('/admin/org/:orgShortName/course/:courseShortName/levels', {
  name: 'levels',
  layoutTemplate: 'adminLayout',
  waitOn: subscribeToCourseAndBookingsForParams,
  data: getCourseForParams
})

//======== Slots =============================================


Router.route('/admin/org/:orgShortName/course/:courseShortName/slots', {
  name: 'slots',
  layoutTemplate: 'adminLayout',
  waitOn: subscribeToCourseAndBookingsForParams,
  data: getCourseForParams
})

//======= Bookings =========================================

Router.route('/admin/org/:orgShortName/course/:courseShortName/changeSlot/:bookingId', {
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

Router.route('/admin/org/:orgShortName/course/:courseShortName/addBooking', {
  name: 'addBookingForCourse',
  layoutTemplate: 'adminLayout',
  waitOn: subscribeToCourseAndBookingsForParams,
  data: getCourseForParams
})

Router.route('/admin/org/:orgShortName/course/:courseShortName/unpaidBookings', {
  name: 'unpaidBookingsForCourse',
  layoutTemplate: 'adminLayout',
  waitOn: subscribeToCourseAndBookingsForParams,
  data: getCourseForParams

})

Router.route('/admin/org/:orgShortName/course/:courseShortName/attendance', {
  name: 'attendance',
  layoutTemplate: 'adminLayout',
  waitOn: subscribeToCourseAndBookingsAndAttendanceForParams,
  data: getCourseForParams
})

Router.route('/admin/org/:orgShortName/course/:courseShortName/print/:datePeriod', {
  name: 'printBookings',
  layoutTemplate: 'printLayout',
  waitOn: subscribeToCourseAndBookingsForParams,
  data: function () {
    return {
      datePeriod: this.params.datePeriod,
      courseShortName: this.params.courseShortName
    }
  }
})




//====== Export ==========================================

Router.route('/admin/org/:orgShortName/course/:courseShortName/export', function() {
  const course = getCourseForParams(this.params)
  const file = exportToExcel(course)


  var title = 'bokningar'
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
  'atSignUp',
  'editAttendance'
]

AccountsTemplates.configure({
  defaultLayout: 'layout'
});

// Options: https://github.com/meteor-useraccounts/core/blob/master/Guide.md#basic-customization
AccountsTemplates.configure({
  enablePasswordChange: true,
  showForgotPasswordLink: true,
  overrideLoginErrors: false
});

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


//======== PUBLIC ROUTES ===========================================================

Router.route('/', {
  name: 'startPage',
  layoutTemplate: 'startPageLayout'
})


//Legacy redirect
Router.route('/courses/:courseShortName', {
  waitOn: function() {
    return Meteor.subscribe('allCourseNames')
  },
  before: function() {
    const course = getCourseWithShortName(this.params.courseShortName, false)
    if (course) {
      const org = course.org()
      Router.go("/" + org.shortName + "/" + course.shortName)
    } else {
      this.render('noSuchCourse')
    }
  }
})

Router.route('/:orgShortName/:courseShortName', {
  name: 'selectSlot',
  waitOn: subscribeToCourseForParams,
  data: getCourseForParams
})

export function getPublicRouteToCourse(course) {
  return `/${course.org().shortName}/${course.shortName}`
}

Router.route('/:orgShortName/:courseShortName/enterMembershipNumber', {
  name: 'enterMembershipNumber',
  before: redirectIfWeDontHaveCurrentBooking,
  waitOn: subscribeToCurrentSlot
})

Router.route('/:orgShortName/:courseShortName/enterContactInfo', {
  name: 'enterContactInfo',
  before: redirectIfWeDontHaveCurrentBooking,
  waitOn: subscribeToCurrentSlot
})

Router.route('/:orgShortName/:courseShortName/bookingComplete/:bookingId', {
  name: 'bookingComplete',
  before: function() {
    Session.set("currentBooking", null)
    return this.next()
  },
  waitOn: function() {
    return Meteor.subscribe('booking', this.params.bookingId)
  },
  data: function () {
    return Bookings.findOne({_id: this.params.bookingId});
  }
})



function subscribeToCourseForParams(params=this.params) {
  console.assert(params.orgShortName, "Missing params.orgShortName")
  console.assert(params.courseShortName, "Missing params.courseShortName")

  return Meteor.subscribe('courseName', params.orgShortName, params.courseShortName, false)
}

function subscribeToCourseAndBookingsForParams(params=this.params) {
  console.assert(params.orgShortName, "Missing params.orgShortName")
  console.assert(params.courseShortName, "Missing params.courseShortName")

  return Meteor.subscribe('courseName', params.orgShortName, params.courseShortName, true)
}

function subscribeToCourseAndBookingsAndAttendanceForParams(params=this.params) {
  console.assert(params.orgShortName, "Missing params.orgShortName")
  console.assert(params.courseShortName, "Missing params.courseShortName")

  return Meteor.subscribe('courseName', params.orgShortName, params.courseShortName, true, true)
}

function getCourseForParams(params=this.params) {
  console.assert(params.orgShortName, "Missing params.orgShortName")
  console.assert(params.courseShortName, "Missing params.courseShortName")
  return getCourseWithOrgAndShortName(params.orgShortName, params.courseShortName, false)
}

function subscribeToCurrentSlot() {
  const currentBooking = Session.get("currentBooking")
  if (currentBooking) {
    const slotId = currentBooking.slotId
    if (slotId) {
      return Meteor.subscribe('slot', slotId)
    }
  }
}

function redirectIfWeDontHaveCurrentBooking() {
  if (Session.get("currentBooking")) {
    this.next()
  } else {
    Router.go(`/${this.params.orgShortName}/${this.params.courseShortName}`)
  }
}




