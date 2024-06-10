require('dotenv').config();

module.exports = {
    bskyUrl: process.env.BLUESKY_URL,
    identifier: process.env.BLUESKY_IDENTIFIER,
    password: process.env.BLUESKY_PASSWORD,
    keyword: process.env.KEYWORD
};
