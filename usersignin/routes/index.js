var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/', function (req, res, next) {
	return res.render('index.ejs');
});


router.post('/', function (req, res, next) {
	console.log(req.body);
	var personInfo = req.body;


	if (!personInfo.email || !personInfo.username || !personInfo.password ) {
		res.send();
	} else {


		User.findOne({ email: personInfo.email }, function (err, data) {
			if (!data) {
				var c;
				User.findOne({}, function (err, data) {

					if (data) {
						console.log("if");
						c = data.unique_id + 1;
					} else {
						c = 1;
					}

					var newPerson = new User({
						unique_id: c,
						email: personInfo.email,
						username: personInfo.username,
						password: personInfo.password,
					});

					newPerson.save(function (err, Person) {
						if (err)
							console.log(err);
						else
							console.log('Success');
					});

				}).sort({ _id: -1 }).limit(1);
				res.send({ "Success": "You are regestered,You can login now." });
			} else {
				res.send({ "Success": "Email is already used." });
			}

		});

	}
});

router.get('/login', function (req, res, next) {
	return res.render('login.ejs');
});

router.post('/login', function (req, res, next) {
	//console.log(req.body);
	User.findOne({ email: req.body.email }, function (err, data) {
		if (data) {

			if (data.password == req.body.password) {
				//console.log("Done Login");
				req.session.userId = data.unique_id;
				//console.log(req.session.userId);
				res.send({ "Success": "Success!" });

			} else {
				res.send({ "Success": "Wrong password!" });
			}
		} else {
			res.send({ "Success": "This Email Is not regestered!" });
		}
	});
});

router.get('/profile', function (req, res, next) {
	console.log("profile");
	User.findOne({ unique_id: req.session.userId }, function (err, data) {
		console.log("data");
		console.log(data);
		if (!data) {
			res.redirect('/')
		} else {
			//console.log("found");
			return res.render('data.ejs', { "name": data.username, "email": data.email });
		}
	});
});
function onSignIn(googleUser) {
	var profile = googleUser.getBasicProfile();
	console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
	console.log('Name: ' + profile.getName());
	console.log('Image URL: ' + profile.getImageUrl());
	console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  }

module.exports = router;