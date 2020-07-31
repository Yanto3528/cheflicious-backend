require("dotenv").config({ path: "./src/config/config.env" });
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const connectDB = require("./database");
const errorHandler = require("./middlewares/error");

const auth = require("./routes/auth");
const categories = require("./routes/categories");
const recipes = require("./routes/recipes");
const comments = require("./routes/comments");
const users = require("./routes/users");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(helmet());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

connectDB();

app.use("/api/auth", auth);
app.use("/api/categories", categories);
app.use("/api/recipes", recipes);
app.use("/api/comments", comments);
app.use("/api/users", users);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
