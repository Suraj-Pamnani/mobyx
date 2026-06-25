
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes=require("./routes/orderRoutes");


dotenv.config();

connectDB();


const cors = require("cors");
const helmet = require("helmet");
const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));
app.use(express.json());



app.get("/", (req,res)=>{
    res.send("Mobile Store API Running...");
});



// Routes

app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);

app.use("/api/cart", cartRoutes);
app.use("/api/orders",orderRoutes);


const PORT = process.env.PORT || 5000;


app.listen(PORT, ()=>{

    console.log(`Server Running On Port ${PORT}`);

});