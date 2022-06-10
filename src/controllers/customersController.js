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

export async function getUser(req, res) {
    const { id } = req.params;
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '').trim();

    try {
        if (!token) {
            return res.sendStatus(401);
        }

        if (!id) {
            res.sendStatus(404);
        }
        const data = await connection.query(
            `SELECT c.name, s.* FROM customers AS c
            JOIN "shortLinks" AS s ON c.id=s."customerId"
            WHERE c.id=$1
            ORDER BY s.id;`,
            [id]);
        if (data.rowCount === 0) {
            return res.sendStatus(404);
        }

        let sum = 0;
        let list = data.rows.filter(item => {
            sum += item.visitCount;
            return (item.id ? true : false);
        })
        list = list.map(item => {
            return {
                id: item.id,
                shortUrl: item.shortUrl,
                url: item.url,
                visitCount: item.visitCount
            };
        });
        const obj = {
            id: data.rows[0].customerId,
            name: data.rows[0].name,
            visitCount: sum,
            shortenedUrls: list
        }

        return res.status(200).send(obj);
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