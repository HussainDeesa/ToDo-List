const connectToMongo = require('./db')
const express = require('express')
const cors = require('cors')
connectToMongo();
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
// app.get('/',(req,res)=>{
//     res.send('hello')
// })

app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
}

app.listen(port, () => {
    console.log('Listening to ', port);
})