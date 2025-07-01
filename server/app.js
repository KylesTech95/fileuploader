require('dotenv').config(
    { path: require('path').resolve(__dirname,'env','.env'), debug: true, override: false }
) // control the path of .env
// temp directory (based on operating system)
const t_m_p = require('os').tmpdir();
const tmp = require('tmp')
const tempDir = require('./lib/temp.js')
const {convert} = require('./lib/convert.js')
const session = require('express-session')
const MemoryStore = require('memorystore')(session);
const tmpFileRegex = /^fileupload-/gi || new RegExp('^fileupload-','g')

const fs = require('fs')
const express = require('express')
const port = process.env.PORT2||3300;
const path = require('path')
const app = express();
const cors = require('cors')
const fileupload = require('express-fileupload');
const ffmpeg = require('ffmpeg')
const public = '../public'
let interval, speed = 100;

const [input,output] = ['input','output']
const [create,remove] = ['create','remove']

let maxAgeReset = Date.now()
/*--------------------------------------------------------------- */
// middleware
app.use(express.static(path.resolve(__dirname,public)))
app.use(fileupload());
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended:true}))
// express session
const halftime = .5, // 30 seconds 
      minute = 1, // 1 minute
      short = 15, // 15 minutes
      med = 30, // 30 minutes
      long = 60, // 60 minutes
      day = 86400000

    //   24 hours * 60 minutes/hour * 60 seconds/minute * 1000 milliseconds/second = 86,400,000 milliseconds. 

app.use(session({
  name:'appSession',
  secret: 'some secret',
  store:new MemoryStore({checkPeriod:86400000}), // 24 hour checkPeriod
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 60 * (day) * 1000 }
}))
// check cookie expiration
app.use((req,res,next)=>{
    if((Date.now() - req.session.cookie.maxAge) > maxAgeReset){
        // // console.log("session expired\nremoving tmp dir");
        removeTmpDir(tmp,remove);
        maxAgeReset = Date.now();
    }
    next()
})

/*--------------------------------------------------------------- */

// routes

// get file size
app.route('/filesize').get((req,res)=>{
    let cookie;
    const {size} = req.query;
    // update cookie with filesize
    if(!req.session){
        console.log('session is not detected');
    } else {
        req.session.filesize = size;
        // console.log("filesize updated to " + req.session.filesize)
    }
    res.json(req.session)
})

