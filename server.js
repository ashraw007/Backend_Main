const express = require('express')
const app = express()
const PORT = process.env.PORT
require('./src/database/connect')
const cors = require('cors')
var cookieParser = require('cookie-parser');
const path = require('path')


const studentGETRoutes = require('./src/Routes/studentRoutes/studentGET')
const studentLoginRoutes = require('./src/Routes/studentRoutes/studentLogin')
const studentRequestRoutes = require('./src/Routes/requestRoutes/student/request')
const studentPayRoutes = require('./src/Routes/receiptRoutes/student/receipt')

const adminStudentRoutes = require('./src/Routes/admin/studentUpdate/student')
const adminStudentDetailRoutes = require('./src/Routes/admin/detailedStudents/student')
const adminSuSubjectRoutes = require('./src/Routes/subjectRoutes/suAdminSubject')
const adminSiteSettingsRoutes = require('./src/Routes/admin/siteSettings/siteSettings')
const adminSiteSettingsInitRoutes = require('./src/Routes/admin/siteSettings/suSiteSettingsInit')
const adminReceiptsRoutes = require('./src/Routes/receiptRoutes/admin/receipt')
const adminSuReceiptsRoutes = require('./src/Routes/receiptRoutes/admin/suAdminReceipt')
const adminRequestRoutes = require('./src/Routes/requestRoutes/admin/request')
const paymentsHooks = require('./src/Routes/receiptRoutes/Hooks/hooks')
const adminSuRoutes = require('./src/Routes/suAdminRoutes/suAdmin')
const adminLoginRoutes = require('./src/Routes/admin/admin')
const adminHomeRoutes = require('./src/Routes/admin/Home/home')
const adminLoggerRoutes = require('./src/logger/getLogger')


var allowedOrigins = ['https://gtbpi-exam.herokuapp.com' ];

app.use(cors({
    origin: function (origin, callback) {    // allow requests with no origin 
        // (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        } return callback(null, true);
    },
    credentials: true
}));

var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}


app.use(allowCrossDomain)

app.disable('x-powered-by')
app.use(express.json())

app.use(cookieParser());


app.use((req,res,next)=>{
    if (req.headers['x-forwarded-proto'] !== 'https')
            // the statement for performing our redirection
            return res.redirect('https://' + req.headers.host + req.url);
    else 
        return next();
})


app.use('/api/student/auth', studentLoginRoutes)
app.use('/api/student/get', studentGETRoutes)
app.use('/api/student/fee', studentPayRoutes)
app.use('/api/student/request', studentRequestRoutes)

app.use('/payments/hooks', paymentsHooks)

app.use('/api/admin/home', adminHomeRoutes)
app.use('/api/admin/auth', adminLoginRoutes)
app.use('/api/admin/student', adminStudentRoutes)
app.use('/api/admin/detailStudent', adminStudentDetailRoutes)

app.use('/api/admin/settings', adminSiteSettingsRoutes)
app.use('/api/admin/settings/init', adminSiteSettingsInitRoutes)

app.use('/api/admin/receipts', adminReceiptsRoutes)
app.use('/api/admin/su/receipts', adminSuReceiptsRoutes)

app.use('/api/admin/request', adminRequestRoutes)

app.use('/api/admin/su/subject', adminSuSubjectRoutes)
app.use('/api/admin/logs', adminLoggerRoutes)

app.use('/api/admin/su', adminSuRoutes)


app.use('/admin/', express.static(path.join(__dirname, 'admin')))
app.get('/admin/*', (req, res) => {
    res.sendFile(path.join(__dirname, './admin', 'index.html'));
})

app.use('/', express.static(path.join(__dirname, 'student')))
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'student', 'index.html'));
})


app.listen(PORT, () => {
    console.log('server is listening on port: ', PORT)
})