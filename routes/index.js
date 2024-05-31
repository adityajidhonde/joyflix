const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const multer = require("multer");
const { Series } = require('../models');
const { Movies } = require('../models');


router.get("/", (req, res) => {
    res.render("loginuser");
});

router.get("/register", (req, res) => {
    const role = req.query.role;
    res.render('register', { role });
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error logging out:', err);
            res.status(500).send('Internal server error');
        } else {
            res.redirect('/');
        }
    });
});


router.get("/home", (req, res) => {
    if (!req.session.user && !req.session.admin) {
        return res.redirect('/user/loginuser');
    }
    res.render("home", { title: "Home Page" });
});

router.get("/videoplayer/:type/:id", async(req, res) => {
    const id = req.params.id; 
    const type = req.params.type; 
    res.render("videoplayer",{type,id});
});

router.get("/serieslive", async(req, res) => {
    if (!req.session.user && !req.session.admin) {
        return res.redirect('/user/loginuser');
    }
    const tvseries = await Series.findAll();
    res.render("tvshows", {tvseries} );
});

router.get("/movieslive", async(req, res) => {
    if (!req.session.user && !req.session.admin) {
        return res.redirect('/user/loginuser');
    }
    const tvseries = await Movies.findAll();
    res.render("movietime", {tvseries} );
});

//stream video when requested for home
router.get("/video/:type/:id", async (req, res) => {
    const range = req.headers.range;
    const { type, id } = req.params;


    if (!range) {
        return res.status(400).send("Requires Range header");
    }

    let videoPath;
    try {
        if (type === "movies") {
            const movie = await Movies.findByPk(id);
            if (!movie) {
                return res.status(404).send("Movie not found");
            }
            videoPath = path.join(__dirname, 'public', 'movies', `${movie.name}.mp4`);
        } else if (type === "series") {
            const series = await Series.findByPk(id);
            if (!series) {
                return res.status(404).send("Series not found");
            }
            videoPath = path.join(__dirname, 'public', 'series', `${series.name}.mp4`);
        } else {
            return res.status(400).send("Invalid type");
        }

        const videoSize = fs.statSync(videoPath).size;
        const CHUNK_SIZE = 10 ** 6; // 1MB
        const start = Number(range.replace(/\D/g, ""));
        const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

        const contentLength = end - start + 1;
        const headers = {
            "Content-Range": `bytes ${start}-${end}/${videoSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength,
            "Content-Type": "video/mp4",
        };

        res.writeHead(206, headers);

        const videoStream = fs.createReadStream(videoPath, { start, end });
        videoStream.pipe(res);

    } catch (error) {
        console.error("Error streaming video:", error);
        res.status(500).send("Internal server error");
    }
});

  

// Use body-parser middleware
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Configure Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const videoType = req.body.flag;
        let uploadPath = videoType === "0" ? 'public/movies' : 'public/series';
        cb(null, path.join(__dirname, uploadPath));
    },
    filename: function (req, file, cb) {
        const videoType = req.body.flag;
        let filename = videoType === "0" ? `${req.body.mname}.mp4` : `${req.body.sname}.mp4`;
        cb(null, filename);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 * 1024 } // 10GB limit
});


// Route to display admin page with data
router.get("/admin", async (req, res) => {
    if (!req.session.admin) {
        return res.redirect('/admin/loginadmin');
    }
    try {
        const movies = await Movies.findAll();
        const series = await Series.findAll();
        res.render('admin', { movies, series });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal server error');
    }
});

// Route to handle video upload
router.post('/admin/upload', upload.single('videoFile'), async (req, res) => {
    const videoType = req.body.flag;
    console.log(videoType);
    if (!req.session.admin) {
        return res.redirect('/admin/loginadmin');
    }
    try {
        if (videoType === "0") {
            await Movies.create({
                name: req.body.mname,
                genre: req.body.mgenre,
                description: req.body.mdesc,
                cast: req.body.mcast,
                type: req.body.mtype,
                link: (path.join(__dirname,'public/movies/'))+(req.body.mname)+(".mp4")
            });
        } else if (videoType === "1") {
            const nap = req.body.sparts ? req.body.sparts : 0;
            await Series.create({
                name: req.body.sname,
                genre: req.body.sgenre,
                description: req.body.sdesc,
                cast: req.body.scast,
                type: req.body.stype,
                no_of_episodes: nap,
                link: (path.join(__dirname,'public/series/'))+(req.body.sname)+(".mp4")
            });
        }
        res.redirect('/admin');
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).send('Internal server error');
    }
});

// Route to handle video deletion
router.delete('/admin/delete/:id', async (req, res) => {
    const database = req.query.database;
    const id = req.params.id;
    console.log(`Deleting ${database} record with ID: ${id}`);
    if (!req.session.admin) {
        return res.redirect('/admin/loginadmin');
    }
    try {
        if (database === "Movies") {
            const movie = await Movies.findByPk(id);
            if (movie) {
                const filePath = path.join(__dirname, 'public', 'movies', `${movie.name}.mp4`);
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                    }
                });
                await movie.destroy();
            }
        } else if (database === "Series") {
            const series = await Series.findByPk(id);
            if (series) {
                const filePath = path.join(__dirname, 'public', 'series', `${series.name}.mp4`);
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                    }
                });
                await series.destroy();
            }
        }
        res.status(200).send({ message: 'Record deleted successfully' });

    } catch (error) {
        console.error('Error deleting data:', error);
        res.status(500).send('Internal server error');
    }
});


module.exports = router;
