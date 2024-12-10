const User = require('../models/user');
const { hashPassword, comparePassword } = require('../helpers/auth');
const jwt = require ('jsonwebtoken');

const test = (req, res) => {
    res.json('test is working');
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name) {
            return res.json({ error: 'name is required' });
        }
        if (!password || password.length < 6) {
            return res.json({
                error: 'password required and should be at least 6 characters'
            });
        }
        const exist = await User.findOne({ email });
        if (exist) {
            return res.json({
                error: 'email is taken already'
            });
        }

        const hashedPwd = await hashPassword(password); // Rename variable to avoid conflict

        const user = await User.create({
            name,
            email,
            password: hashedPwd, // Use the renamed variable
        });

        return res.json(user);
    } catch (error) {
        console.log(error);
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }); 
        if (!user) {
            return res.json({
                error: 'no user found'
            });
        }
        const match = await comparePassword(password, user.password);
        if (match) {
            jwt.sign({email: user.email, id: user._id, name: user.name}, process.env.JWT_SECRET, {}, (err, token) => {
                if(err) throw err;
                res.cookie('token', token).json(user)
            })
            res.json('passwords match');
        } else {
            res.json({
                error: 'incorrect password'
            });
        }
    } catch (error) {
        console.log(error);
    }
};

const getProfile = (req, res) => {
    const {token} = req.cookies
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, User) => {
            if(err) throw err;
            res.json(User)
        })
    }else{
        res.json(null)
    }

}

module.exports = {
    test,
    registerUser,
    loginUser,
    getProfile
};
