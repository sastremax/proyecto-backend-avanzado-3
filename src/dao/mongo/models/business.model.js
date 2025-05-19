import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]

});

export const BusinessModel = mongoose.model('Business', businessSchema);
