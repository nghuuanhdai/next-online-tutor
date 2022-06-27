var mongoose = require('mongoose')
var Schema = mongoose.Schema

var CourseChapterSchema = new Schema({
  title: String,
  chapters: [{type: Schema.Types.ObjectId, ref: 'CourseChapter', autopopulate: true}],
  lectures: [{type: Schema.Types.ObjectId, ref: 'Lecture', autopopulate: true}]
})
CourseChapterSchema.plugin(require('mongoose-autopopulate'));
const CourseChapter = mongoose.model('CourseChapter') || mongoose.model('CourseChapter', CourseChapterSchema)
module.exports = CourseChapter