// upload files (single/multi)
app.route('/upload').post((req,res,next)=>{
    const {image} = req.files // array
    let tmpDirectory = fs.readdirSync(t_m_p,{encoding:'utf-8'})
    // filter the directory for any temp files by regex
    let getTmpName = [...tmpDirectory].filter((file,index)=>tmpFileRegex.test(file));
    // // if(getTmpName.length > 1) console.log('More than 1 Tmp folders detected')
    let folderType, len;

    /* console out */
    console.log("tmp directory:\n"+t_m_p+"\n-----------------\ntmp name:\n"+getTmpName[0]+"\n-----------------\nfilename(s):\n"+JSON.stringify(image.name))

    //------------------------------

    try{
        if(image.length>1){
            len = image.length
            // readfile
            image.forEach((file,index)=>{
                folderType = file.mimetype.split`/`[0];
                let mediaDir = path.resolve(t_m_p,getTmpName[0],input,folderType);
                let currentFiles = fs.readdirSync(mediaDir,{encoding:'utf-8'});
                // console.log(folderType)
                // check if filenames exist before uploading to the tmp directory
                if(currentFiles.length > 0){
                    for(let i = 0; i < currentFiles.length; i++){
                        let media = currentFiles[i];
                        if(!currentFiles.includes(file.name) && media !== file.name){
                            // move the file to tmp directory
                            file.mv(path.resolve(t_m_p,getTmpName[0],input,folderType,file.name), err=>{
                                if(err) {
                                    // console.log(err)
                                }
                            })
                        } else {
                            console.log(`File ${file.name} already exists in ${mediaDir}`)
                        }
                    }
                } else {
                    // console.log('Media Dir is empty')
                    // first time upload
                    // move the file to tmp directory
                        file.mv(path.resolve(t_m_p,getTmpName[0],input,folderType,file.name), err=>{
                            if(err) {
                                // console.log(err)
                            }
                        })
                }
            })
        } else {
                len = 1
                folderType = image.mimetype.split`/`[0]
                let mediaDir = path.resolve(t_m_p,getTmpName[0],input,folderType);
                let currentFiles = fs.readdirSync(mediaDir,{encoding:'utf-8'});
                // check if filenames exist before uploading to the tmp directory
                if(currentFiles.length > 0){
                    // console.log(currentFiles)
                    if(!currentFiles.includes(image.name)){
                        // move the file to tmp directory
                        image.mv(path.resolve(t_m_p,getTmpName[0],input,folderType,image.name), err=>{
                            if(err) {
                                // console.log(err)
                            }
                        })
                    } else {
                        // console.log(`File ${image.name} already exists in ${mediaDir}`)
                    }
                } else {
                    // first time upload
                    // move the file to tmp directory
                        image.mv(path.resolve(t_m_p,getTmpName[0],input,folderType,image.name), err=>{
                            if(err) {
                                console.log(err)
                            }
                        })
                }
                // move the file to tmp directory
                
                if(!currentFiles.includes(image.name)){
                    image.mv(path.resolve(t_m_p,getTmpName[0],input,folderType,image.name), err=>{
                        if(err) {
                            console.log(err)
                        }
                    })
                }
                else {
                    // console.log(`File ${image.name} already exists in ${mediaDir}`)
                }
            }
            let result = {data:`${len} ${len<2?'file':'files'} uploaded to the server`,files:image}
            // res.redirect('/')
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
// //     // console.log(req.query)
// //     // console.log(inbin)
// //     // console.log(outbin)
// //     console.log(ext)
//     const files = [...fs.readdirSync(path.resolve(__dirname,input,type),'utf-8')];

//     let folderType;
// //     // console.log(files) 
//     try{
//         if(files && files.length>0){
//             for(let i = 0; i < files.length; i++){
//                 let inpFileName = files[i].split('.')[0];
//                 let currentExt = files[i].split('.')[1];
//                 if(currentExt!==ext){ // if extension does not match
// //                     console.log('Conversion #' + (i+1))
//                     convert(inbin,files[i],`${inpFileName}.${ext}`,outbin); // jpg to png
//                     // convert(input,files[i],output,{height:256,width:300}); // jpg to png
//                     // clear the loop// while loop
// //                     console.log('Conversion #' + (i+1))
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
// //     // console.log(req.query)
// //     // console.log(inbin)
// //     // console.log(outbin)
// //     console.log(ext)
//     const files = [...fs.readdirSync(path.resolve(__dirname,input),'utf-8')]
// //     console.log(files) 
//     try{
//         if(files && files.length>0){

//             for(let i = 0; i < files.length; i++){
//                 let inpFileName = files[i].split('.')[0];
//                 // while loop
// //                 console.log('Conversion #' + (i+1))
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

// force remove tmp directory

// remove tmp dir
app.route('/tmp/remove').get((req,res)=>{
    // get temp directory by reading the path directory
    let tmpDirectory = fs.readdirSync(t_m_p,{encoding:'utf-8'})
    // filter the directory for any temp files by regex
    let findTemps = [...tmpDirectory].filter((file,index)=>tmpFileRegex.test(file));
    
    if(findTemps.length > 0){
        // remove temps
        removeTmpDir(t_m_p,findTemps)
        res.send("temps are removed!")

    } else {
        // // console.log('temps not listed in directory:\n'+t_m_p)
        res.send('No temps to remove')
    }

})

// check if tmp exists
app.route('/tmp/check').get(checkTempDir)

// delete file from server
app.route('/tmp/delete').post((req,res)=>{
    const {file} = req.body
    const foldertype = file.getMedia.genType;
    const filename = file.filename;
    // // console.log(filename)
    // console.log(file)
    const tmpdirectory = fs.readdirSync(t_m_p,{encoding:'utf-8'})

    let findTemps = [...tmpdirectory].filter((file,index)=>tmpFileRegex.test(file));
    let filepath = fs.readdirSync(path.resolve(t_m_p,findTemps[0],input,foldertype),{encoding:'utf-8'});
    // console.log("DELETE PATH:")
    // console.log(filepath)
    if(filepath.includes(filename)){
        // remove file 
        fs.rmSync(path.resolve(t_m_p,findTemps[0],input,foldertype,filename));
        res.send('file is deleted')
    } else {
        // console.log('file cannot be removed')
        res.send('No files to delete')

    }
    
})

// view cookie
app.route('/cookie').get((req,res)=>{
    res.json(req.session)
})

// clear cookie
app.route('/cookie/clear').get((req,res)=>{
    req.session.cookie.epxires = null;
    removeTmpDir(tmp,remove); // remove tmp folder(s), if any
    res.json(req.session)
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


// 404 not found
app.use((req,res)=>{
    res.status(404).send('<h2 style="width:100%;margin-top:1rem;text-align:center;border-bottom:2px solid black;">Page not found<br>Back to <a href="/" style="text-decoration:none;color:red;font-weight:bold;">Fileupload</a></h2>')
})


/*--------------------------------------------------------------- */
function checkTempDir(req,res){
    let mediatypes = ['video','audio','image']
        // get temp directory by reading the path directory
        let tmpDirectory = fs.readdirSync(t_m_p,{encoding:'utf-8'})
        // filter the directory for any temp files by regex
        let findTemps = [...tmpDirectory].filter((file,index)=>tmpFileRegex.test(file));
        console.log("LOCATING EXISTING TMP FOLDERS:")
        console.log(findTemps);
        if(findTemps.length < 1){
            let object = 'dir'
            let directory = createTmpDir(tmp)['name']; // create temp directory when server starts
            console.log("DIRECTORY\n"+directory)
            decorateTmp(directory, object, {count:2,names:[input,output]}) // decorate the temp directory
            // decorate input and output
            decorateTmp(path.resolve(directory,input),object,{count:3,names:mediatypes})
            decorateTmp(path.resolve(directory,output),object,{count:3,names:mediatypes})
            res.json({data:'temp dir created'})
        } else {
            let readAudio = fs.readdirSync(path.resolve(t_m_p,findTemps[0],input,'audio'),'utf-8')
            let readImage = fs.readdirSync(path.resolve(t_m_p,findTemps[0],input,'image'),'utf-8')
            let readVideo = fs.readdirSync(path.resolve(t_m_p,findTemps[0],input,'video'),'utf-8')
            // // console.log(readAudio)
            // // console.log(readVideo)
            // // console.log(readImage)
            let getStats = (arr,mediatype) => [...arr].map(name =>{
                const encoding = 'utf-8'
                let getstats = fs.statSync(path.resolve(t_m_p,findTemps[0],input,mediatype,name),encoding); // get file stats
                return getstats
            }) // check audio files in raw form

            res.json({data:{
                audio:{image:readAudio,type:'audio',stats:getStats(readAudio,'audio')},
                video:{image:readVideo,type:'video',stats:getStats(readVideo,'video')},
                image:{image:readImage,type:'image',stats:getStats(readImage,'image')}
            }})
        }
}

function createTmpDir(tmp){
    tmp.setGracefulCleanup()
    return tempDir(tmp,create)
}

function removeTmpDir(tmp){
    tempDir(tmp,remove)
}

// decorate temporary directory
function decorateTmp(path,object,options={count:1,encoding:'utf-8',names:[]}){
    let names = options.names, encoding = options.encoding, count = options.count
    // // console.log(names)
    switch(true){
        case object==='dir':
            for(let i = 0; i < count; i++){
                let dirname = (names.length<1 || names.length !== count) ? 'dir'+(i>0?i:'') : names[i] 
                // create directory
                fs.mkdirSync(require('path').resolve(path,dirname),{encoding:encoding}); 
            }
        break;

        case object==='file':
            for(let i = 0; i < count; i++){
                // create filename
                let filename = 'file'+(i>0?i:null)
                // create directory
                fs.writeFileSync(require('path').resolve(path,filename),`$Welcome to {filename}!`,{encoding:encoding}); 
            }
        break;

        default:
        // console.log(undefined);
    }
}

/*--------------------------------------------------------------- */

