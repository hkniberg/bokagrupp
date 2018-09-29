var moment = require('moment')

export function formatDate(date) {
  if (date) {
    return moment(date).format('YYYY-MM-DD')
  } else {
    return null
  }
}


export function formatDateTime(date) {
  if (date) {
    return moment(date).format('YYYY-MM-DD HH:mm')
  } else {
    return null
  }
}

export function getAge(birthDate, today) {
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate()))
  {
    age--;
  }
  return age;
}

