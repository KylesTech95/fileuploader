const express = require('express')
const router = express.Router();
const tmp = require('tmp');
const fs = require('fs')

let dirs = []
// set graceful cleanup 
tmp.setGracefulCleanup()

// create tmp
// router.route('/create').get((req,res)=>{
//     try{
//         // create directory
//     let tmpdir = tmp.dirSync();
//         let {name} = tmpdir // directory name
//         dirs.push(name)

//         res.json({tmp:{name:name}})
//     }
//     catch(err){
//         throw new Error(err)
//     }

// })

// remove tmp
// router.route('/remove').get((req,res)=>{
//     try{
//         if(dirs.length > 0){
//             dirs.map((d,i)=>{
//                 // if directory exists
//                 if(fs.existsSync(d)){
//                     // remove dir
//                     fs.rmdirSync(d);
//                     // remove from dirs array
//                     dirs = [...dirs].splice(dirs.indexOf(d),1) // remove 
//                 }
//             })
//         }
//         console.log(dirs)
//         // tmpdir.removeCallback();
//         res.send('tmp folder removed')
//     }
//     catch(err){
//         throw new Error(err)
//     }
// })



module.exports = router