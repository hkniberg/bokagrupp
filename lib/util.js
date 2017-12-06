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

