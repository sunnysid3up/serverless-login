require("dotenv").config();

const CONFIG = {};

CONFIG.app = process.env.APP || "dev";
CONFIG.port = process.env.PORT || "3000";

CONFIG.db_host = process.env.DB_HOST || "localhost";
CONFIG.db_port = process.env.DB_PORT || "3306";
CONFIG.db_name = process.env.DB_NAME || "db-name";
CONFIG.db_user = process.env.DB_USER || "username";
CONFIG.db_password = process.env.DB_PASSWORD || "password";

CONFIG.jwt_encryption = process.env.JWT_ENCRYPTION || "change";
CONFIG.jwt_expiration = process.env.JWT_EXPIRATION || "10000";

module.exports = CONFIG;
