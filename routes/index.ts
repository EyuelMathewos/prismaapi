import express,{ Request, Response} from 'express';

var router = express.Router();


/* GET home page. */
router.get('/', function(req: Request, res: Response) {
    res.send("Express is running");
});

module.exports = router;
