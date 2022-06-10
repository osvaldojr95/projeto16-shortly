import connection from '../controllers/database.js';
import { nanoid } from 'nanoid';
import dotenv from "dotenv";
import jwt from 'jsonwebtoken';
dotenv.config();

export async function shorten(req, res) {
    const { url } = req.body;
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '').trim();

    if (!token) {
        return res.sendStatus(401);
    }
    try {
        const tokenValidation = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        return res.sendStatus(401);
    }

    let shortUrl = url;
    shortUrl = nanoid();

    try {
        await connection.query(`INSERT INTO "shortLinks" ("customerId","shortUrl","url") VALUES ($1,$2,$3);`, [1, shortUrl, url]);
        return res.status(201).send({ shortUrl });
    } catch (err) {
        return res.status(500).send(err.message);
    }
}

export async function getShortLink(req, res) {
    const { id } = req.params;
    if (!id) {
        return res.sendStatus(404);
    }

    try {
        const shortLink = await connection.query(`SELECT * FROM "shortLinks" WHERE "id"=$1;`, [id]);
        if (shortLink.rowCount === 0) {
            return res.sendStatus(404);
        }

        const obj = { id: shortLink.rows[0].id, shortUrl: shortLink.rows[0].shortUrl, url: shortLink.rows[0].url }
        return res.status(200).send(obj);
    } catch (err) {
        return res.status(500).send(err.message);
    }
}

export async function redirect(req, res) {
    const { shortUrl } = req.params;
    if (!shortUrl) {
        return res.sendStatus(404);
    }

    try {
        const shortLink = await connection.query(`SELECT * FROM "shortLinks" WHERE "shortUrl"=$1;`, [shortUrl]);
        if (shortLink.rowCount === 0) {
            return res.sendStatus(404);
        }

        await connection.query(`UPDATE "shortLinks" SET "visitCount"=$1 WHERE "shortUrl"=$2;`, [shortLink.rows[0].visitCount + 1, shortUrl]);
        return res.redirect(shortLink.rows[0].url);
    } catch (err) {
        return res.status(500).send(err.message);
    }
}

export async function removeLink(req, res) {
    const { id } = req.params;
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '').trim();
    let tokenValidation;

    try {
        if (!token) {
            return res.sendStatus(401);
        }
        try {
            tokenValidation = jwt.verify(token, process.env.JWT_SECRET);
        } catch (e) {
            return res.sendStatus(401);
        }

        if (!id) {
            return res.sendStatus(404);
        }
        const link = await connection.query(`SELECT * FROM "shortLinks" WHERE id=$1`, [id]);
        if (link.rowCount === 0) {
            return res.sendStatus(404);
        }
        const user = await connection.query(`SELECT "customerId" FROM sessions WHERE id=$1`, [tokenValidation.sessionId]);
        console.log(link.rows[0].id, user.rows[0].customerId);
        if (link.rows[0].customerId !== user.rows[0].customerId) {
            return res.sendStatus(401);
        }

        await connection.query(`DELETE FROM "shortLinks" WHERE id=$1`, [id]);
        return res.sendStatus(204);
    } catch (err) {
        return res.status(500).send(err.message);
    }
}