const fs = require('fs');
const path = require('path');

const dataFilePath = 'C:/Gopal Sharma-Official/Software/Sportz_Ineractive/data/data.json';

const getUserData = () => {
  try {
    // Read the file synchronously
    let country_Data = {};
    const data = fs.readFileSync(dataFilePath, 'utf8');
    const countriesList = JSON.parse(data);
    country_Data.countries = countriesList.countries.map(item => ({
        rank: item.rank,
        name: item.name,
      }));
    country_Data.uniqueContinent = [...new Set(countriesList.countries.map(item => item.continent))].map(continent => ({
        continent
      }));
    return country_Data;
  } catch (error) {
    console.error('Error reading or parsing the data file:', error);
    throw error;
  }
};
const getUserDataByRank = (id) => {
    try {
      // Read the file synchronously
      const data = fs.readFileSync(dataFilePath, 'utf8');
      const countriesList = JSON.parse(data);
  
      // Check if countriesList has the expected format
      if (!Array.isArray(countriesList.countries)) {
        throw new Error('Invalid data format: countriesList.countries should be an array');
      }
  
      // Find country by ID
      const country = countriesList.countries.find(c => c.rank === parseInt(id));
       console.log("CountriesL:",country);
       const imageUrl = `/images/${country.flag}`;

      if (country) {
        return {
          rank: country.rank,
          name: country.name,
          continent:country.continent,
          flag: country.flag
        };
      } else {
        // If country not found, throw an error
        throw new Error('Country not found');
      }
    } catch (error) {
      console.error('Error reading or parsing the data file:', error);
      throw error;
    }
  };
  const addCountryData = (newCountry,flagFile) => {
    // console.log("Country Data:",newCountry);
    try {
      // Read the file synchronously
      const data = fs.readFileSync(dataFilePath, 'utf8');
      const countriesList = JSON.parse(data);
  
      // Check if countriesList has the expected format
      if (!Array.isArray(countriesList.countries)) {
        throw new Error('Invalid data format: countriesList.countries should be an array');
      }
  
      // Validate that the rank is unique
      const existingCountry = countriesList.countries.find(c => c.rank === newCountry.rank);
      if (existingCountry) {
        throw new Error('Country with this rank already exists.');
      }
      let updateObj = {
        name: newCountry.name,
        continent: newCountry.continent,
        flag: newCountry.flag,
        rank: newCountry.rank
      }
      countriesList.countries.push(updateObj);
  
      // Write the updated list back to the file
      fs.writeFileSync(dataFilePath, JSON.stringify(countriesList, null, 2), 'utf8');
  
      return newCountry;
    } catch (error) {
      console.error('Error writing to the data file:', error);
      throw error;
    }
  };
  const saveFile = (file, destinationPath) => {
    return new Promise((resolve, reject) => {
      fs.writeFile(destinationPath, file.buffer, (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  };
module.exports = {
  getUserData,
  getUserDataByRank,
  addCountryData,
  saveFile
};
