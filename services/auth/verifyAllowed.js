import * as validator from 'email-validator';
const verifyAllowed = ( email, connectDB ) => {
    let res = false;
    if ( isValidEmail(email) ) {
        const cb =  connectDB;
        
        if( cb.find({email: email}) ) {
            res = true;
        }
    }
    return res;
}

function isValidEmail(email) {
    return validator.validate(email)
}


export const authUtils = {
    verifyAllowed,
    isValidEmail,
}