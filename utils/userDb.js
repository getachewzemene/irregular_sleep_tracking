var mysql = require('mysql2');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    port: '3308',
    database: 'users_db'
});
connection.connect(function(error) {
    if (!!error) {
        console.log(error);
    } else {
        console.log('Connected!:)');
    }
});
module.exports = connection;