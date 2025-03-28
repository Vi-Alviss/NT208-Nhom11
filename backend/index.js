import express from "express";
import cors from "cors";
import rootRoutes from "./src/routes/rootRoutes.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(rootRoutes);
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());

const PORT =  3001;

app.get('/', (req,res) => {
    res.send("test")
});


app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
});