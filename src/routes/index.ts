import express from "express";
import auth from "./auth";
import product from "./product";
import rack from "./rack";
import transaction from "./transaction";
import user from "./user";

const routes = express.Router();

routes.use("/auth", auth);
routes.use("/product", product);
routes.use("/rack", rack);
routes.use("/transaction", transaction);
routes.use("/user", user);

export default routes;
