import express from "express";
import mysqlDb from "../mysqlDb";
import {IPlace} from "../types";
import {ResultSetHeader} from "mysql2";

const placeRouter = express.Router();

placeRouter.get("/", async (req, res) => {
    try {
        const connection = await mysqlDb.getConnection();
        const [result] = await connection.query('SELECT * FROM places');
        const places = result as IPlace[];
        res.send(places);

    } catch (err) {
        res.status(500).send(err);
    }
});

placeRouter.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const connection = await mysqlDb.getConnection();
        const [result] = await connection.query('SELECT * FROM places WHERE id = ?', [id]);
        const place = result as IPlace[];
        res.send(place[0]);

    } catch (err) {
        res.status(500).send(err);
    }
});

placeRouter.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;

        if (!req.body.title) {
            res.status(400).send({error: "Place title are missing"});
            return;
        }
        const updatePlace: IPlace = {
            title: req.body.title,
            description: req.body.description,
        };

        const connection = await mysqlDb.getConnection();
        await connection.query(
            'UPDATE places SET title = ?, description = ? WHERE id = ?',
            [updatePlace.title, updatePlace.description, id])

        const [onePlace] = await connection.query('SELECT * FROM places WHERE id = ?', [id]);
        const place = onePlace as IPlace[];
        res.send(place[0]);

    } catch (err) {
        res.status(500).send(err);
    }
});

placeRouter.post('/', async (req, res) => {
    try {
        if (!req.body.title) {
            res.status(400).send({error: "Place title are missing"});
            return;
        }

        const newPlace: IPlace = {
            title: req.body.title,
            description: req.body.description,
        };

        const connection = await mysqlDb.getConnection();
        const [result] = await connection.query('INSERT INTO places (title, description) VALUES(?, ?)',
            [newPlace.title, newPlace.description]
        );

        const resultHeader = result as ResultSetHeader;
        const id = resultHeader.insertId;

        const [onePlace] = await connection.query('SELECT * FROM places WHERE id = ?', [id]);
        const place = onePlace as IPlace[];
        res.send(place[0]);

    } catch (err) {
        res.status(500).send(err);
    }
});

placeRouter.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const connection = await mysqlDb.getConnection();
        await connection.query('DELETE FROM places WHERE id = ?', [id]);

        res.send("Place removed")
    }catch (err) {
        res.status(500).send(err);
    }
});


export default placeRouter;
