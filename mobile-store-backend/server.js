
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const adminProductRoutes = require("./routes/adminProductRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");

dotenv.config();

connectDB();


const app = express();


app.use(express.json());



app.get("/", (req, res) => {
    res.send("Mobile Store API Running...");
});



// Routes


app.use(
    "/api/admin",
    adminRoutes
);
app.use(
"/api/admin/inventory",
inventoryRoutes
);
app.use(
"/api/admin/products",
adminProductRoutes
);
app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);

app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);


const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {

    console.log(`Server Running On Port ${PORT}`);

});