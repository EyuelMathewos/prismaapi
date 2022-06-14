import express, { Request, Response, NextFunction } from 'express';
var app = express();
var path = require('path');
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var itemRouter = require("./routes/item");
var orderRouter = require("./routes/order");


const { auth } = require('express-openid-connect');

const port = 3000


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
interface CustomRequest extends Request {
  oidc ? : any
}

const config = {
  authRequired: false,
  auth0Logout: true,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  secret: process.env.SECRET
};
app.use(auth(config));


app.get('/', (req:CustomRequest, res:Response) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out')
});

app.use('/home', indexRouter);
app.use('/users', usersRouter);
app.use('/items', itemRouter);
app.use('/orders', orderRouter);

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})