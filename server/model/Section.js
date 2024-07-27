const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true
}

const sectionSchema = new mongoose.Schema({
    section: {
        type:String,
        // required:true
    },
    gradeLevel: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'gradeLevel' 
    },
    adviser: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'teacher',
        unique: true 
    },
    status: {
        type: Boolean,
        required: true
    },
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'schoolYear'
    }
    
}, { timestamps: true })

sectionSchema.statics.addSection = async function(section, gradeLevel, adviser, status, sessionId) {
    const exist = await this.findOne({ section, sessionId });

    if (exist && exist.status) {
        throw new Error(`${section} is already existing for the current session, please create another section name`);
    }

    if (!gradeLevel) {
        throw new Error('Grade level must not be empty');
    }

    const newSection = await this.create({ section, gradeLevel, adviser, status, sessionId });
    return newSection;
};

const SectionModel = mongoose.model('section',sectionSchema);
module.exports = SectionModel;