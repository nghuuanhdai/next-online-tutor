var mongoose = require('mongoose')
var Schema = mongoose.Schema

var CourseChapterSchema = new Schema({
  title: {type: String, default: 'untitled'},
  chapters: [{type: Schema.Types.ObjectId, ref: 'CourseChapter', autopopulate: true}],
  lectures: [{type: Schema.Types.ObjectId, ref: 'Lecture', autopopulate: true}]
})
CourseChapterSchema.plugin(require('mongoose-autopopulate'));
let CourseChapter
try{
  CourseChapter = mongoose.model('CourseChapter')
}catch{
  CourseChapter = mongoose.model('CourseChapter', CourseChapterSchema)
}
module.exports = CourseChapter