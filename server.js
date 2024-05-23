// Needed for dotenv
require("dotenv").config();

// Needed for Express
var express = require('express')
var app = express()

// Needed for EJS
app.set('view engine', 'ejs');

// Needed for public directory
app.use(express.static(__dirname + '/public'));

// Needed for parsing form data
app.use(express.json());       
app.use(express.urlencoded({extended: true}));

// Needed for Prisma to connect to database
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

//Personal info for the about page
const personInfo = {
  name: "John Doe",
  address: "123 Main St, City, Country",
  phoneNumber: "123-456-7890",
  bloodType: "AB",
  allergies: "NIL"
};

// Main landing page
app.get('/', async function(req, res) {

  try {
  const blogs = await prisma.post.findMany({
              orderBy: [
                {
                  id: 'desc'
                }
              ]
  
            });
  let filters = req.query;
    let filteredPosts = blogs;

    if (filters.doctortype) {
      filteredPosts = filteredPosts.filter(post => post.doctortype === filters.doctortype);
    }
    // Try-Catch for any errors
    
    //try {
    //    // Get all blog posts
    //    const blogs = await prisma.post.findMany({
    //            orderBy: [
    //              {
    //                id: 'desc'
    //              }
    //            ]
    //    });

        // Render the homepage with all the blog posts
        await res.render('pages/home', { blogs: filteredPosts }); 
      } catch (error) {
        res.render('pages/demo');
        console.log(error);
      } 
});

// About page
app.get('/about', function(req, res) {
    res.render('pages/about', { personInfo: personInfo });
  });

// New post page
app.get('/new', function(req, res) {
    res.render('pages/new');
});

// New demo page
app.get('/locations', function(req, res) {
  res.render('pages/locations');
});


// Create a new post
app.post('/new', async function(req, res) {
    
    // Try-Catch for any errors
    try {
        // Get the title and content from submitted form
        const { apptdate, doctortype, update, followup, nextappt } = req.body;

        // Reload page if empty title or content
        if (!apptdate || !doctortype || !update || !followup || !nextappt) {
            console.log("Unable to create new post, missing information");
            res.render('pages/new');
        } else {
            // Create post and store in database
            const blog = await prisma.post.create({
                data: { apptdate: new Date(apptdate), doctortype, update, followup, nextappt: new Date(nextappt) },
            });

            // Redirect back to the homepage
            res.redirect('/');
        }
      } catch (error) {
        console.log(error);
        res.render('pages/new');
      }

});

// Delete a post by id
app.post("/delete/:id", async (req, res) => {
    const { id } = req.params;
    
    try {
        await prisma.post.delete({
            where: { id: parseInt(id) },
        });
      
        // Redirect back to the homepage
        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
  });

// Tells the app which port to run on
app.listen(3002);