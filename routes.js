var router = require('express').Router(); //for routing HTTP Requests POST,GET,PUT,DELETE
const { json } = require('express');
const { isMoment } = require('moment');
var moment = require('moment'); //for manipulating date and times
var dbConn = require('./utils/userDb');
router.get('/', (req, res, next) => {
    res.render('dashboard.html', { message: req.session.user });
});

router.get('/userPage', (req, res) => {
    if (!req.session.userId) {
        res.render('login.html', { message: "not login yet. login first" });
    } else {
        try {
            dbConn.query('SELECT *from sleep_entries', (err, data, fields) => {
                if (err) throw err;
                if (data && data.length >= 1) {
                    var sleepData = JSON.stringify(data);
                    res.render('userPage.html', { data: sleepData, message: req.session.user });
                } else {
                    res.render('/userPage', { message: 'no data in the database' });
                }
            })
        } catch (e) {
            throw e;
        }
    }
});
router.get('/chartData', (req, res) => {
    try {
        dbConn.query('SELECT *from sleep_entries', (err, data, fields) => {
            if (err) throw err;
            if (data && data.length >= 1) {
                var sleepData = JSON.stringify(data);
                res.json(sleepData);
                // console.log(sleepData);
            } else {
                res.render('/userPage', { message: 'no data in the database' });
            }
        })
    } catch (e) {
        throw e;
    }
});
router.post('/addSleepEntries', (req, res) => {
    var sleepDate = moment(req.body.sleepDate).format("YYYY-MM-DD");
    var time1 = req.body.sleepTime;
    var time2 = req.body.wakeUpTime;
    var sleepTime = moment(time1, "HH:mm:ss a");
    var wakeUpTime = moment(time2, "HH:mm:ss a");
    var duration = moment.duration(wakeUpTime.diff(sleepTime));
    var hours = parseInt(duration.asHours());
    var minutes = parseInt(duration.asMinutes()) % 60;
    var sleepDuration = moment(hours, 'hours').add(minutes, 'minutes').format("HH:mm:ss");
    var sDate = sleepDate.toString();
    var sTime = time1.toString();
    var wTime = time2.toString();
    var sDuration = sleepDuration.toString();
    console.log(sDate);
    console.log(sTime);
    console.log(wTime);
    console.log(sDuration);
    try {
        var sql = `INSERT INTO sleep_entries (sleep_date,sleep_duration,sleep_time, wake_up_time) VALUES(?, ?, ?, ?)`;
        dbConn.query(sql, [sDate, sDuration, sTime, wTime], (err, data) => {
            if (err) throw err;
            // res.setHeader('Content-Type', 'application/json');
            // res.send("data inserted successfully");
            console.log('add sleep entries post request success ' + 'Date:' + sDate + ' Sleep Time:' + sTime + ' Wake Up Time: ' +
                wTime + ' Sleep Duration:' + sDuration);
            res.render('/userPage', { message: 'data inserted success' }); // redirect to user page after inserting the data
        });
    } catch (e) {
        throw e;
    }
});

router.get('/login', (req, res) => {
    res.render('login.html');
});
router.post('/login', (req, res) => {
    console.log('login post request');
    var username = req.body.email;
    var password = req.body.password;
    try {
        var sql = "SELECT *from users where email =?";
        dbConn.query(sql, [username], (err, results, fields) => {
            if (err) throw err;
            if (results && results.length >= 1) {
                //console.log(results[0].email);
                if (results[0].password == password && results[0].email == username) {
                    req.session.userId = results[0].id;
                    req.session.user = results[0].first_name;
                    req.session.password = results[0].password;
                    res.redirect('/userPage');
                } else {
                    console.log('username or password not correct try another');
                    // res.setHeader('Content-Type', 'application/json');
                    // res.send('');
                    res.redirect(307, '/login');
                }
            } else {
                console.log('error fetching data');
                res.redirect(302, '/login');
            }
        });
    } catch (err) {
        throw err;
    }
});
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});
router.get('/register', (req, res) => {
    res.render('register.html');
});
router.post('/register', (req, res, next) => {
    // store all the user input data
    var first_name = req.body.firstName;
    var last_name = req.body.lastName;
    var email = req.body.email;
    var password = req.body.password;
    var phone = req.body.phone;
    var gender = req.body.sex;
    var checkEmail;
    // console.log(first_name, last_name, email, password, gender, phoneNumber);
    // res.redirect('/login.html');
    try {
        var fetchSql = 'select *from users where email =?';
        dbConn.query(fetchSql, [email], (err, rows, field) => {
            if (err) throw err;
            if (rows && rows.length >= 1) {
                checkEmail = rows[0].email;
                //console.log(email);
            }
            if (checkEmail === email) {
                console.log('email already in use try another email');
                res.redirect('/register');
            } else {
                // insert user data into users table
                var sql = `INSERT INTO users (first_name, last_name, email, password, phone, gender) VALUES(?, ?, ?, ?, ?, ?)`;
                dbConn.query(sql, [first_name, last_name, email, password, phone, gender], (err, data) => {
                    if (err) throw err;
                    console.log("data inserted successfully");
                    res.redirect(307, '/login'); // redirect to user login page after inserting the data
                });
            }

        });

    } catch (e) {
        throw e;
    }
});
router.get('/adminPage', async(req, res) => {
    if (!req.session.admin) {
        res.render('dashboard.html', { message: 'unable to login as admin' });
    } else {
        try {
            dbConn.query('select first_name,last_name from users ', (err, data, field) => {
                if (err) throw err;
                if (data.length >= 1) {
                    var firstName = data[0].first_name;
                    var lastName = data[0].last_name;
                    var fullName = firstName + ' ' + lastName;
                    console.log(fullName);
                    res.render('adminPage.html', { message: fullName });
                }
            });
            res.render('adminPage.html', { message: "No user found" });
        } catch (e) {
            throw e;
        }
    }
});
router.post('/adminLogin', async(req, res) => {
    if (req.body.name === 'getch' || req.body.password == 'gk1221') {
        req.session.admin == req.body.name;
        req.session.password = req.body.password;
        res.render('adminPage.html');
    } else {
        res.render('dashboard.html', { message: 'error admin login try another' });
    }
});
router.get('/forgot', (req, res) => {
    res.render('forget.html');
});
router.get('/about', (req, res) => {
    res.render('about.html');
})
module.exports = router;