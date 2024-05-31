const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const { User } = require('../models');

router.get("/loginuser", (req, res) => {
    res.render("loginuser");
});
router.post('/loginsuccess', async (req, res) => {
    const { username, password } = req.body;
    try {
        let user;
            user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(400).send('Invalid username or password');
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).send('Invalid username or password');
        }

        req.session.user = {
            id: user.id,
            username: user.username
        };

        res.redirect('/home');
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Internal server error');
    }
});
router.post('/register/user', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        await User.create({ username, password: hashedPassword });
        res.redirect('/user/loginuser');
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
