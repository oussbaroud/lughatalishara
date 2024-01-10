const connection = require('../dbService').connection;

const getSections = (request, response) => {
    async function getData(){
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT section_number, section_title FROM content ORDER BY section_number ASC;";
    
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
    
    getData()
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
}

const getUnits = (request, response) => {
    const { sectionNumber } = request.params;
    async function getData(){
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT unit_number, unit_title FROM content WHERE section_number = ? ORDER BY unit_number ASC;";
    
                connection.query(query, [sectionNumber], (err, results) => {
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
    
    getData()
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
}

const getLevels = (request, response) => {
    const { sectionNumber, unitNumber } = request.params;
    async function getData(){
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT level_number, level_title FROM content WHERE section_number = ? AND unit_number = ? ORDER BY level_number ASC;";
    
                connection.query(query, [sectionNumber, unitNumber], (err, results) => {
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
    
    getData()
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
}

const getLessons = (request, response) => {
    const { sectionNumber, unitNumber, levelNumber } = request.params;
    async function getData(){
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT lesson_number, lesson_title FROM content WHERE section_number = ? AND unit_number = ? AND level_number =? ORDER BY lesson_number ASC;";
    
                connection.query(query, [sectionNumber, unitNumber, levelNumber], (err, results) => {
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
    
    getData()
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
}

const getContent = (request, response) => {
    const { sectionNumber, unitNumber, levelNumber, lessonNumber } = request.params;
    async function getData(){
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT content_number, category, type, content FROM content WHERE section_number = ? AND unit_number = ? AND level_number =? AND lesson_number = ? ORDER BY content_number ASC;";
    
                connection.query(query, [sectionNumber, unitNumber, levelNumber, lessonNumber], (err, results) => {
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
    
    getData()
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
}

module.exports = {
    getSections,
    getUnits,
    getLevels,
    getLessons,
    getContent
};