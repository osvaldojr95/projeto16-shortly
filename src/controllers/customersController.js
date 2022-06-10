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
        if (Number(exist.rows[0].count) === 0) {
            return res.sendStatus(401);
        }

        return res.sendStatus(200);
    } catch (err) {
        return res.status(500).send(err.message);
    }
}

export async function ranking(req, res) {
    try {
        const ranking = await connection.query(
            `SELECT c.id, c.name, COUNT(s.*) AS "linksCount", COALESCE(SUM(s."visitCount"), 0) AS "visitCount" FROM customers AS c
            LEFT JOIN "shortLinks" AS s ON c.id=s."customerId"
            GROUP BY c.id
            ORDER BY COALESCE(SUM(s."visitCount"), 0) DESC
            LIMIT 10;`);
        return res.status(200).send(ranking.rows);
    } catch (err) {
        return res.status(500).send(err.message);
    }
}