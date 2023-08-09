require("dotenv").config()
const express = require('express')
const app = express()
const port = 5000 || process.env.PORT
const mongoDB = require('./db')
mongoDB();


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://64d34617a4ea5b37f35733d1--bucolic-kulfi-4a9fe5.netlify.app")
    res.header(
        "Access-Control-Allow-Headers",
        "Origin , X-Requested-With, Content-Type, Accept"
    )
    next()
})
app.use(express.json())
app.use('/api', require('./Routes/CreateUser'))
app.use('/api', require('./Routes/DisplayData'))
app.use('/api', require('./Routes/OrderData'))


app.get('/', (req, res) => {
    res.send('Hello World!')
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})