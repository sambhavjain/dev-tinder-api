const validateSignup = (data) => {
    const { firstName, lastName, email, password, age, gender, photoUrl, about, skills } = data;
    if(!firstName || !email || !password){
       throw new Error('All fields are required') 
    }
}

const validateLogin = (data) => {
    const { email, password } = data;
    if(!email || !password){
       throw new Error('All fields are required') 
    }
}

const validateProfileEdit = (data) => {
    const ALLOWED_FIELDS = [ 'age', 'photoUrl', 'about', 'skills']
    const isValidFields = Object.keys(data).every(key => ALLOWED_FIELDS.includes(key))
    if(!isValidFields){
        throw new Error('Invalid fields provided')
    }
}

const validateConnectionRequest = (data) => {
    const { toUserId, status } = data;
    const ALLOWED_STATES = ['interested', 'ignored']
    const isValidStatus = ALLOWED_STATES.includes(status)
    if(!toUserId){
        throw new Error('receiver userId is required')
    }
    if(!status){
        throw new Error('status is required')
    }
    if(!isValidStatus){
        throw new Error('Invalid status provided')
    }
}

const validateReviewConnectionRequest = (data) => {
    const { requestId, status } = data;
    const ALLOWED_STATES = ['accepted', 'rejected']
    const isValidStatus = ALLOWED_STATES.includes(status)
    if(!requestId || !status){
        throw new Error('requestId is required')
    }
    if(!isValidStatus){
        throw new Error('Invalid status provided')
    }
}

module.exports = { validateSignup, validateLogin, validateProfileEdit, validateConnectionRequest, validateReviewConnectionRequest }