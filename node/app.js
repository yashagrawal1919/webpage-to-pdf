const express = require('express');
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended : false}));

app.use((req, res , next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', "*");
    next();
})

// ROUTES
app.post('/convert', async (req, res , next) => {
    const url = req.body.url.startsWith("http") ? req.body.url : "http://" + req.body.url ;
    const browser = await puppeteer.launch({
        headless : true
    });

    const page = await browser.newPage();


    await page.goto(url, {
        waitUntil: 'networkidle0',
      });
      

    const pdf = await page.pdf({
        printBackground : true
    });

    await browser.close();

    res.setHeader( "Content-Disposition", "inline;filename=" + url + "_pdf.pdf" );
    res.setHeader("Content-Type", "application/pdf");

    return res.send(pdf)
});

app.listen(4000,() => {
    console.log("Server is Up");
})
