var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LectureSchema = new Schema({
  courseId: mongoose.ObjectId,
  title: String,
  description: String,
  videoId: String
});

let Lecture
try{
  Lecture = mongoose.model('Lecture')
}catch{
  Lecture = mongoose.model('Lecture', LectureSchema)
}
module.exports = Lecture