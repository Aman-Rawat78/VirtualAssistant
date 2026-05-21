import jwt from 'jsonwebtoken';

const genToken = (userId) => {
    const payload = {
        id: userId,
    };
    const secret = process.env.JWT_SECRET;
    const options = {
        expiresIn: '1d',
    };
    const token = jwt.sign(payload, secret, options);
    return token;
};

export default genToken;