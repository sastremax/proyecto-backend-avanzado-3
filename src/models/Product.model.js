import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

// defino el esquema para los productos
const productSchema = new mongoose.Schema({
    title: { type: String, required: true, maxlength: 100 },   // valido que el título sea obligatorio y tenga un maximo de 100 caracteres
    description: { type: String, required: true, maxlength: 200 },  // valido que la descripción sea obligatoria y se limita a 100 caracteres
    price: { type: Number, required: true, min: 0 },  // alido que el precio sea obligatorio  y no puede ser negativo
    code: { type: String, required: true, unique: true },   // valido que el código sea obligatorio y unico
    stock: { type: Number, required: true, min: 0 },  // valido que el stock sea obligatorio y no puede ser negativo
    category: { type: String, required: true, maxlength: 100 },   // valido que la categoría sea obligatoria y se limita a 100 caracteres
    status: { type: String, enum: ['available', 'unavailable'], default: 'available' },  // valido que el estado solo pueda ser de dos formas
    thumbnails: {
        type: [String],
        default: [],
        validate: {
            validator: (array) => {
                return array.every(url => url.startsWith("/") || /^https?:\/\/.+/.test(url));
            },
            message: 'URLs must be valid links'       // valido que las imágenes sean URLs válidas
        }
    }
});

// agrego el plugin de paginación al esquema
productSchema.plugin(mongoosePaginate);

// creo el modelo de producto basado en el esquema
const Product = mongoose.model('Product', productSchema);

export default Product;