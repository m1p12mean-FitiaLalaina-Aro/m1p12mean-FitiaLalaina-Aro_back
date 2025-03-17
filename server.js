const express = require('express');

require('./config/connect')

const app = express();

app.listen(3000,() => {
    console.log('The server work');
})