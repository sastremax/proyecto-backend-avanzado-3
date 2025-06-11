import bcrypt from 'bcrypt';

export const hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
}

export const isValidPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};