
const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Redirect old .html URLs to clean URLs
app.use((req, res, next) => {
    const match = req.path.match(/^\/([a-zA-Z0-9_-]+)\.html$/);

    if (match) {
        return res.redirect(
            301,
            `/${match[1]}${req.url.slice(req.path.length)}`
        );
    }

    next();
});

// Homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Clean URLs: /amenities, /about, /contact
app.get("/:page", (req, res, next) => {
    const page = req.params.page;

    if (!/^[a-zA-Z0-9_-]+$/.test(page)) {
        return next();
    }

    const filePath = path.join(__dirname, `${page}.html`);

    if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
    }

    next();
});

// Serve CSS, JavaScript, images and other static files
app.use(express.static(__dirname));

// 404
app.use((req, res) => {
    res.status(404).send("Page not found");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Website running on port ${PORT}`);
});
