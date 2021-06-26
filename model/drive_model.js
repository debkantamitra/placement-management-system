const mongoose= require('mongoose')

const drives_schema = new mongoose.Schema({
    drive_id:{
        type:String,
        required: true,
        unique: true
    },
    company_name:{
        type: String,
        required: true
    },
    job_role:{
        type: String,
        required: true
    },
    package:{
        type: Number,
        required: true
    },
    perc_criteria:{
        type: Number,
        required: true
    },
    back_criteria:{
        type: Number,
        required: true
    },
    test_date:{
        type: String,
        required: true
    },
    apply_link:{
        type: String,
        required: true
    }
})


const drives = mongoose.model('drives', drives_schema)

module.exports = drives