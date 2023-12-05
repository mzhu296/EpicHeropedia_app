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

app.post('/superheroinfo', (req, res) => {
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

    for (let i = 0; i <= lowerCaseValue.length - lowerCaseSearchTerm.length; i++) {
        const substring = lowerCaseValue.substr(i, lowerCaseSearchTerm.length);
        const distance = [...substring].filter((char, index) => char !== lowerCaseSearchTerm[index]).length;

        if (distance <= 2) {
            return true;
        }
    }
    return false;
}


const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}.`)
})