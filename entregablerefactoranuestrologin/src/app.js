import express from "express";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import session from "express-session";
import mongoStore from "connect-mongo";
import passport from "passport";
import __dirname from "./utils.js";
import initializePassport from "./config/passport.config.js";
import viewsRouter from "./routes/views.router.js";
import sessionRouter from "./routes/sessions.router.js";
import productsRouter from "./routes/products.router.js";

const app = express();
const PORT = 8080;
const MONGO_URL ="mongodb+srv://stevanvasquez270101:MPtRpvdSuoI8ofN1@cluster55575ap.e8hnl3g.mongodb.net/DesafioRefactorANuestroLogin?retryWrites=true&w=majority";
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use(session({
        store: mongoStore.create({ mongoUrl: MONGO_URL, mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true }, ttl: 60 * 3600 }),
        secret: "secretSession",
        resave: false,
        saveUninitialized: false,
    })
);
initializePassport();
app.use(passport.initialize());
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

const connection = mongoose.connect(MONGO_URL).then((conn) => { console.log("CONECTADO!") }).catch((err) => { console.log(err) });

app.use("/", viewsRouter);
app.use("/api/session", sessionRouter);
app.use("/api/products", productsRouter);

app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`);
});