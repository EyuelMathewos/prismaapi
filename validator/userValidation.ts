export const validationRule = {
    "email": "required|email",
    "name": "required|string",
    "password": "required|string|min:6",
    "role": "required|numeric"
};

export const loginValidation = {
    "email": "required|email",
    "password": "required|string|min:6"
};