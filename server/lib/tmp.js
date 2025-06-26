const express = require('express')
const router = express.Router();
const tmp = require('tmp');
const fs = require('fs')
const os = require('os')
const path = require('path')
const tmpDir = os.tmpdir();

// set graceful cleanup 
tmp.setGracefulCleanup()

// // create tmp
// router.route('/create').get((req,res)=>{
//     let path;
//     try{
//         // create directory
//     let tmpdir = tmp.dirSync();
//         let {name} = tmpdir // directory name
//         path = name;

//         // split the path
//         let splitPath = splitPathBySystem(path);
//         console.log(splitPath)
//         console.log(splitPath[splitPath.length-1])
//         let [temp,tempId,tempSerial] = splitPath[splitPath.length-1].split`-`

//         console.log(temp + "\n" + tempId + "\n" + tempSerial + "\n")

//         res.json({tmp:{name:name}})
//     }
//     catch(err){
//         throw new Error(err)
//     }

// })

// // remove tmp
// router.route('/remove').get((req,res)=>{
//     try{
//         console.log(tmpDir)
//        let tempFolder = fs.readdirSync(tmpDir,'utf-8');
//        console.log(tempFolder)
//        let findTmp = tempFolder.filter(x=>/tmp-[0-9]+-[a_z]*/gi.test(x));
//        console.log(findTmp)
//        findTmp.map(x=> fs.rmdirSync(path.resolve(tmpDir,x))); // remove the directory

//         res.send('remove')
//     }
//     catch(err){
//         throw new Error(err)
//     }
// })

// let linux = '/tmp/win/ok', windows = 'C:\\storage\\something\\idk'
// let swin = windows.split('\\')
// console.log(swin)

function splitPathBySystem(path){
    let mac = '\/', win = '\\\\', split;  
    console.log(new RegExp(win,'g'))

    // if(new RegExp(win,'g').test(path)) {  // if path has win slashes
    //     path.split`${win}`
    // } else {
    //     path.split(`${mac}`)
    // }
    new RegExp(win,'g').test(path) ? split = path.split(win.slice(-2)) : split = path.split(mac.slice(-1)) // return array

    console.log(split)
    return split;

}

module.exports = router