import express,{ Request, Response, NextFunction} from 'express';
var app = express();
var path = require('path');
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var itemRouter = require("./routes/item");
var orderRouter = require("./routes/order");
import {defineAbilitiesFor}  from './accesscontrol/defineAbility';
var jwt = require('jsonwebtoken'); 
const port = 3000


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const myLogger =  function(req:Request, res:Response, next:NextFunction) {
//   const bearerHeader = req.headers['authorization'];
// if(bearerHeader != null){
//   console.log(bearerHeader);
//   const bearer = bearerHeader?.split(' ');
//   const bearerToken = bearer[1];

//   var decoded = jwt.decode(bearerToken);
//   console.log(decoded) // bar
//   res.setHeader("token", bearerToken);
  console.log('LOGGED');
  const user:any = 1 ;
  const ability = defineAbilitiesFor(user);
  console.log("ability "+ability.can('delete', 'User'));

  next()
//}

}

app.use(myLogger)

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/items', itemRouter);
app.use('/orders', orderRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })