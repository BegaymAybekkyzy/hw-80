import express from "express";
import mysqlDb from "../mysqlDb";
import {ICategory} from "../types";
import {ResultSetHeader} from "mysql2";

const categoryRouter = express.Router();

categoryRouter.get("/", async (req, res) => {
    try {
        const connection = await mysqlDb.getConnection();
        const [result] = await connection.query('SELECT * FROM categories');
        const categories = result as ICategory[];
        res.send(categories);

    } catch (err) {
        res.status(500).send(err);
    }
});

categoryRouter.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const connection = await mysqlDb.getConnection();
        const [result] = await connection.query('SELECT * FROM categories WHERE id = ?', [id]);
        const category = result as ICategory[];
        res.send(category[0]);

    } catch (err) {
        res.status(500).send(err);
    }
});

categoryRouter.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;

        if (!req.body.title) {
            res.status(400).send({error: "Category title are missing"});
            return;
        }
        const updateCategory: ICategory = {
            title: req.body.title,
            description: req.body.description,
        };

        const connection = await mysqlDb.getConnection();
        await connection.query(
            'UPDATE categories SET title = ?, description = ? WHERE id = ?',
            [updateCategory.title, updateCategory.description, id])

        const [oneCategory] = await connection.query('SELECT * FROM categories WHERE id = ?', [id]);
        const category = oneCategory as ICategory[];
        res.send(category[0]);

    } catch (err) {
        res.status(500).send(err);
    }
});

categoryRouter.post('/', async (req, res) => {
    try {
        if (!req.body.title) {
            res.status(400).send({error: "Category title are missing"});
            return;
        }

        const newCategory: ICategory = {
            title: req.body.title,
            description: req.body.description,
        };

        const connection = await mysqlDb.getConnection();
        const [result] = await connection.query('INSERT INTO categories (title, description) VALUES(?, ?)',
            [newCategory.title, newCategory.description]
        );

        const resultHeader = result as ResultSetHeader;
        const id = resultHeader.insertId;

        const [oneCategory] = await connection.query('SELECT * FROM categories WHERE id = ?', [id]);
        const category = oneCategory as ICategory[];
        res.send(category[0]);

    } catch (err) {
        res.status(500).send(err);
    }
});

categoryRouter.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const connection = await mysqlDb.getConnection();
        await connection.query('DELETE FROM categories WHERE id = ?', [id]);

        res.send("Category removed")
    }catch (err) {
        res.status(500).send(err);
    }
});

export default categoryRouter;
