const express = require("express");
const app = express();
const PORT = 5000;
const Database = require("./config/db");
Database();
const morgan = require("morgan");

const { notFound, errorHandler } = require("./Middelware/errorhandler");
const cookieParser = require("cookie-parser");

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(morgan("dev"));

const authroutes = require("./routes/authroute");
const productroutes = require("./routes/productroute");
const blogroutes = require("./routes/blogroute");
const categoryroute = require("./routes/categoryroute");
const blogcatroute = require("./routes/blogcatroute");
const brandroute = require("./routes/brandroute");
const coupanroute = require("./routes/coupanroute");

app.use("/api/user", authroutes);
app.use("/api/product", productroutes);
app.use("/api/blog", blogroutes);
app.use("/api/category", categoryroute);
app.use("/api/blogcat", blogcatroute);
app.use("/api/brand", brandroute);
app.use("/api/coupan", coupanroute);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server listen to this ${PORT}`);
});
