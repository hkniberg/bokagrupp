
const dateUtil = require('../lib/dateUtil.js')
const expect = require('chai').expect

describe('dateUtil', function() {
  describe('getAge', function() {
    it('age 0', function() {
      const birthDate = new Date("1973-02-17")
      const today = new Date("1973-03-01")
      expect(dateUtil.getAge(birthDate, today)).to.equal(0)
    })

    it('age 0 but almost 1', function() {
      const birthDate = new Date("1973-02-17")
      const today = new Date("1974-02-16 23:30")
      expect(dateUtil.getAge(birthDate, today)).to.equal(0)
    })
    it('age 1', function() {
      const birthDate = new Date("1973-02-17")
      const today = new Date("1974-02-17 00:10")
      expect(dateUtil.getAge(birthDate, today)).to.equal(1)
    })
  })

})