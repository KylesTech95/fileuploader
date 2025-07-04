require('dotenv').config(
    { path: require('path').resolve(__dirname,'env','.env'), debug: true, override: false }
) // control the path of .env
// temp directory (based on operating system)
const t_m_p = require('os').tmpdir();
const tmp = require('tmp')
const tempDir = require('./lib/temp.js')
const {convert} = require('./lib/convert.js')

const fs = require('fs')
const express = require('express')
const port = process.env.PORT2||3300;
const path = require('path')
const app = express();
const cors = require('cors')
const fileupload = require('express-fileupload');
const ffmpeg = require('ffmpeg')
let interval, speed = 100;

const [input,output] = ['input','output']
const [create,remove] = ['create','remove']
/*--------------------------------------------------------------- */

// create temp directory when server starts
createTmpDir(tmp)

app.use(fileupload());
app.use(express.static(path.join(__dirname,'../'))) // static directory (public)
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended:true}))

/*--------------------------------------------------------------- */

// routes
// upload files (single/multi)
app.route('/upload').post((req,res,next)=>{
    const {image} = req.files // array
    console.log(image)
    let folderType, len;
    try{
        if(image.length>0){
            len = image.length
            // readfile
            image.forEach((file,index)=>{
                folderType = file.mimetype.split`/`[0]
                console.log(folderType)
                file.mv(path.resolve(__dirname,input,folderType,file.name), err=>{
                    if(err) {
                        return res.status(500).send(err);
                    }
                })
            })
        } else {
                len = 1
                folderType = image.mimetype.split`/`[0]
                console.log(folderType)
                image.mv(path.resolve(__dirname,input,folderType,image.name), err=>{
                    if(err) {
                        return res.status(500).send(err);
                    }
                })
            }
            res.json({data:`${len} ${len<2?'file':'files'} uploaded to the server`})
    }
    catch(err){
        throw new Error(err)
    }
})

// convert (get)
// app.route('/convert').get(async(req,res)=>{
//     const {type,ext} = req.query // inbin, outbin, input-files
//     const dirFromConversion = '..', inbin = `${dirFromConversion}/${input}`, outbin = `${dirFromConversion}/${output}` // bins for input and output
//     // console.log(req.query)
//     // console.log(inbin)
//     // console.log(outbin)
//     console.log(ext)
//     const files = [...fs.readdirSync(path.resolve(__dirname,input,type),'utf-8')];

//     let folderType;
//     // console.log(files) 
//     try{
//         if(files && files.length>0){
//             for(let i = 0; i < files.length; i++){
//                 let inpFileName = files[i].split('.')[0];
//                 let currentExt = files[i].split('.')[1];
//                 if(currentExt!==ext){ // if extension does not match
//                     console.log('Conversion #' + (i+1))
//                     convert(inbin,files[i],`${inpFileName}.${ext}`,outbin); // jpg to png
//                     // convert(input,files[i],output,{height:256,width:300}); // jpg to png
//                     // clear the loop// while loop
//                     console.log('Conversion #' + (i+1))
//                     convert(inbin,files[i],`${inpFileName}.${ext}`,outbin); // jpg to png
//                     // convert(input,files[i],output,{height:256,width:300}); // jpg to png
//                     // clear the loop
//                 }
//             }
          
//         }
        
//         res.send('File Conversion Complete')
//     }
//     catch(err){
        
//         throw new Error(err)
//     }
// })
// convert (post)
// app.route('/convert').post(async(req,res)=>{
//     const {ext} = req.body // inbin, outbin, input-files
//     const dirFromConversion = '..', inbin = `${dirFromConversion}/${input}`, outbin = `${dirFromConversion}/${output}` // bins for input and output
//     // console.log(req.query)
//     // console.log(inbin)
//     // console.log(outbin)
//     console.log(ext)
//     const files = [...fs.readdirSync(path.resolve(__dirname,input),'utf-8')]
//     console.log(files) 
//     try{
//         if(files && files.length>0){

//             for(let i = 0; i < files.length; i++){
//                 let inpFileName = files[i].split('.')[0];
//                 // while loop
//                 console.log('Conversion #' + (i+1))
//                 convert(inbin,files[i],`${inpFileName}.${ext}`,outbin); // jpg to png
//                 // convert(input,files[i],output,{height:256,width:300}); // jpg to png
//                 // clear the loop
//             }
          
//         }
        
//         res.send('File Conversion Complete')
//     }
//     catch(err){
        
//         throw new Error(err)
//     }
// })

app.route('/tmp/remove').get((req,res)=>{
    // get temp directory by reading the path directory
    let tmpDirectory = fs.readdirSync(t_m_p,{encoding:'utf-8'})
    // filter the directory for any temp files by regex
    let findTemps = [...tmpDirectory].filter((file,index)=>/^tmp-/gi.test(file));
    
    if(findTemps.length > 0){
        // remove temps
        removeTmpDir(t_m_p,findTemps)
        res.send("temps are removed!")

    } else {
        console.log('temps not listed in directory:\n'+t_m_p)
        res.send('No temps to remove')
    }


})

/*--------------------------------------------------------------- */

startServer(app,port,4,interval,speed)
// start the server
function startServer(app,port,count,interval,speed){
    clearInterval(interval)
    interval = setInterval(()=>{
        if(count>1){
                count-=1
        } else {
                app.listen(port,()=>{
                console.log('listening on port ' + port)
                    })
                clearInterval(interval)
            }
            console.log(count)
    },speed)
    
}

app.use((req,res)=>{
    res.status(404).send('<h2 style="width:100%;margin-top:1rem;text-align:center;border-bottom:2px solid black;">Page not found<br>Back to <a href="/" style="text-decoration:none;color:red;font-weight:bold;">Fileupload</a></h2>')
})

/*--------------------------------------------------------------- */

function createTmpDir(tmp){
    tmp.setGracefulCleanup()
    tempDir(tmp,create)
}

function removeTmpDir(tmp,arr){
    arr.map(f=> fs.rmdirSync(path.resolve(tmp,f))) // quick execution with map() fn
}

/*--------------------------------------------------------------- */
