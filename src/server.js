import express from 'express';
import React from 'react';
import Router from 'react-router';
import Helmet from 'react-helmet';
//import routes from './routes';
console.log('dirname is',__dirname);
const app = express();

app.get("/", function (req, res) {
  res.send("<!DOCTYPE html>" +
  "<html>" +
    "<head>" +
      "<title>Noahs React Starter Kit</title>" +
    "</head>" +
    "<body>" +
      "<div id='root'></div>" +
      "<script type='text/javascript' src='/public/js/bundle.js'></script>" +
    "</body>" +
  "</html>")
})

app.get("/public/js/bundle.js", function (req, res) {
  console.log('noah');
  res.sendFile("public/js/bundle.js", {root: __dirname})
})

app.listen(3000)
