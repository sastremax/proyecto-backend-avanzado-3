import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
    title: { type: String, required: true, maxlength: 100 },
    description: { type: String, required: true, maxlength: 200 },
    price: { type: Number, required: true, min: 0 },
    code: { type: String, required: true, unique: true },
    stock: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, maxlength: 100 },
    status: { type: String, enum: ['available', 'unavailable'], default: 'available' },
    thumbnails: {
        type: [String],
        default: [],
        validate: {
            validator: (array) => {
                return array.every(url => url.startsWith("/") || /^https?:\/\/.+/.test(url));
            },
            message: 'URLs must be valid links'
        }
    }
});

productSchema.plugin(mongoosePaginate);

const Product = mongoose.model('Product', productSchema);

export default Product;