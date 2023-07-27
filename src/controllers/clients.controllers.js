import { db } from "../database/database.connection.js";


export async function getCustomers(req, res) {
    try {

        const customers = await db.query(
            `SELECT * FROM customers;`
        )

        return res.status(200).send(customers.rows);
        
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getCustomerById(req, res) {
    const { id } = req.params;

    try {

        const customer = await db.query(
            `SELECT * FROM customers WHERE id=$1;`, [id]
        );

        if ( customer.rows.length === 0 ) return res.sendStatus(404);

        res.status(200).send(customer.rows[0]);
        
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function newCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    try {

        const existingCPF = await db.query(
            `SELECT * FROM customers WHERE cpf=$1;`, [cpf] 
        )

        if ( existingCPF.rows.length > 0 ) return res.sendStatus(409);

        await db.query(
            `INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1,$2, $3, $4);`, [name, phone, cpf, birthday]
        );

        res.sendStatus(201)

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function updateCustomer(req, res) {
    const { id } = req.params;
    const { name, phone, cpf, birthday } = req.body;

    try {

        const existingCPF = await db.query(
            `SELECT id FROM customers WHERE cpf=$1;`, [cpf] 
        );
        if ( existingCPF.rows > 0 && id !== existingCPF.id ) return res.sendStatus(409);

        await db.query(
            `UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5`, [name, phone, cpf, birthday, id]
        );
        
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
}