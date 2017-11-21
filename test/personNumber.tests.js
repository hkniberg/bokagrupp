
const util = require('../lib/util.js')
const expect = require('chai').expect
const PersonNumber = require("../lib/personNumber").PersonNumber

describe('PersonNumber', function() {
  it('create', function() {
    new PersonNumber("2017")
  })
  it('invalid personnumber', function() {
    const pn = new PersonNumber("2017")
    expect(pn.valid).to.equal(false)
  })
  it('valid personnumber with dash', function() {
    const pn = new PersonNumber("730217-0019")
    expect(pn.valid).to.equal(true)
  })
  it('valid personnumber without dash', function() {
    const pn = new PersonNumber("7302170019")
    expect(pn.valid).to.equal(true)
  })
  it('long valid personnumber with dash', function() {
    const pn = new PersonNumber("19730217-0019")
    expect(pn.valid).to.equal(true)
  })
  it('long valid personnumber without dash', function() {
    const pn = new PersonNumber("197302170019")
    expect(pn.valid).to.equal(true)
  })
  it('whitespace', function() {
    const pn = new PersonNumber("   730217-0019   ")
    expect(pn.valid).to.equal(true)
  })
  it('wrong checksum', function() {
    const pn = new PersonNumber("730217-0020")
    expect(pn.valid).to.equal(false)
  })
  it('Young person', function() {
    const pn = new PersonNumber("20080319-1527")
    expect(pn.valid).to.equal(true)
  })
  it('age 0', function() {
    const pn = new PersonNumber("730217-0020")
    const today = new Date("1973-03-01 00:00")
    expect(pn.getAge(today)).to.equal(0)
  })
  it('age 0 but almost 1', function() {
    const pn = new PersonNumber("730217-0020")
    const today = new Date("1974-02-16 23:30")
    expect(pn.getAge(today)).to.equal(0)
  })
  it('age 1', function() {
    const pn = new PersonNumber("730217-0020")
    const today = new Date("1974-02-17 00:10")
    expect(pn.getAge(today)).to.equal(1)
  })

})