const { Jimp } = require('jimp');
const ffmpeg = require('ffmpeg');
const path = require('path')
// const [input,output] = ['input.jpg','output.png'] // input file (jpg) and output file (png)
const [input,output] = ['input.png','output.jpeg'] // input file (png) and output file (jpeg)
const fs = require('fs');

// convert jpg to png
async function convert(directory,input,output,outDir,options={height:undefined,width:undefined}){
    let { height,width } = options
    // get absolute path
    input = path.resolve(__dirname,directory,input) // going to directory from this file's directory (__dirname)
    // jimp reads input file and stores in image
    let image = await Jimp.read(input)

    // edit the image here (crop,resize,etc...)
  /*----------------------------------------*/  
//   console.log(image)
    height && width ? image.resize({w:width,h:height}) : null
    //.crop({x:10,y:10,h:150,w:150})
  /*----------------------------------------*/  

    // check if filename is the same
    const sameFile = checkSameFileName(outDir,fs,output).samefile;
    const fileLen = checkSameFileName(outDir,fs,output).len;
    const files = checkSameFileName(outDir,fs,output).files

    // console.log(files)
    if(sameFile){
        let split = output.split('.');
        split[0]+=(fileLen);
        output = split.join`.`;
    } 
        // console.log(output)


    // image writes to output.jpg (new file name)
    image.write(path.resolve(__dirname,outDir,output));
}


// convert('.',input,output,'.')


function checkSameFileName(directory,{readdirSync} = require('fs'),filename){
    let result = false;
    let splitFile = filename.split`.`;
    let [fname,ext] = [splitFile[0],splitFile[1]]
    let locateFiles = [...readdirSync(path.resolve(__dirname,(directory||null)),'utf-8')]
                    .filter(file => new RegExp(`^(${filename}|${fname}[1-9]?\.${ext})`,'g').test(file)); // filter files by regex
    // gather information from same files
    const len = locateFiles.length;
    const filenames = [...locateFiles]
    // console.log("filenames: "+filenames)
    filenames.length < 1 ? result = false : result = true;
    console.log("bool: "+result)
    // return object
    return {
        samefile:result,
        files:len<1?undefined:len > 0 && len < 2?filenames[0]:filenames,
        len:len
    }
}
// checkSameFileName('.',fs,output)

module.exports = { convert }