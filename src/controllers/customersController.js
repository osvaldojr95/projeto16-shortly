import connection from '../controllers/database.js';

export async function signup(req, res) {
    const { name, email, password, confirmPassword } = req.body;

    if (!confirmPassword || password !== confirmPassword) {
        return res.sendStatus(422);
    }

    try {
        await connection.query(`INSERT INTO customers ("name","email","password") VALUES ($1,$2,$3);`, [name, email, password]);
        return res.sendStatus(201);
    } catch (err) {
        return res.status(500).send(err.message);
    }
}

export async function signin(req, res) {
    const { email, password } = req.body;

    try {
        const exist = await connection.query(`SELECT COUNT(*) FROM customers WHERE "email"=$1 AND "password"=$2`, [email, password]);
        console.log(exist.rows[0].count);
        if (Number(exist.rows[0].count) === 0) {
            return res.sendStatus(401);
        }

        return res.sendStatus(200);
    } catch (err) {
        return res.status(500).send(err.message);
    }
}