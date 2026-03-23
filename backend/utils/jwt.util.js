import jwt from "jsonwebtoken";

export function signMagicLinkToken(email, expiresAt){
    const token = jwt.sign(
        {
            email,
            purpose: 'magic-link'
        },
        process.env.MAGIC_LINK_SECRET,
        {expiresIn: expiresAt}
    );
    return token;
};

export function verifyMagicLinkToken(token){
    try {
    const payload = jwt.verify(token, process.env.MAGIC_LINK_SECRET);
    if (payload.purpose !== 'magic-link') {
      throw new Error('wrong token type');
    }
    return payload;
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new Error('Your invite link has expired. Please ask the admin to send a new one.');
    }
    throw new Error('Invalid token');
  }
};


export function signSessionToken(payload){
    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {expiresIn: '7d'}
    );
    return token;
};


export function verifySessionToken(token){
    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if (payload.purpose === 'magic-link') {
            throw new Error('wrong token type');
        }
        return payload;
    }catch(err){
        if (err.name === 'TokenExpiredError') {
            throw new Error('Your session has expired. Please sign in again.');
        }
        throw new Error('Invalid token');
    }
};

