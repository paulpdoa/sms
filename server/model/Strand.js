const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true
}

const strandSchema = new mongoose.Schema({
    strand: {
        type:String,
        required:true
    },
    inputter: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user' 
    },
    status: {
        type: Boolean,
        required: true
    }
}, { timestamps: true })

strandSchema.statics.addStrand = async function(strand,inputter,status) {
    const exist = await this.findOne({ strand });
    // Add strand if strand is already inactive
    if(exist && exist.status) {
        throw Error('This strand is already in the record');
    }

    const newStrand = await this.create({ strand,inputter,status });
    return newStrand
}

const StrandModel = mongoose.model('strand',strandSchema);
module.exports = StrandModel;