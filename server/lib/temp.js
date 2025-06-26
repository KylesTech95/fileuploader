const os = require('os')
const path = require('path')
const tmpDir = os.tmpdir();
const fs = require('fs')


module.exports = function tempDir(tmp){
let tempFolder = fs.readdirSync(tmpDir,'utf-8');
       console.log(tempFolder)
       let findTmp = tempFolder.filter(x=>/tmp-[0-9]+-[a_z]*/gi.test(x));
       console.log(findTmp)
       findTmp.map(x=> fs.rmdirSync(path.resolve(tmpDir,x))); // remove the directory

let directory = tmp.dirSync();
console.log(directory);

return directory
}