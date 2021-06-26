const mongoose= require('mongoose')

const student_schema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    stream:{
        type: String,
        required: true
    },
    backlog:{
        type: Number,
        required: true
    },
    ssc_perc:{
        type: Number,
        required: true
    },
    hsc_perc:{
        type: Number,
        required: true
    },
    grad_perc:{
        type: Number,
        require: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    }
})


const students = mongoose.model('students', student_schema)

module.exports = students