const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
},})

const chatSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'User',
    }],
}, { timestamps: true});

const messageSchema = new mongoose.Schema({
    senderid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    chatid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
    },
    content: {
        type: String,
        required: true,
    }
},{ timestamps: true})

UserSchema.statics.signup = async function (username, password, email) {
    if (!username || !password || !email) { 
        throw Error('All fields must be filled')
    }
    const exists = await this.findOne({ email })
    if (exists) {
        throw Error('Email already in use')
    }
    if (!validator.isEmail(email)) {
        throw Error('Email is not valid')
    }
    if(password.length < 8){
        throw Error('Password length is less than 8 ')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const user = await this.create({ username, password: hash, email });

    return user
}


UserSchema.statics.login = async function (email, password) {
    if (!email || !password) {
        throw Error('All fields must be filled')
    }
    const user = await this.findOne({ email })
    if (!user) {
        throw Error('email is not registered')
    }
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        throw Error('Incorrect password')
    }
    return user
}

const User = mongoose.model('User', UserSchema);
const Chat = mongoose.model('Chat', chatSchema);
const Message = mongoose.model('Message', messageSchema);

module.exports = { User, Chat, Message };