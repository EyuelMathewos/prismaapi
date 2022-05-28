import express, { Request, Response, NextFunction } from 'express';
var app = express();
var path = require('path');
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var itemRouter = require("./routes/item");
var orderRouter = require("./routes/order");
import { defineAbilitiesFor } from './accesscontrol/accesscontrol';
var jwt = require('jsonwebtoken');
const port = 3000


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
interface CustomRequest extends Request {
  ability ? : any
}

function myLogger(req: CustomRequest, res: Response, next: NextFunction) {
  const bearerHeader = req.headers['authorization'];
  if (bearerHeader != null) {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];

    var decoded = jwt.decode(bearerToken);
    res.setHeader("token", bearerToken);

  }
  const ANONYMOUS_ABILITY = defineAbilitiesFor(0)
  req.ability = decoded != null ? defineAbilitiesFor(decoded.role) : ANONYMOUS_ABILITY

  next()
}

app.use(myLogger)

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/items', itemRouter);
app.use('/orders', orderRouter);

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})