// index.js


// init project
import express from 'express';
import cors from "cors";
import formateTimeMid from "./timeFormatterMid.js";

const app = express();



app.use(cors({optionsSuccessStatus: 200}));


app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});



app.get("/api/hello", function (req, res) {
    res.json({greeting: 'hello API'});
});

app.get("/api/",
    (req, res, next) => {
        req.timestamp = Date.now();
        next();
    },
    formateTimeMid,
    (req, res) => {

        res.send({
            unix: parseInt(req.timestamp, 10),
            ...req.formattedTime
        });
    }
)

app.get(/^\/api\/(\w+)$/,//需要括号才能识别参数……
    (req, res, next) => {
        req.timestamp = req.params[0];
       // console.log(`Route /api/\w+: req.params[0] = ${req.params[0]}, req.timestamp = ${req.timestamp}`);
        next();
    },
    formateTimeMid,
    (req, res) => {
        if (req.formattedTime.error) {
            return res.status(400).send(req.formattedTime);
        }
        res.send(req.formattedTime);
    }
);

app.get("/api/:date?",
    formateTimeMid,
    (req, res) => {
        if (req.formattedTime.error) {
            return res.send(req.formattedTime);
        }
        res.send({
            unix: parseInt(req.timestamp, 10),
            ...req.formattedTime,
        });
    }
);

// Listen on port set in environment variable or default to 3000
const listener = app.listen(process.env.PORT || 3000, function () {
    console.log('Your app is listening on port ' + listener.address().port);
});
