const userModel = require('../model/userModel');
const jwt = require('jsonwebtoken');
const validName = (name) => /^[a-zA-Z ]{3,20}$/.test(name);
const validMail = (mail) => /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(mail);
const validNumber = (number) => (/^[6-9]{1}?[0-9]{9}$/).test(number);
const validPin = (pin) => (/^[1-9]{1}?[0-9]{5}$/).test(pin);
const validStreet = (street) => /^/.test(street);
const validCity = (city) => /^[a-zA-Z ]{3,20}$/.test(city);
const passwordValidator = require('password-validator');
const validPassword = new passwordValidator();
validPassword
    .is().min(8)
    .is().max(15)
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .has().symbols()
    .not().spaces();

exports.createUser = async function (req, res) {
    try {
        const data = req.body;
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: 'please enter all details to register a user' });

        const { title, name, phone, email, password, address } = data;

        if (!title || title.trim()=="") return res.status(400).send({ status: false, message: 'title is required to register a user' });
        if (!['Mr', 'Mrs', 'Miss'].includes(title)) return res.status(400).send({ status: false, message: 'please enter a valid title for user' });
        if (!name ||name.trim()=="") return res.status(400).send({ status: false, message: 'name is required to register a user' });
        if (!validName(name)) return res.status(400).send({ status: false, message: 'please enter a valid name to register a user' });
        if (!phone) return res.status(400).send({ status: false, message: 'phone is required to register a user' });
        if (!validNumber(phone)) return res.status(400).send({ status: false, message: 'please enter a valid indian phone number to register a user' });
        if (!email || email.trim()=="") return res.status(400).send({ status: false, message: 'email is required to register a use' });
        if (!validMail(email)) return res.status(400).send({ status: false, message: 'please enter a valid email to register a user' });
        if (!password || password.trim()=="") return res.status(400).send({ status: false, message: 'password is required to register a user' });
        if (!validPassword.validate(password)) return res.status(400).send({ status: false, message: 'please choose a strong password' });
        if (address) {
            if (typeof address != 'object' || Object.keys(address).length ==0) return res.status(400).send({ status: false, message: 'please enter address in a valid format' });
            const street = address.street;
            const city = address.city;
            const pincode = address.pincode;
            if (street) {
                if (!validStreet(street)) return res.status(400).send({ status: false, message: 'please enter a valid street name' });
            };
            if (city) {
                if (!validCity(city)) return res.status(400).send({ status: false, message: 'please enter a valid city name' });
            };
            if (pincode) {
                if (!validPin(pincode)) return res.status(400).send({ status: false, message: 'please enter a valid pincode' });
            };
        };
           
        let user = {};
        user = await userModel.findOne({ phone: phone });
        if (user) return res.status(400).send({ status: false, message: 'Phone already exist,use different number' });
        user = await userModel.findOne({ email: email });
        if (user) return res.status(400).send({ status: false, message: 'email already exist,use different email' });

        const userCreated = await userModel.create(data);
        res.status(201).send({ status: true, message: "successful creation ", data: userCreated });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    };
};

exports.loginUser = async function (req, res) {
    try {
        const email = req.body.email;
        const password = req.body.password;
        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, message: 'please enter email and password' });
        if (!email) return res.status(400).send({ status: false, message: 'email is required to login a user' });
        if (!validMail(email)) return res.status(400).send({ status: false, message: 'please enter a valid email to login a user' });
        if (!password) return res.status(400).send({ status: false, message: 'password is required to login a user' });

        const user = await userModel.findOne({ email: email, password: password });
        if (!user) return res.status(404).send({ status: false, message: 'email or password is incorrect' });
    
        const token = jwt.sign({ userId: user._id }, 'key', { expiresIn: '24h' });
        const tokenDetails = jwt.decode(token, 'key');
        res.setHeader('x-api-key', token);
         res.status(200).send({ status: true, message: "successful login  " ,data: { token: token , tokenDetails: tokenDetails} });

    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    };
};
