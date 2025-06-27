const os = require('os')
const path = require('path')
const tmpDir = os.tmpdir();
const fs = require('fs')


module.exports = function tempDir(tmp,action){
       let directory
       // read tmp folder directory
       let tempFolder = fs.readdirSync(tmpDir,'utf-8');
       let findTmp = tempFolder.filter(x=>/tmp-[0-9]+-[a_z]*/gi.test(x))
       
       // switch statement
       switch(true){
              
              case action==='create':
              // add tmp
              if(findTmp.length < 1){
                     directory = tmp.dirSync();
                     console.log(directory);
              }
              break;

              case action==='remove':
              // remove temps 
                  findTmp.map(x => fs.rmSync(path.resolve(tmpDir,x),{recursive:true,force:true}));
              break;

              default:
              console.log(undefined);
       }

return directory
}