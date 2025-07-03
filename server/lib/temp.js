const os = require('os')
const t_m_p = require('os').tmpdir();
const path = require('path')
const tmpDir = os.tmpdir();
const fs = require('fs')


module.exports = function tempDir(tmp,action){
       let directory
       // read tmp folder directory
       let tempFolder = fs.readdirSync(tmpDir,'utf-8');
       // let findTmp = tempFolder.filter(x=>/tmp-[0-9]+-[a_z]*/gi.test(x))
       let findTmp = tempFolder.filter(x=>/^fileupload-/gi.test(x))
       
       // switch statement
       switch(true){
              
              case action==='create':
              // add tmp
              if(findTmp.length < 1){
                     const datetime = new Date().toLocaleDateString().replace(/\//g,'.');
                     directory = tmp.dirSync({keep:true}); // prevent automatic cleanup
                     const renameDir = {name:path.resolve(t_m_p,`fileupload-${datetime}`)}
                     fs.renameSync(directory.name,renameDir.name);
                     directory = renameDir
              } else {
                     console.log("tmp dir exists\nDo not create another!")
              }
              break;
              
              // remove temp
              case action==='remove':
              // remove temps 
                  findTmp.map(x => fs.rmSync(path.resolve(tmpDir,x),{recursive:true,force:true}));
              break;

              default:
              console.log(undefined);
       }

return directory
}