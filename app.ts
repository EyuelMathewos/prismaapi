import express, { Request, Response, NextFunction } from 'express';
const app = express();
const path = require('path');
const jwt = require('jsonwebtoken');
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const itemRouter = require("./routes/item");
const orderRouter = require("./routes/order");
const accessListRouter = require("./routes/accesslist");
const rolesRouter = require("./routes/roles");
const permissionRouter = require("./routes/permissions");
import { defineAbilitiesFor } from './accesscontrol/accesscontrol';
const { getUserRoles } = require("./service/auth")
const { interpolate } = require('./service/interpolate');



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

async function myLogger(req: CustomRequest, res: Response, next: NextFunction) {
  const bearerHeader = req.headers['authorization'];
  if (bearerHeader != null) {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];

    var decoded = jwt.decode(bearerToken);
    res.setHeader("token", bearerToken);
    let user= { id : 1 };
    const usersPermissions = await getUserRoles(decoded.clientId);
    console.log("user permissions")
    console.log(usersPermissions)
    let replacedIdAttribute =interpolate(JSON.stringify(usersPermissions),{user});
    console.log("user replacedIdAttribute")
    console.log(replacedIdAttribute)
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
app.use('/accesslist', accessListRouter);
app.use('/roles', rolesRouter);
app.use('/permissions', permissionRouter);


module.exports = app;