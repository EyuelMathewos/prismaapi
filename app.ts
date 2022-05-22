var express = require('express');
var app = express();
var path = require('path');
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var itemRouter = require("./routes/item");
var orderRouter = require("./routes/order");
const port = 3000

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/items', itemRouter);
app.use('/orders', orderRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })