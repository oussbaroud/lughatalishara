const mysql = require('mysql');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});

connection.connect((err) => {
    if (err) {
        console.log(err.message);
    }
    // console.log('db ' + connection.state);
});


class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }

    // Selecting All Words
    async getAllData() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM words ORDER BY id ASC;";

                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            // console.log(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    // Inserting Word
    async insertNewWord(id, word, file, cwid, wid) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "INSERT INTO words (id, word, file, cwid, wid) VALUES (?,?,?,?,?);";

                connection.query(query, [id, word, file, cwid, wid] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                })
            });
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
        }
    }

    // Deleting Word
    async deleteRowById(id) {
        try {
            id = parseInt(id, 10); 
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM words WHERE id = ?";
    
                connection.query(query, [id] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    // Update Word
    async updateWordById(id, nid, file, cwid, wid) {
        try {
            id = parseInt(id, 10); 
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE words SET id = ?, file = ?, cwid = ?, wid = ? WHERE id = ?";
    
                connection.query(query, [nid, file, cwid, wid, id] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    // Search For A Word
    async searchByWord(word) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `SELECT * FROM words WHERE word LIKE '%${word}%' ORDER BY word ASC;`;

                connection.query(query, [word], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }

    // Selecting All Letters
    async getAllDataLetters() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM letters ORDER BY id ASC;";

                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            // console.log(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    // Inserting Letter
    async insertNewLetter(id, letter, file, clid, lid) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "INSERT INTO letters (id, letter, file, clid, lid) VALUES (?,?,?,?,?);";

                connection.query(query, [id, letter, file, clid, lid] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                })
            });
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
        }
    }

    // Deleting Letter
    async deleteLetter(id) {
        try {
            id = parseInt(id, 10); 
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM letters WHERE id = ?";
    
                connection.query(query, [id] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    // Update Letter
    async updateLetter(id, nid, file, clid, lid) {
        try {
            id = parseInt(id, 10); 
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE letters SET id = ?, file = ?, clid = ?, lid = ? WHERE id = ?";
    
                connection.query(query, [nid, file, clid, lid, id] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    // Search For A Letter
    async searchByLetter(letter) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `SELECT * FROM letters WHERE letter LIKE '%${letter}%' ORDER BY letter ASC;`;

                connection.query(query, [letter], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = {
    connection,
    DbService
};