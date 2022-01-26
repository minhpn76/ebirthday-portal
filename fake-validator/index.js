function FakeValidator() {}
FakeValidator.prototype.validateXML = function(input, ref, cb) {
  cb(null, { valid: true })
}

module.exports = FakeValidator
