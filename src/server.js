import express from 'express';
import React from 'react';
import Router from 'react-router';
import Helmet from 'react-helmet';
//import routes from './routes';

const app = express();
app.use(express.static(__dirname +'/public'));

app.get("*", function (req, res) {
  res.send("<!DOCTYPE html>" +
  "<html>" +
    "<head>" +
      "<title>Noahs React Starter Kit</title>" +
    "</head>" +
    "<body>" +
      "<div id='root'></div>" +
      "<script type='text/javascript' src='/js/bundle.js'></script>" +
    "</body>" +
  "</html>")
})

app.listen(3000)
