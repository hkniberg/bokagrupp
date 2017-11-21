export const Courses = new Meteor.Collection("courses")
export const Levels = new Meteor.Collection("levels")
export const Slots = new Meteor.Collection("slots")
export const Bookings = new Meteor.Collection("bookings")

Courses.helpers({
  hasStarted() {
    if (this.startDate.getTime() < new Date().getTime()) {
      return true
    } else {
      return false
    }
  },

  isFull() {
    return this.bookingCount() >= this.bookingLimit()
  },

  canBook() {
    return !this.hasStarted()
  },

  bookingCount() {
    let count = 0
    const slots = Slots.find({courseId: this._id})
    slots.forEach((slot) => {
      count = count + slot.bookingCount
    })
    return count
  },

  bookingLimit() {
    let limit = 0
    const slots = Slots.find({courseId: this._id})
    slots.forEach((slot) => {
      limit = limit + slot.limit
    })
    return limit
  },

  registrationUrl() {
    return Meteor.absoluteUrl("courses/" + this.shortName)
  },

  slots() {
    return Slots.find({courseId: this._id})
  }
})

Levels.helpers({
  prerequisiteDescription() {
    if (this.prerequisite) {
      return this.prerequisite
    } else {
      return "Inga"
    }
  },

  course() {
    return Courses.findOne({_id: this.courseId})
  },

  bookingCount() {
    let count = 0
    const slots = Slots.find({bookingId: this._id})
    slots.forEach((slot) => {
      count = count + slot.bookingCount
    })
    return count

  }
})

Slots.helpers({
  name() {
    return this.levelName() + " " + this.datePeriod + " " + this.time
  },

  levelName() {
    const level = Levels.findOne({_id: this.levelId})
    if (level) {
      return level.name
    } else {
      return ""
    }
  },

  level() {
    return Levels.findOne({_id: this.levelId})
  },

  course() {
    return this.level().course()
  },

  isFull() {
    return this.bookingCount >= this.limit
  },

  isBookable() {
    if (this.isFull()) {
      return false
    }
    if (this.course().hasStarted()) {
      return false
    }
    return true
  },

  bookings() {
    return Bookings.find({slotId: this._id})
  },

  availableSpace() {
    const available = this.limit - this.bookingCount
    if (available < 0) {
      return 0
    } else {
      return available
    }
  }

})

Bookings.helpers({
  childFullName() {
    return this.childFirstName + " " + this.childLastName
  },

  slot() {
    return Slots.findOne({_id: this.slotId})
  },

  level() {
    return this.slot().level()
  },

  course() {
    return this.level().course()
  }
})