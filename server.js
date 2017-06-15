var express = require('express');
var path = require('path');
var app = express();

app.use('/', express.static(path.join(__dirname, 'public')));

app.get('*', function (req, res, error) {
    res.sendFile('public/index.html', {root: path.join(__dirname)});
});

app.listen(3000, function () {
    console.log('Listening at port 3000');
});
