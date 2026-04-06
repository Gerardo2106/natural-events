import express from 'express';
import countryData from 'country-data';

const { countries } = countryData;
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));


app.get('/', async (req, res) => {
    let randomImage = await fetch('https://pixabay.com/api/?key=20426927-497d14db9c234faf7d0df8317&per_page=50&orientation=horizontal&q=natural%20disaster');
    let randomImageData = await randomImage.json();
    let randomImageURL = randomImageData.hits[Math.floor(Math.random() * randomImageData.hits.length)].webformatURL;
    res.render("home.ejs", { image: randomImageURL });
});


app.get('/country', (req, res) => {
    let code = req.query.code;
    let country = countries[code];
    res.render('country.ejs', { country });
});


app.get('/countries', (req, res) => {
    let allCountries = countries.all.filter(c => c.status === 'assigned');
    res.render('countries.ejs', { allCountries });
});

app.get('/events', async (req, res) => {
    let response = await fetch('https://eonet.gsfc.nasa.gov/api/v3/events?limit=20&status=open');
    let data = await response.json();
    res.render('events.ejs', { events: data.events });
});


app.get('/events/:category', async (req, res) => {
    let category = req.params.category;
    const categoryNames = {
        wildfires: 'Wildfires',
        severeStorms: 'Severe Storms',
        volcanoes: 'Volcanoes',
        seaLakeIce: 'Sea & Ice'
    };
    let categoryTitle = categoryNames[category] || category;

    let response = await fetch(`https://eonet.gsfc.nasa.gov/api/v3/events?category=${category}&status=open`);
    let data = await response.json();
    res.render('category.ejs', { events: data.events, category: categoryTitle });
});

app.listen(3000, () => {
    console.log('server started');
});