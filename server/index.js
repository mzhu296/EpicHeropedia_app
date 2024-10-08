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
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Database Connected :)");
        initializeAdminAccount(); 
    })
    .catch((err) => {
        console.log("Database not connected :(" + err);
    })
app.use(
    cors({
        origin: process.env.REACT_APP_ORIGIN,
        credentials: true
    })
);

async function initializeAdminAccount() {
    try {
        const adminEmail = 'admin@gmail.com';
        const adminExists = await UserModel.findOne({ email: adminEmail });
        if (!adminExists) {
            const hashedPassword = await hashPassword(process.env.ADMIN_PASSWORD);
            const adminUser = new UserModel({
                name: process.env.ADMIN_NAME,
                email: adminEmail,
                password: hashedPassword,
                role: 'admin' // Set the role to admin
            });

            await adminUser.save();
            console.log('Admin account created');
        }
    } catch (err) {
        console.error('Error creating admin account:', err);
    }
}

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
    const {creator, createdAt, name, description = '', superheroId, visibility = 'private'} = req.body;
    if (!name || !superheroId) {
      return res.status(400).send('Name and superheroId are required.');
    }
  
    if (superheroLists[name]) {
      return res.status(409).send('A list with this name already exists.');
    }
  
    if (superheroLists.length >= 20) {
      return res.status(400).send('You have reached the maximum limit of lists (20).');
    }
  
    superheroLists[name] = {creator, createdAt, name, description, superheroId, visibility };
  
    res.status(201).send(`List '${name}' created successfully.`);
  });

  app.get('/api/superhero-lists', (req, res) => {
    const listSummaries = Object.keys(superheroLists).map(key => ({
      name: superheroLists[key].name,
      visibility: superheroLists[key].visibility
    }));
    res.json(listSummaries);
  });
  
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
  // Update an existing list
  app.put('/api/superhero-lists/:name', async (req, res) => {
    const listName = req.params.name;
    const { name, description, superheroId, visibility, createdAt} = req.body;
    if (!name || !superheroId) {
      return res.status(400).send('Name and superheroId are required.');
    }
  
    const existingList = superheroLists[listName];
  
    if (!existingList) {
      return res.status(404).send('List not found.');
    }
  
    superheroLists[listName] = { name, description, superheroId, visibility, createdAt};
    res.status(200).send(`List '${name}' updated successfully.`);
  });  
  
  app.delete('/api/superhero-lists/:name', (req, res) => {
    const listName = req.params.name;
  
    if (!superheroLists[listName]) {
      return res.status(404).send('List not found.');
    }
  
    // Delete the list
    delete superheroLists[listName];
  
    res.status(200).send(`List '${listName}' deleted successfully.`);
  });  

  app.post('/api/superhero-lists/:name/reviews', (req, res) => {
    const listName = req.params.name;
    const { rating, comment } = req.body;
  
    if (!superheroLists[listName]) {
      return res.status(404).send('List not found.');
    }
  
    if (superheroLists[listName].visibility !== 'public') {
      return res.status(403).send('You can only review public lists.');
    }
  
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).send('Rating must be a number between 1 and 5.');
    }
  
    const review = {
      rating,
      comment: comment || '', // Make the comment optional
      timestamp: new Date(),
    };
  
    // Add the review to the list
    if (!superheroLists[listName].reviews) {
      superheroLists[listName].reviews = [];
    }
    superheroLists[listName].reviews.push(review);
  
    res.status(201).send('Review added successfully.');
  });

  app.put('/api/admin/toggle-user', async (req, res) => {
    const { userId, isDisabled } = req.body; // Use 'userId' instead of 'useremail'
    try {
        const user = await UserModel.findOne({ userEmail: userId }); // Query using 'userId'
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.isDisabled = isDisabled; // Set to the value passed in the request
        await user.save();

        res.json({ message: `User with email ${user.email} is now ${isDisabled ? 'disabled' : 'enabled'}` });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: "An error occurred" });
    }
});

app.put('/api/admin/grant-site-manager', async (req, res) => {
  const { userId } = req.body;

  try {
      const user = await UserModel.findOne({ userEmail: userId });
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      user.role = 'siteManager';
      await user.save();

      res.json({ message: "User role updated to site manager" });
  } catch (error) {
      res.status(500).json({ message: "An error occurred" });
  }
});

// Add a helper function to calculate the average rating
const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) {
    return 0; // No reviews or an empty array
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return totalRating / reviews.length;
};

// Assuming superheroLists is an object with lists
// app.get('/api/public-hero-lists', (req, res) => {
//   // Filter public lists
//   const publicLists = Object.values(superheroLists).filter(
//     (list) => list.visibility === 'public'
//   );

//   // Sort by last modified date (assuming createdAt is a valid timestamp)
//   const sortedLists = publicLists.sort(
//     (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//   );

//   // Select up to 10 lists
//   const selectedLists = sortedLists.slice(0, 10);

//   // Map the selected lists to the desired format
//   const listsInfo = selectedLists.map((list) => {
//     const { name, creator, createdAt, heroes, reviews } = list;

//     return {
//       name,
//       creator,
//       createdAt,
//       numberOfHeroes: heroes ? heroes.length : 0,
//       averageRating: calculateAverageRating(reviews),
//     };
//   });

//   res.json(listsInfo);
// });
app.get('/api/public-hero-lists', async (req, res) => {
  // Filter public lists
  const publicLists = Object.values(superheroLists).filter(
    (list) => list.visibility === 'public'
  );
  // Sort by last modified date (assuming createdAt is a valid timestamp)
  const sortedLists = publicLists.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  // Select up to 10 lists
  const selectedLists = sortedLists.slice(0, 10);
  // Map the selected lists to the desired format
  const listsInfo = await Promise.all(
    selectedLists.map(async (list) => {
      const { name, creator, createdAt, superheroId, reviews } = list;
      // Split the list of sup erhero IDs and trim whitespace
      const superheroIds = superheroId.split(',').map(id => id.trim());

      try {
        // Fetch superhero details for each ID
        const superheroDetails = await getSuperheroInfoById(superheroIds);

        return {
          name,
          creator,
          createdAt,
          numberOfHeroes: superheroDetails.length,
          averageRating: calculateAverageRating(reviews),
        };
      } catch (error) {
        console.error('Error fetching superhero details:', error);
        return {
          name,
          creator,
          createdAt,
          numberOfHeroes: 0,
          averageRating: 0,
        };
      }
    })
  );

  res.json(listsInfo);
});


const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}.`)
})

