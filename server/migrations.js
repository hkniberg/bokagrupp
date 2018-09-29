import {Bookings} from "../lib/collection"
import {PersonNumber} from "../lib/personNumber" 

Migrations.add({
  version: 1,
  up() {
    console.log("migrated to v1")
  }
})

Migrations.add({
  version: 2,
  up() {
    console.log("Converting personNumber to birthDate and gender...")
    const bookings = Bookings.find() 
    bookings.forEach((booking) => {
      if (booking.childPersonNumber) {
        const personNumber = new PersonNumber(booking.childPersonNumber)
        if (personNumber.isValid()) {
          const setter = {
            childBirthDate: personNumber.getBirthDate()
          }
          if (personNumber.isMale()) {
            setter.childGender = "pojke"
          } else if (personNumber.isFemale()) {
            setter.childGender = "flicka"
          }

          console.log(personNumber.toString() + " => ", setter)
          Bookings.update({_id: booking._id}, {$set: setter})
        }
      }
    })
    
    
    console.log("migrated to v1")
  }
})


