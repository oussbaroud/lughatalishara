const express = require('express');
const app = express();
const fileupload = require('express-fileupload');
const exphdb = require('express-handlebars');
const cookieParser = require("cookie-parser");
const path = require('path')
const fs = require('fs');
const cors = require('cors');
const dotenv = require('dotenv').config();
const dbService = require('./dbService').DbService;

app.engine('hbs', exphdb.engine({
    extname: '.hbs'
}));
app.set('view engine', 'hbs');

app.use(fileupload());
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : false }));
app.use(express.static(path.join(__dirname, '/public')));

// Rendering Pages
app.use('/', require('./routes/pages'))
app.use('/auth', require('./routes/auth'));

// Create Word
app.post('/words/insert', (request, response) => {
    const { word, file } = request.body;
    let id = path.parse(file).name;
    id = id.replace(/\D/g,'');
    console.log(id);
    const cwid = "cw" + id;
    const wid = "w" + id;

    const db = dbService.getDbServiceInstance();
    const result = db.insertNewWord(id, word, file, cwid, wid);

    result
    .then(data => response.json({ data: data}))
    .catch(err => console.log(err));
});

// Upload File Word
app.post('/words/upload', (request, response) => {
    let sampleFile;
    let uploadPath;

    sampleFile = request.files.myfile;
    uploadPath = __dirname + '/public/words/' + sampleFile.name;

    console.log(sampleFile);

    sampleFile.mv(uploadPath, err => {
        if(err) return console.log(err);

        console.log('File was uploaded');
    });
});

// Read Words
app.get('/words/getAll', (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getAllData();
    
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
})

// Update Word
app.patch('/words/update/:id/:file', (request, response) => {
    const { id, file } = request.body;
    let nid = path.parse(file).name;
    nid = nid.replace(/\D/g,'');
    const cwid = "cw" + nid;
    const wid = "w" + nid;

    const db = dbService.getDbServiceInstance();
    const result = db.updateWordById(id, nid, file, cwid, wid);
    
    result
    .then(data => response.json({success : data}))
    .catch(err => console.log(err));
    
    const deletePath = path.join( __dirname, 'public', 'words', request.params.file);
    fs.unlink(deletePath, (err) => {
        if (err) {
            throw err;
        }
    
        console.log("Delete File successfully.");
    });
});

// Delete Word
app.delete('/words/delete/:id/:file', (request, response) => {
    const { id, file } = request.params;
    console.log(id, file);
    const db = dbService.getDbServiceInstance();
    const result = db.deleteRowById(id);
    
    result
    .then(data => response.json({success : data}))
    .catch(err => console.log(err));

    const deletePath = path.join( __dirname, 'public', 'words', file);
    fs.unlink(deletePath, (err) => {
        if (err) {
            throw err;
        }
    
        console.log("Delete File successfully.");
    });
});

// Search Word
app.get('/words/search/:word', (request, response) => {
    const { word } = request.params;
    const db = dbService.getDbServiceInstance();

    const result = db.searchByWord(word);
    
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
})

// Sort Words
app.get('/words/sort/:letter', (request, response) => {
    const { letter } = request.params;
    const db = dbService.getDbServiceInstance();

    const result = db.sortByLetter(letter);
    
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
})

// Create Letter
app.post('/letters/insert', (request, response) => {
    const { letter, file } = request.body;
    let id = path.parse(file).name;
    id = id.replace(/\D/g,'');
    console.log(id);
    const clid = "cl" + id;
    const lid = "l" + id;

    const db = dbService.getDbServiceInstance();
    const result = db.insertNewLetter(id, letter, file, clid, lid);

    result
    .then(data => response.json({ data: data}))
    .catch(err => console.log(err));
});

// Upload File Letter
app.post('/letters/upload', (request, response) => {
    let sampleFile;
    let uploadPath;

    sampleFile = request.files.myfile;
    uploadPath = __dirname + '/public/letters/' + sampleFile.name;

    console.log(sampleFile);

    sampleFile.mv(uploadPath, err => {
        if(err) return console.log(err);

        console.log('File was uploaded');
    });
});

// Read Letter
app.get('/letters/getAll', (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getAllDataLetters();
    
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
})

// Update Letter
app.patch('/letters/update/:id/:file', (request, response) => {
    const { id, file } = request.body;
    let nid = path.parse(file).name;
    nid = nid.replace(/\D/g,'');
    const clid = "cl" + nid;
    const lid = "l" + nid;

    const db = dbService.getDbServiceInstance();
    const result = db.updateLetter(id, nid, file, clid, lid);
    
    result
    .then(data => response.json({success : data}))
    .catch(err => console.log(err));
    
    const deletePath = path.join( __dirname, 'public', 'letters', request.params.file);
    fs.unlink(deletePath, (err) => {
        if (err) {
            throw err;
        }
    
        console.log("Delete File successfully.");
    });
});

// Delete Letter
app.delete('/letters/delete/:id/:file', (request, response) => {
    const { id, file } = request.params;
    console.log(id, file);
    const db = dbService.getDbServiceInstance();
    const result = db.deleteLetter(id);
    
    result
    .then(data => response.json({success : data}))
    .catch(err => console.log(err));

    const deletePath = path.join( __dirname, 'public', 'letters', file);
    fs.unlink(deletePath, (err) => {
        if (err) {
            throw err;
        }
    
        console.log("Delete File successfully.");
    });
});

// Search Letter
app.get('/letters/search/:letter', (request, response) => {
    const { letter } = request.params;
    const db = dbService.getDbServiceInstance();

    const result = db.searchByLetter(letter);
    
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
})

// Read Admins
app.get('/admins/getAll', (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getAllDataAdmins();
    
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
})

// Update Admins
app.get('/admins/getFullAccess/:id', (request, response) => {
    const { id } = request.params;
    const db = dbService.getDbServiceInstance();
    const result = db.readAdminAccess(id);
    
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
})
app.patch('/admins/update/:id', (request, response) => {
    const { id, fullAccess } = request.body;
    const db = dbService.getDbServiceInstance();
    const result = db.updateAdminAccess(id, fullAccess);
    
    result
    .then(data => response.json({success : data}))
    .catch(err => console.log(err));
});

// Delete Admins
app.delete('/words/delete/:id', (request, response) => {
    const { id } = request.params;
    const db = dbService.getDbServiceInstance();
    const result = db.deleteAdmin(id);
    
    result
    .then(data => response.json({success : data}))
    .catch(err => console.log(err));
});

// Search For Admin
app.get('/words/search/:name', (request, response) => {
    const { name } = request.params;
    const db = dbService.getDbServiceInstance();

    const result = db.searchForAdmin(name);
    
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
})

app.listen(process.env.PORT, () => console.log('app is running'));