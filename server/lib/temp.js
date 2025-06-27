const os = require('os')
const path = require('path')
const tmpDir = os.tmpdir();
const fs = require('fs')


module.exports = function tempDir(tmp,action){
       let directory
       console.log(tmpDir)
       // remove tmp directories
       let tempFolder = fs.readdirSync(tmpDir,'utf-8');
       let findTmp = tempFolder.filter(x=>/tmp-[0-9]+-[a_z]*/gi.test(x));
       findTmp.map(x=> fs.rmdirSync(path.resolve(tmpDir,x)));
       console.log("action type:")
       console.log(action)
       switch(true){
              case action==='create':
              directory = tmp.dirSync();
              console.log(directory);
              break;

              case action==='remove':
              if(directory & tempFolder.find(f=>new RegExp(f,'g').test(directory.name))){
                     fs.rmdirSync(path.resolve(directory.name),'utf-8')
              } else {
                     console.log('tmp does not exist yet')
              }
              break;

              default:
              console.log(undefined);
       }

return directory
}