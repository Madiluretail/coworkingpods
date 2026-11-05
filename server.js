
const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets
app.use(express.static(__dirname));

// Redirect .html URLs to clean URLs
app.get("/:page.html", (req, res, next) => {
    res.redirect(301, `/${req.params.page}`);
});

// Serve HTML pages without .html
app.get("/:page", (req, res, next) => {
    const pagePath = path.join(__dirname, `${req.params.page}.html`);

    if (fs.existsSync(pagePath)) {
        return res.sendFile(pagePath);
    }

    next();
});

// Homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// 404 page
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "404.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Website running on port ${PORT}`);
});
