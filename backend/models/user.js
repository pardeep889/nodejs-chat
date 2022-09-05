const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        max: 20,
        default: "no username"
    }
});
const User = mongoose.model('User', userSchema);
module.exports = { User };  