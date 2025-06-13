// variables
const filecontainer = document.getElementById('file-container')
const header = document.getElementById('header-mast')
const select_counter = document.querySelector('.select-counter')
const garbage = document.getElementById('garbage-img-tool');
const fileobj = new Object({
    input:document.getElementById('file-id'),
    buttons:{
        img:document.getElementById('upload-img'),
        tool:document.getElementById('upload-img-tool')
    },
    imgcontainer:document.getElementById('file-hold-container'),
})
// set file upload icon to middle of screen
let midheight = window.innerHeight/2
let midwidth = window.innerWidth/2
filecontainer.style.top = midheight + 'px'
let isShift = false;
let isCtl = false;
let isMeta = false;

// center file upload
fileobj.buttons.img.style.top = ((filecontainer.clientHeight/2) + (header.clientHeight)) + "px"
fileobj.buttons.img.style.left =((window.innerWidth/2)) + "px"


// upload a file
for(let i in fileobj.buttons){
    fileobj.buttons[i].onclick = () => getFiles(fileobj.input)
}

// onchange when choosing a file or cancelling
fileobj.input.onchange = e => fileSystemChange(e)







// functions

// getFiles 
function getFiles(system){
return !system ? console.error('file system is undefined.\nCheck and try again') : system.click();
}

// filesystem change
function fileSystemChange(e){
    let files = e.currentTarget.files || undefined;
    let container = fileobj.imgcontainer
    
    // cleanup leftover files
    let existing_files = [...container.children]||null;
    if(existing_files) existing_files.map(file=>file.remove());

    // if files exist
    if(files.length > 0){ 
        // shift upload button down
        fileobj.buttons.img.style.top =((filecontainer.clientHeight)) + "px"
        container.classList.remove('hidden')
        for(let i = 0; i < files.length; i++){ // iterate through files
            currfile = files[i]; // store file in variable

            // create a div to represent the file
            let div = document.createElement('div')
            div.classList.add('file-obj-div')
            div.classList.add('unselected')
            div = handleFileByType(currfile,div) // return div and store in div
            container.appendChild(div) // append div to container
            // if getMedia file === currfile
            if(div.getMedia === currfile){
                // select files
                div.onclick = clickFile
            }
        }
        
    } else {
        container.classList.add('hidden')
    } 
}

// handle file by type
function handleFileByType(file,div){
    const type = file.type;
    let type_pre = type.split`/`[0];
    // create object property for the general type 
    file.genType = type_pre;
    // main.js:73 image/jpeg
    // main.js:73 image/png
    // main.js:73 text/rtf
    switch(true){ // as long as file is true
        case /text/gi.test(type):
        file.element = document.createElement('p')
        // method
        console.log('this is a Text File')
        break;
        case /image/gi.test(type):
        console.log('this is a Image File')
        if(/png/gi.test(type)){
            console.log('this is a png file')
        }
        if(/jpg/gi.test(type)){
            console.log('this is a jpg file')
        }
        if(/jpeg/gi.test(type)){
            console.log('this is jpeg file')
        }
        if(/svg/gi.test(type)){
            console.log('this is a svg file')
        }
        
        if(/gif/gi.test(type)){
            console.log('this is a gif file')
        }
        if(/bmp/gi.test(type)){
            console.log('this is a bmp file')
        }
        
        break;
        case /video/gi.test(type):
        file.element = document.createElement('video')

            // method
        if(/avi/gi.test(type)){
            console.log('this is a avi file')
        }
        if(/wmv/gi.test(type)){
            console.log('this is a wmv file')
        }
        if(/mp4/gi.test(type)){
            console.log('this is a mp4 file')
        }
        if(/mov/gi.test(type)){
            console.log('this is a mov file')
        }
        if(/flv/gi.test(type)){
            console.log('this is a flv file')
        }
        break;
        case /audio/gi.test(type):
        file.element = document.createElement('audio')
            // method 
        if(/ogg/gi.test(type)){
            console.log('this is a ogg file')
        }
        if(/ogg/gi.test(type)){
            console.log('this is a ogg file')
        }
        if(/m4a/gi.test(type)){
            console.log('this is a m4a file')
        }
        if(/flac/gi.test(type)){
            console.log('this is a flac file')
        }
        if(/mp3/gi.test(type)){
            console.log('this is a mp3 file')
        }
        if(/wav/gi.test(type)){
            console.log('this is a wav file')
        }
        break;
        default:
            console.log(undefined);
        break;
    }
    div.getMedia = file;
    div.selected = false;
    return div; // return the file
}
let selectedFiles = []
function clickFile(e){
    const listing = e.currentTarget;
    const filemedia = listing.getMedia;
    let parent = listing.parentElement;

    // true/false change onclick
    listing.selected = !listing.selected;
        
    // if Ctk and Shift is not pressed
    if(isShift === false && isCtl === false && isMeta === false){
    }
    else {
        
    // update total selected count

    }
    
    
    

    

    
}

// window events

// resize
window.onresize = e => {
    // resize fileobj.buttons 
    fileobj.buttons.img.style.top = ((filecontainer.clientHeight/2) + (header.clientHeight)) + "px"
    fileobj.buttons.img.style.left =((window.innerWidth/2)) + "px"
}

window.onkeydown = e => {
console.log("keydown: "+e.key)
    if(/Shift/.test(e.key)){
        isShift = true;
    }
    if(/Control/.test(e.key)){
        isCtl = true;

    }
    if(/Meta/.test(e.key)){
        isMeta = true;
    }
}
window.onkeyup = e => {
    console.log("keyup: "+e.key)
}