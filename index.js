exports.API = async function(options) {
    const express = require('express');
    const fs = require("fs");
    const app = express();
    const folder = options.imgFolder
    const port = options.port
    const url = options.apiURL
    const domain = options.apiDomain
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
    
    // Using app.get instead of express.static, so files upload instantly
    app.get(`/${folder}/:path`, async (req, res) => {
      const pathfolder = path.resolve(__dirname + `../../../${folder}/${req.params.path}`)
      if (!fs.existsSync(pathfolder)) return res.sendStatus(404);
      
      res.setHeader("Content-Type", "image/png");
      res.send(fs.readFileSync(pathfolder));
    });
    
    app.get(`/${url}`, async (req, res) => {
      const pathfolder2 = path.resolve(__dirname + `../../../${folder}`)
    const images = fs.readdirSync(pathfolder2).map(img => `https://${domain}/${folder}/${img}`);
      const randomimage = images[Math.floor(Math.random() * images.length)];
      res.header("Access-Control-Allow-Origin", "*");
      res.json({
        image: randomimage
      });
    });
    
    app.listen(port);
    console.log(`\x1b[36m[RandomImgApi Info]\x1b[32m The API is listening on port ${port}\x1b[0m`)
}