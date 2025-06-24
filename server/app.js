require('dotenv').config(
    { path: require('path').resolve(__dirname,'env','.env'), debug: true, override: false }
) // control the path of .env
const fs = require('fs')
const {convert} = require('./lib/convert.js')
const express = require('express')
const port = process.env.PORT2||3300;
const path = require('path')
const app = express();
let interval, speed = 250;
const cors = require('cors')




app.use(express.static(path.join(__dirname,'../'))) // static directory (public)
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended:true}))


// test route
// (ECMAScript 2015)
app.route('/test').get((req,res)=>{
    res.send('testing')
})
// Traditional Function 
// app.get('/endpoint', function(req,res){
//})

// convert (get)
app.route('/convert').get(async(req,res)=>{
    const {input,output,ext} = req.query // inbin, outbin, input-files
    const dirFromConversion = '..', inbin = `${dirFromConversion}/${input}`, outbin = `${dirFromConversion}/${output}` // bins for input and output
    // console.log(req.query)
    // console.log(inbin)
    // console.log(outbin)
    console.log(ext)

    const files = [...fs.readdirSync(path.resolve(__dirname,input),'utf-8')]
    // console.log(files) 
    try{
        if(files && files.length>0){

            for(let i = 0; i < files.length; i++){
                let inpFileName = files[i].split('.')[0];
                // while loop
                console.log('Conversion #' + (i+1))
                convert(inbin,files[i],`${inpFileName}.${ext}`,outbin); // jpg to png
                // convert(input,files[i],output,{height:256,width:300}); // jpg to png
                // clear the loop
            }
          
        }

        
        res.send('File Conversion Complete')
    }
    catch(err){
        running = false; // clear the loop
        throw new Error(err)
    }
})


// convert (post)
// app.route('/convert').post(async(req,res)=>{
//      const {files} = req.body;
//     try{
//         convert('../input','input.jpg','output.gif','../output');
//         res.send('File Conversion Complete')
//     }
//     catch(err){
//         throw new Error(err)
//     }
// })
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

