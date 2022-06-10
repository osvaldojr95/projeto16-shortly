import Joi from "joi";

const customerSchema = Joi.object({
    name: Joi.string().min(1),
    email: Joi.string().min(1).required(),
    password: Joi.string().min(1).required(),
    confirmPassword: Joi.string().min(1),
})

export async function validateCustomer(req, res, next) {
    const { name, email, password, confirmPassword } = req.body;

    const validation = customerSchema.validate({ name, email, password, confirmPassword }, { abortEarly: false });
    if (validation.error) {
        return res.status(422).send(validation.error.message);
    }

    next();
}