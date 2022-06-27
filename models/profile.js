var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProfileSchema = new Schema({
    admin: Boolean,
    email: {type: String, unique: true, index: true},
    courses: [{type: Schema.Types.ObjectId, ref: 'Course', autopopulate: { maxDepth: 1 }}],
});
ProfileSchema.plugin(require('mongoose-autopopulate'));

const Profile = mongoose.model('Profile') || mongoose.model('Profile', ProfileSchema)
module.exports = Profile