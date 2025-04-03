import express from "express";
import itemRouter from "./routers/items";
import categoryRouter from "./routers/categories";
import placeRouter from "./routers/places";
import mysqlDb from "./mysqlDb";

const app = express();
const port = 8000;

app.use(express.static("public"));
app.use(express.json());
app.use("/items", itemRouter);
app.use("/categories", categoryRouter);
app.use("/places", placeRouter);

const run = async () => {
  await mysqlDb.init();

  app.listen(port, () => {
    console.log(`Server started http://localhost:${port}`);
  });
};

run().catch(console.error);
