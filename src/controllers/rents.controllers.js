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
    const { id } = req.params;
    const day = dayjs().format('YYYY-MM-DD');

    try {

        const rental = await db.query(
            `SELECT * FROM rentals WHERE rentals.id=$1;`, [id]
        );
        if( rental.rows.length === 0 ) return res.sendStatus(404);
        if( rental.rows[0].returnDate !== null ) return res.sendStatus(400);

        const { rentDate, daysRented, originalPrice } = rental.rows[0];
        const delay = (daysRented - dayjs().diff(rentDate, 'day'));

        const price = originalPrice / daysRented;
        const delayToPay = price * delay * (-1);

        await db.query(
            `UPDATE rentals SET "returnDate"='${day}', "delayFee"=${delay>=0 ?  0 : delayToPay} WHERE id=$1;`, [id]
        )

        res.sendStatus(200);

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function deleteRent(req, res) {
    const { id } = req.params;

    try {

        const existingRental = await db.query(
            `SELECT id, "returnDate" FROM rentals WHERE id=$1;`, [id]
        );

        if ( existingRental.rows.length === 0 ) return res.sendStatus(404);
        if ( existingRental.rows[0].returnDate === null ) return res.sendStatus(400);

        await db.query(
            `DELETE FROM rentals WHERE id=$1;`, [id]
        );

        res.sendStatus(200);

    } catch (err) {
        res.status(500).send(err.message);
    }
}