const express = require('express');
const app = express();
const fileupload = require('express-fileupload');
const exphdb = require('express-handlebars');
const cookieParser = require("cookie-parser");
const path = require('path')
const cors = require('cors');
const dotenv = require('dotenv').config();
const dbService = require('./config/database').DbService;

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

// Routes For Users
app.use('/', require('./routes/users/pagesForUsers'));
app.use('/auth', require('./routes/users/authForUsers'));
app.use('/journey', require('./routes/users/userJourney'));

// Routes For Admins
app.use('/manage', require('./routes/admins/pagesForAdmins'))
app.use('/auth/manage', require('./routes/admins/authForAdmins'));
app.use('/manage/letters', require('./routes/admins/manageLetters'));
app.use('/manage/dictionary', require('./routes/admins/manageDictionary'));
app.use('/manage/admins', require('./routes/admins/manageAdmins'));
app.use('/manage/course', require('./routes/admins/manageCourse'));
app.use('/manage/tests', require('./routes/admins/manageTests'));


app.listen(process.env.PORT, () => console.log('App is running'));