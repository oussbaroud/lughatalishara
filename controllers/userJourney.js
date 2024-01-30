const connection = require('../dbService').connection;

const getUserJourney = (request, response) => {
    let { userId } = request.params;
    async function getData(){
        try {
            userId = parseInt(userId, 10); 
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT sectionId, unitId, levelId, lessonId FROM user_journey WHERE userId = ? ORDER BY sectionId, unitId, levelId, lessonId;";
    
                connection.query(query, [userId], (err, results) => {
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

module.exports = { getUserJourney };