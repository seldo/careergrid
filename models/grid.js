var mongoose = require('mongoose')

var GridSchema = mongoose.Schema({
  user_id: String,
  short_id: String,
  start: String,
  end: String, // this is bad, as it creates an empty key in every record
  skills: [{
    name: String,
    intensities: [Number]
  }]
})

GridSchema.statics.findByUserId = function(userid,cb) {
  this.find({user_id: userid },cb)
}

GridSchema.statics.findByShortId = function(userid,shortid,cb) {
  this.findOne({user_id: userid, short_id: shortid})
}

var Grid = mongoose.model('Grid', GridSchema)

module.exports = Grid;