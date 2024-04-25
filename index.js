//Importing the required libraries/modules
const express = require("express");
const cors = require('cors');
const app = express();


//Attach the middleware
//
app.use(express.json());
app.use(cors());

const dotenv = require("dotenv")
dotenv.config({path:"./config.env"})
console.log(process.env.DB_HOST);
//const mongodbUri = "mongodb://localhost:27017/test"
const ismongodbURIExisted = (typeof mongodbUri !== 'undefined') ? true : false
console.log(ismongodbURIExisted)
// 連線資料庫
const mongoose = require("mongoose");
console.log(`連線資料庫位址：${ismongodbURIExisted}`);
mongoose.connect(mongodbUri)
  .then(() => {
    console.log("資料庫連線成功");
  })
  .catch((error) => {
    console.log(`資料庫連線失敗，理由： ${error}`);
  })

// Importing routers
const authRouter = require("./routes/authRouter");                  //AuthRouter
const articleRouter = require("./routes/articleRouter");            //articleRouter
const userRouter = require("./routes/userRouter");                  //userRouter
const relationshipRouter = require("./routes/relationshipRouter");  //relationshipRouter
const registerRouter = require("./routes/registerRouter");          //registerRouter


app.use("/auth", authRouter);
app.use("/article", articleRouter);
app.use("/user", userRouter);
app.use("/relationship", relationshipRouter);
app.use("/register", registerRouter);



app.get("/", function (req, res) {
  console.log("測試");
  res.send("哈哈");
});

const port = process.env.PORT || 3005;
app.listen(port, () => console.log(`Listening on ${port}...`));
