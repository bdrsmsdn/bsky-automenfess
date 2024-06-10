const dotenv = require('dotenv');

dotenv.config();

function getEnvString(key) {
    return process.env[key] || 'undefined';
}

module.exports = {
    getEnvString
};
