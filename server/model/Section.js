const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true
}

const sectionSchema = new mongoose.Schema({
    section: {
        type:String,
        required:true
    },
    gradeLevel: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'gradeLevel' 
    },
    adviser: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'teacher' 
    },
    department: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'department' 
    },
    status: {
        type: Boolean,
        required: true
    }
    
}, { timestamps: true })

sectionSchema.statics.addSection = async function(section,gradeLevel,department,status) {
    const exist = await this.findOne({ section });
    if(exist && exist.status) {
        throw Error('This section is already existing');
    }

    if(!gradeLevel) {
        throw Error('Grade level must not be empty')
    }

    if(!department) {
        throw Error('Department must not be empty');
    }

    
    const newSection = await this.create({ section,gradeLevel,department,status });
    return newSection;
}

const SectionModel = mongoose.model('section',sectionSchema);
module.exports = SectionModel;