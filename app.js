const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const dotenv = require('dotenv');

//導入express的第三方cors中間件 >> 解決跨域問題
const cors = require('cors');
const apiRouter = require('./routes/api');
//導入 express-session
const session = require('express-session');
const MongoStore = require('connect-mongo');

dotenv.config()

const DB_URL = process.env.atlas_URL;

const app = express();

// 設置 trust proxy，這裡的 1 代表信任一層代理 (因後端運行在一個反向代理(render)後面)
app.set('trust proxy', 1);

//設置 session 中間件
app.use(session({
  name: 'sid', //設置 cookie的name,默認值是: connect.sid
  secret: 'secretsecret', //參與加密的字符串(又稱簽名) 加鹽
  saveUninitialized: true, //是否為每次請求都設置一個cookie用來存儲session的id
  resave: false, //是否在每次請求時重新保存 session 
  store: MongoStore.create({
    mongoUrl: DB_URL //數據庫連接配置
  }),
  cookie: {   
    httpOnly: true, //開啟後 前端無法通過 js操作
    maxAge: 1000 * 60 * 60 * 24 * 7, //控制sessionID的過期時間(單位:毫秒)
    sameSite: 'None', // 或 'None' 如果使用跨域请求
    secure: true, // 僅在 HTTPS 連接中傳遞 cookie
  },
}))

//設置 cors 
app.use(
  cors({
    origin: 'https://fang-ting-chen.github.io',
    methods: 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    allowedHeaders: ['X-Requested-With', 'X-HTTP-Method-Override', 'Content-Type', 'Accept'],
    credentials: true,

  })
);

//view engine setup 設置模板引擎 ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());  //設置解析 JSON 格式請求體的全局中間件
app.use(express.urlencoded({ extended: false }));  //設置解析 querystring 格式請求體的全局中間件
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



//路由規則設置
app.use('/api', apiRouter); //設置路由規則:設置路由前綴

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Return the error response as JSON
  res.status(err.status || 500).json({
    message: err.message,
    // In production, do not expose stack trace or internal error details
    error: req.app.get('env') === 'development' ? err : {}
  });

  /*
  // render the error page
  res.status(err.status || 500);
  res.render('error');
  */
});

module.exports = app;
