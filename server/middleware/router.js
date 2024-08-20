const express = require('express');
const router = express.Router();
const userService = require('../services/userServices');
const multer = require('multer');
const path = require('path');


const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 4 * 1024 * 1024 }, // 4MB file size limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only .jpg and .png files are allowed!'));
    }
  }
});



// GET route to fetch all country data
router.get('/countries', (req, res) => {
  try {
    const countries = userService.getUserData();
    console.log("Data::::::>>>>>", countries);
    res.json(countries);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET route to fetch country data by ID (rank)
router.get('/countries/:id', (req, res) => {
  const id = req.params.id;
  try {
    const country = userService.getUserDataByRank(id); 
    console.log("Id Received:", country);
    res.json(country); 
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST route to handle file upload and save country data
router.post('/countries', upload.single('image'), async (req, res) => {
  try {
    const { name, rank,continent } = req.body;
    const flagFile = req.file; 
    if (!name || !rank ) {
      return res.status(400).json({ message: 'Name, rank, and flag are required.' });
    }
    const countryData = {
      name: name,
      rank: parseInt(rank, 10),
      continent:continent,
      flag:`images/${flagFile.originalname}`, // Save the uploaded file's filename
    };
    const flagFilePath = path.join('C:/Gopal Sharma-Official/Software/Sportz_Ineractive/images', flagFile.originalname);

    const newCountry = await userService.addCountryData(countryData,flagFile);
    await userService.saveFile(flagFile,flagFilePath);
    // Move the file to the final directory
   
    res.status(201).json(newCountry);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
