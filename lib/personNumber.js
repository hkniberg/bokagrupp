var moment = require('moment')

export class PersonNumber {
  constructor(input) {
    console.assert(input, "No input was given to new PersonNumber(...)")
    input = input.trim()

    if (input.indexOf('-') === -1) {
      if (input.length === 10) {
        input = input.slice(0, 6) + "-" + input.slice(6);
      } else {
        input = input.slice(0, 8) + "-" + input.slice(8);
      }
    }
    if (!input.match(/^(\d{2})(\d{2})(\d{2})\-(\d{4})|(\d{4})(\d{2})(\d{2})\-(\d{4})$/)) {
      this.valid = false
      return
    }

    // Clean input
    input = input.replace('-', '');
    if (input.length === 12) {
      input = input.substring(2);
    }

    // Declare variables
    var d = new Date(((!!RegExp.$1) ? RegExp.$1 : RegExp.$5), (((!!RegExp.$2) ? RegExp.$2 : RegExp.$6)-1), ((!!RegExp.$3) ? RegExp.$3 : RegExp.$7)),
      sum = 0,
      numdigits = input.length,
      parity = numdigits % 2,
      i,
      digit;

    // Check valid date
    if (Object.prototype.toString.call(d) !== "[object Date]" || isNaN(d.getTime())) return false;

    // Check luhn algorithm
    for (i = 0; i < numdigits; i = i + 1) {
      digit = parseInt(input.charAt(i), 10);
      if (i % 2 === parity) { digit *= 2; }
      if (digit > 9) { digit -= 9; }
      sum += digit;
    }
    if ((sum % 10) === 0) {
      this.valid = true
    } else {
      this.valid = false
    }

    const shortYear = parseInt(input.substring(0, 2))
    if (shortYear > 30) {
      this.pn = "19" + input
    } else {
      this.pn = "20" + input
    }
  }

  isValid() {
    return this.valid
  }

  getAge(today) {
    const dateString = this.pn.substring(0, 8)
    const birthDate = moment(dateString + " 00:00:00", "YYYYMMDD HH:mm:ss")
    return getAge(birthDate.toDate(), today)
  }
  
  toString() {
    return this.pn.substring(0, 8) + "-" + this.pn.substring(8, 12)
  }
}

function getAge(birthDate, today) {
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate()))
  {
    age--;
  }
  return age;
}
