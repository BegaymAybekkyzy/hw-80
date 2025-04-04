import express from "express";
import mysqlDb from "../mysqlDb";
import {IItem, IItemMutation} from "../types";
import {ResultSetHeader} from "mysql2";
import {ImageUpload} from "../multer";

const itemRouter = express.Router();

itemRouter.get("/", async (req, res) => {
    try {
        const connection = await mysqlDb.getConnection();
        const [result] = await connection.query('SELECT id, category_id, place_id, title FROM items');
        const items = result as IItem[];
        res.send(items);

    } catch (err) {
        res.status(500).send(err);
    }
});

itemRouter.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const connection = await mysqlDb.getConnection();
        const [result] = await connection.query('SELECT * FROM items WHERE id = ?', [id]);
        const item = result as IItem[];
        res.send(item[0]);

    } catch (err) {
        res.status(500).send(err);
    }
});

itemRouter.post('/', ImageUpload.single("image"), async (req, res) => {
    try {
        if (!req.body.title || !req.body.category_id || !req.body.place_id) {
            res.status(400).send({error: "Fill in all required fields"});
            return;
        }

        if (req.body.title.trim().length === 0
            || req.body.category_id.trim().length === 0
            || req.body.place_id.trim().length === 0) {
            res.status(400).send({error: "The fields should not be empty"});
            return;
        }

        const newItem: IItemMutation = {
            category_id: req.body.category_id,
            place_id: req.body.place_id,
            title: req.body.title,
            description: req.body.description,
            images: req.file ? req.file.filename : null,
        };

        const connection = await mysqlDb.getConnection();
        const [result] = await connection.query(
            'INSERT INTO items (category_id, place_id, title, description, images) VALUES(?, ?, ?, ?, ?)',
            [newItem.category_id, newItem.place_id, newItem.title, newItem.description, newItem.images]
        );

        const resultHeader = result as ResultSetHeader;
        const id = resultHeader.insertId;

        const [oneItem] = await connection.query('SELECT * FROM items WHERE id = ?', [id]);
        const item = oneItem as IItem[];
        res.send(item[0]);

    } catch (err) {
        res.status(500).send(err);
    }
});

itemRouter.put("/:id", ImageUpload.single("image"), async (req, res) => {
    try {
        const id = req.params.id;

        if (!req.body.title) {
            res.status(400).send({error: "Item title are missing"});
            return;
        }
        const updateItem: IItemMutation = {
            category_id: req.body.category_id,
            place_id: req.body.place_id,
            title: req.body.title,
            description: req.body.description,
            images: req.file ? req.file.filename : null,
        };

        const connection = await mysqlDb.getConnection();
        await connection.query(
            'UPDATE items SET category_id = ?, place_id = ?, title = ?, description = ?, images = ? WHERE id = ?',
            [updateItem.category_id, updateItem.place_id, updateItem.title, updateItem.description, updateItem.images, id])

        const [oneItem] = await connection.query('SELECT * FROM items WHERE id = ?', [id]);
        const item = oneItem as IItem[];
        res.send(item[0]);

    } catch (err) {
        res.status(500).send(err);
    }
});

itemRouter.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const connection = await mysqlDb.getConnection();
        await connection.query('DELETE FROM items WHERE id = ?', [id]);

        res.send("Item removed")
    } catch (err) {
        res.status(500).send(err);
    }
});

export default itemRouter;
