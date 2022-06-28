var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LectureSchema = new Schema({
  courseId: { type: mongoose.ObjectId, ref: 'Course', autopopulate: {maxDepth: 1}},
  title: String,
  description: String,
  videoId: String
});

LectureSchema.plugin(require('mongoose-autopopulate'));
let Lecture
try{
  Lecture = mongoose.model('Lecture')
}catch{
  Lecture = mongoose.model('Lecture', LectureSchema)
}
module.exports = Lecture