import mongoose from 'mongoose';

// defino Schema:
const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true }, // defino el campo nombre
    last_name: { type: String, required: true }, // defino el campo apellido
    email: { type: String, required: true, unique: true }, // defino el campo email como único
    age: { type: Number, required: false },  // defino el campo edad como no obligatorio
    password: { type: String },  // defino el campo contraseña
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Carts' }, // campo carrito lo junto con el modelo de carts
    role: { type: String, default: 'user' } // defino el campo role, por defecto será "user"
})

export const UserModel = mongoose.model('User', userSchema);
