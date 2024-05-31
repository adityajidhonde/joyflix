const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Admin } = require('../models');

router.get("/loginadmin", (req, res) => {
    res.render("loginadmin");
});
router.post('/loginsuccess', async (req, res) => {
    const { username, password } = req.body;
    try {
        let admin;
            admin = await Admin.findOne({ where: { username } });

        if (!admin) {
            return res.status(400).send('Invalid username or password');
        }

        const validPassword = await bcrypt.compare(password, admin.password);
        if (!validPassword) {
            return res.status(400).send('Invalid username or password');
        }

        req.session.admin = {
            id: admin.id,
            username: admin.username
        };

        res.redirect('/admin');
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Internal server error');
    }
});
router.post('/register/admin', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        await Admin.create({ username, password: hashedPassword });
        res.redirect('/admin/loginadmin');
    } catch (error) {
        console.error('Error registering admin:', error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
