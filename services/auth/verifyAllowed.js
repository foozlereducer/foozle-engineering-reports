import * as validator from 'email-validator';
export const verifyAllowed = async ( eml, connectDB, AllowedModel) => {
    let res = false;
    if ( isValidEmail(eml) ) {
        connectDB();

        const doc = await AllowedModel.find({email: eml});
        // get the first document in the returned find collection
        if( doc.length > 0 && doc[0].email == eml) {
            res = true;
        }
    }
    return res;
}

export function isValidEmail(email) {
    return validator.validate(email)
}