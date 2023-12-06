require('dotenv').config();
const UserModel = require('./models/user');
const { hashPassword } = require('./hash/auth'); 
const superheroInfo = require('./superhero_info.json');
const superheroPowers = require('./superhero_powers.json');
const express = require('express');
const cors = require("cors");
const { mongoose } = require('mongoose');
const cookieParser = require('cookie-parser')
const app = express();

//database connection
mongoose.connect(`mongodb://localhost:27017/database`)
    .then(() => {
        console.log("Database Connected :)");
        initializeAdminAccount(); 
    })
    .catch((err) => {
        console.log("Database not connected :(" + err);
    })
app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true
    })
);

async function initializeAdminAccount() {
    try {
        const adminExists = await UserModel.findOne({ email: process.env.ADMIN_EMAIL });
        if (!adminExists) {
            const hashedPassword = await hashPassword(process.env.ADMIN_PASSWORD);
            const adminUser = new UserModel({
                name: process.env.ADMIN_NAME,
                email: process.env.ADMIN_EMAIL,
                password: hashedPassword, // use the hashed password here
            });

            await adminUser.save();
            console.log('Admin account created'); 
        }
    } catch (err) {
        console.error('Error creating admin account:', err);
    }
}

//middleware
app.use(express.json())
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }))

app.use('/', require('./routes/authRoutes'));

app.post('/api/superheroinfo', (req, res) => {
    const { name, race, publisher, power } = req.body;

    let filteredSuperheroes = superheroInfo;

    if (name) {
        filteredSuperheroes = filteredSuperheroes.filter(hero => isMatch(hero.name, name));
    }

    if (race) {
        filteredSuperheroes = filteredSuperheroes.filter(hero => isMatch(hero.Race, race));
    }

    if (publisher) {
        filteredSuperheroes = filteredSuperheroes.filter(hero => isMatch(hero.Publisher, publisher));
    }

    let results = filteredSuperheroes.map(hero => {
        let matchingPower = superheroPowers.find(e => isMatch(e.hero_names, hero.name));
        return matchingPower ? { ...hero, powers: matchingPower } : hero;
    });

    if (power) {
        let matchingPowerNames = superheroPowers
            .filter(heroPower => heroPower[power] === "True")
            .map(heroPower => heroPower.hero_names);

        results = results.filter(hero => matchingPowerNames.includes(hero.name));
    }

    if (results.length > 0) {
        res.json(results);
    } else {
        res.status(404).send('No matching superheroes found.');
    }
});

function isMatch(value, searchTerm) {
    const lowerCaseValue = value.toLowerCase();
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    // Improved loop condition for efficiency
    for (let i = 0; i <= lowerCaseValue.length - lowerCaseSearchTerm.length; i++) {
        let distance = 0;

        // Iterate over the characters of the searchTerm
        for (let j = 0; j < lowerCaseSearchTerm.length; j++) {
            // Increment distance if characters do not match
            if (lowerCaseValue[i + j] !== lowerCaseSearchTerm[j]) {
                distance++;
            }

            // Break early if distance exceeds 2
            if (distance > 2) {
                break;
            }
        }

        // Return true if a match is found within the allowed distance
        if (distance <= 2) {
            return true;
        }
    }
    // Return false if no match is found
    return false;
}

let superheroLists = {};//list that store superhero data

app.post('/api/superhero-lists', (req, res) => {
    const { name, description = '', superheroId, visibility = 'private' } = req.body;
  
    if (!name || !superheroId) {
      return res.status(400).send('Name and superheroId are required.');
    }
  
    if (superheroLists[name]) {
      return res.status(409).send('A list with this name already exists.');
    }
  
    superheroLists[name] = { name, description, superheroId, visibility };
    res.status(201).send(`List '${name}' created successfully.`);
  });

  app.get('/api/superhero-lists', (req, res) => {
    const listSummaries = Object.keys(superheroLists).map(key => ({
      name: superheroLists[key].name,
      visibility: superheroLists[key].visibility
    }));
    res.json(listSummaries);
  });
  
  async function getSuperheroInfoById(superheroIds) {
    const superheroDetails = await Promise.all(superheroIds.map(async (id) => {
      const superhero = superheroInfo.find(hero => hero.id.toString() === id.toString());
      if (superhero) {
        const powers = superheroPowers.find(power => power.hero_names.toLowerCase() === superhero.name.toLowerCase());
        return {
          info: superhero,
          powers: powers ? Object.keys(powers).filter(power => powers[power] === 'True') : []
        };
      }
      return null;
    }));
  
    return superheroDetails.filter(Boolean);
  }
  
  app.get('/api/superhero-lists/:name', async (req, res) => {
    const list = superheroLists[req.params.name];
  
    if (!list) {
      return res.status(404).send('List not found.');
    }
  
    // Split the list of hero IDs and trim whitespace
    const superheroIds = list.superheroId.split(',').map(id => id.trim());
  
    try {
      const superheroDetails = await getSuperheroInfoById(superheroIds);
      res.json({ ...list, heroes: superheroDetails });
    } catch (error) {
      console.error('Error fetching superhero details:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  
const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}.`)
})