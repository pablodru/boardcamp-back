import dayjs from "dayjs";
import { db } from "../database/database.connection.js";


export async function getRents(req, res) {
    try {

        const rentals = await db.query(
            `SELECT rentals.*, customers.name, games.name AS "gameName" FROM rentals JOIN customers ON rentals."customerId"=customers.id JOIN games ON rentals."gameId"=games.id`
        );

        const allRentals = rentals.rows.map(rental => {
            const result = {...rental, customer:{id:rental.customerId, name: rental.name}, game:{id:rental.gameId, name:rental.gameName}};
            delete result.name;
            delete result.gameName;
            return result;
        })

        res.status(200).send(allRentals);

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function newRent(req, res) {
    const { gameId, customerId, daysRented } = req.body;
    
    try {

        const game = await db.query(
            `SELECT "stockTotal", "pricePerDay" FROM games WHERE games.id=$1;`,[gameId]
        )
        if( game.rows.length===0 ) return res.sendStatus(400);

        const { stockTotal, pricePerDay } = game.rows[0];

        const customer = await db.query(
            `SELECT name FROM customers WHERE customers.id=$1;`, [customerId]
        )
        if( customer.rows.length===0) return res.sendStatus(400);

        const rentedGames = await db.query(
            `SELECT id FROM rentals WHERE "gameId"=$1 AND "returnDate" IS NULL;`, [gameId]
        );

        if( rentedGames.rows.length >= stockTotal ) return res.sendStatus(400);

        const rentDate = dayjs().format('YYYY-MM-DD');
        const originalPrice = daysRented * pricePerDay;

        await db.query(
            `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "originalPrice", "returnDate", "delayFee") VALUES ($1, $2, $3, $4, $5, null, null);`, [customerId, gameId, rentDate, daysRented, originalPrice]
        );

        res.sendStatus(201);

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function finishRent(req, res) {
    try {

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function deleteRent(req, res) {
    try {

    } catch (err) {
        res.status(500).send(err.message);
    }
}