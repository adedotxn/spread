const express = require('express')
const app = express()
const fs = require('fs')
app.use(express.json());

const {parse} = require('csv-parse')
// const parser = parse({columns: true}, function (err, records) {
// 	console.log("data =",records);
// });
// fs.createReadStream(__dirname+'/Book2.csv').pipe(parser);




const PORT = 5001 || process.env.PORT

app.post("/server", (req, res) => {
    const parser = parse({columns: true}, function (err, records) {
        // res.send("data =",records);
        res.status(200).send(records)
    });
    fs.createReadStream(__dirname+'/Book2.csv').pipe(parser);
})

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`)
})