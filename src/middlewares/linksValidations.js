import Joi from "joi";

const linkSchema = Joi.object({
    url: Joi.string().min(1).required()
})

export async function validateLink(req, res, next) {
    const { url } = req.body;

    const validation = linkSchema.validate({ url }, { abortEarly: false });
    if (validation.error) {
        return res.status(422).send(validation.error.message);
    }

    next();
}