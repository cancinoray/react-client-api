const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');


const app = express();
const port = process.env.PORT || 5000;
app.use(cors());


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//parse application/json
app.use(bodyParser.json());

app.use(fileUpload());

// DB
const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: "./img.db"
    },
    useNullAsDefault: true
});

app.get('/', async (req, res) => {
    res.send('Yooow!')
})

//adding file to the database
app.post('/upload', async(req, res) => {
    let {name, data} = req.files.file;
    let description = req.body.description;
        if(name && data && description) {
            await knex.insert({name: name, img: data, description:description}).into('img');
            res.sendStatus(200);
            res.status(200).json('Uploaded Complete')
        }else{
            res.status(400).json('Connection Problem')
        }
   
})

//for search, display and retrieving
app.get('/img/:id', async(req, res) => {
    const id = req.params.id;
    const img = await knex('img').where({id:id}).first();
    if(img){
        res.end(img.img);
    } else {
        res.end('No Img with that Id!');
    }
})

app.listen(port, () => console.log(`Server is listening at http://localhost:${port}`))



