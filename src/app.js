const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
const port = process.env.PORT || 3000;

//Define Paths of express config
const publicDirectoryPath = path.join(__dirname,'../public');
const viewsPath = path.join(__dirname,'../templates/views');
const partialsPath = path.join(__dirname,'../templates/partials');

//Setup handlebars engine and views location
app.set('view engine','hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

//Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('',(req,res)=>{
  res.render('index',{
    title:'Weather App',
    name:'Vimal Kurien Sam'
  })
})

app.get('/about',(req,res)=>{
  res.render('about',{
    title:'About Me',
    name : 'Vimal Kurien Sam'
  });
})

app.get('/help',(req,res)=>{
  res.render('help',{
    title:'Help Page',
    msg: 'Page gives all the details on help topics',
    name:'Vimal Kurien Sam'
  });
})

app.get('/weather',(req,res)=>{
  if (!req.query.address) {
    return res.send({
      error:'Please provide an address !'
    })
  }
    geocode(req.query.address,(error,{Latitude,Longitude,Location}={})=>
    {
      if (error)
      {
        return res.send({error});
      }
    forecast(Latitude, Longitude, (error, forecastData) =>
    {
      if (error)
      {
        return res.send({error});
      }
      res.send({
        location:Location,
        forecast:forecastData
      })
    })

  })

})

app.get('/help/*',(req,res)=>{
  res.render('error',{
    title: 'Error Page',
    name:'Vimal Kurien Sam',
    msg : 'Help article not found'
  })
})

app.get('*',(req,res)=>{
  res.render('error',{
    title: 'Error Page',
    name: 'Vimal Kurien Sam',
    msg: 'Page not found'
  })
})


app.listen(port,()=>{
  console.log('Server created at port ' + port);
})
