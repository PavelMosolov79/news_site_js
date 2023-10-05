const express = require('express');
const path = require('path');
const browserSync = require('browser-sync').create();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.listen(port, () => {
    console.log(`Сервер запущен на порту http://localhost:${port}`);

    browserSync.init({
        files: ["public/*.html", "public/css/*.css", "public/js/*.js"],
        server: "public",
        port: port + 1,
    });
});