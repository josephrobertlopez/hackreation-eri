// Copies the web/ files into the WordPress plugin so both stay identical: npm run sync:wp
const fs = require('node:fs'); const path = require('node:path');
const dst = path.join(__dirname, '..', 'wp-plugin', 'eri-job-fit', 'assets');
for (const f of ['job-fit.js', 'app.js', 'style.css']) fs.copyFileSync(path.join(__dirname, '..', 'web', f), path.join(dst, f));
console.log('synced web/ -> wp-plugin assets');
