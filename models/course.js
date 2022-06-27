var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CourseSchema = new Schema({
    title: String,
    description: String,
    thumbnailUrl: String,
    chapters: [{type: Schema.Types.ObjectId, ref: 'CourseChapter', autopopulate: true}],
    lectures: [{type: Schema.Types.ObjectId, ref: 'Lecture', autopopulate: true}]
});
CourseSchema.plugin(require('mongoose-autopopulate'));

const Course =  mongoose.model('Course') || mongoose.model('Course', CourseSchema)
module.exports = Course