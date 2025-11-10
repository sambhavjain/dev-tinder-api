const express = require('express');
const app = express()
const PORT = 4000


app.use((req, res) => {
    res.send('Server is ready now')
})

app.listen(PORT, () => {
    console.log('server is listening on http://localhost:'+PORT)
})
