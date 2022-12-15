exports.API = async function({imgFolder, port, apiURL, apiDomain, rateLimit}) {
    const express = require('express');
    const fs = require("fs");
    const app = express();
    const path = require('path')
    const axios = require('axios')
    const Updater = await axios.get('https://registry.npmjs.org/randomimgapi')
    const stableVersion = Updater.data['dist-tags'].latest
    const version = require('./package.json').version
    if (stableVersion !== version && !version.includes('dev')) {
      console.log('\x1b[93m[RandomImgApi Updater]\x1b[31m Please update RandomImgApi\x1b[33m https://www.npmjs.com/package/randomimgapi\x1b[0m')
    } else if (version.includes('dev')) {
      console.log('\x1b[93m[RandomImgApi Updater]\x1b[31m You are using\x1b[33m DEV\x1b[31m version\x1b[0m')
    } else {
      console.log('\x1b[93m', '[RandomImgApi Updater]', '\x1b[32m', 'You are using latest version!', '\x1b[0m')
    }
    var RateLimit = require('express-rate-limit');
    var limiter = new RateLimit({
    windowMs: 1*60*1000, // 1 minute
    max: rateLimit
    });
    const sanitize = require("sanitize-filename");
    app.use(limiter)

    // Using app.get instead of express.static, so files upload instantly
    app.get(`/${imgFolder}/:path`, async (req, res) => {
      const pathfolder = path.resolve(__dirname + `../../../${imgFolder}/${sanitize(req.params.path)}`)
      if (!fs.existsSync(sanitize(pathfolder))) return res.sendStatus(404);
      
      res.setHeader("Content-Type", "image/png");
      res.send(fs.readFileSync(sanitize(pathfolder)));
    });
    
    app.get(`/${apiURL}`, async (req, res) => {
      const pathfolder2 = path.resolve(__dirname + `../../../${imgFolder}`)
    const images = fs.readdirSync(pathfolder2).map(img => `https://${apiDomain}/${imgFolder}/${img}`);
      const randomimage = images[Math.floor(Math.random() * images.length)];
      res.header("Access-Control-Allow-Origin", "*");
      res.json({
        image: randomimage
      });
    });
    
    app.listen(port);
    console.log(`\x1b[36m[RandomImgApi Info]\x1b[32m The API is listening on port ${port}\x1b[0m`)
}