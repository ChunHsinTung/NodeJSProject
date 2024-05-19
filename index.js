//Importing the required libraries/modules
const express = require("express");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path')
const app = express();
const MongoStore = require("connect-mongo"); //用程式操作mongo
const passport = require('passport') //入第三方套件庫
const session = require('express-session') //讀寫session空間
// Passport config
// const passportSetup = require("./config/passport"); // 引入方式二(名稱自訂)
// Sessions設定
const GoogleStrategy = require('passport-google-oauth20').Strategy;

app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ //將session存到MongoDB
      mongoUrl: "mongodb://localhost:27017/test",
      // mongoUrl: process.env.DB_HOST,
      dbName: "storybooks",
      stringify: false,
    }),
  })
)
// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Attach the middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

const dotenv = require("dotenv")
dotenv.config({ path: "./.env" })
//dotenv.config({ path: "./config.env" })
//console.log(process.env.DB_HOST);
// const mongodbUri = process.env.DB_HOST;
const mongodbUri = "mongodb://localhost:27017/test"
//console.log(mongodbUri);

const ismongodbURIExisted = (typeof mongodbUri !== 'undefined') ? true : false
console.log(ismongodbURIExisted)
// 連線資料庫
const mongoose = require("mongoose");
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
console.log(`連線資料庫位址：${ismongodbURIExisted}`);
mongoose.connect(mongodbUri, clientOptions)
  .then(() => {
    console.log("資料庫連線成功");
  })
  .catch((error) => {
    console.log(`資料庫連線失敗，理由： ${error}`);
  })

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3005/auth/google/callback",
},
  (accessToken, refreshToken, profile, cb) => {
    return cb(null, profile);
  }
))

// Importing routers
const authRouter = require("./routes/authRouter");                  //AuthRouter
const articleRouter = require("./routes/articleRouter");            //articleRouter
const userRouter = require("./routes/userRouter");                  //userRouter
const relationshipRouter = require("./routes/relationshipRouter");  //relationshipRouter
const registerRouter = require("./routes/registerRouter");          //registerRouter
const loginRouter = require("./routes/loginRouter");          //registerRouter
const likeRouter = require("./routes/like");                        // likeRouter
const dislikeRouter = require("./routes/dislike");                        // dislikeRouter


app.use("/auth", authRouter);
app.use("/article", articleRouter);
app.use("/user", userRouter);
app.use("/relationship", relationshipRouter);
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/like", likeRouter);
app.use("/dislike", dislikeRouter);

app.get("/", function (req, res) {
  console.log("測試");
  res.send("哈哈");
});

const port = process.env.PORT || 3005;
app.listen(port, () => console.log(`Listening on ${port}...`));
