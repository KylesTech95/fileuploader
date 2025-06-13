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
let isShift = false;
let isCtl = false;
let isMeta = false;

// center file upload
fileobj.buttons.img.style.top = ((filecontainer.clientHeight/2) + (header.clientHeight)) + "px"
fileobj.buttons.img.style.left =((window.innerWidth/2)) + "px"

// position container
filecontainer.style.top = midheight + 'px'

// upload a file
for(let i in fileobj.buttons){
    fileobj.buttons[i].onclick = () => getFiles(fileobj.input)
}
// onchange when choosing a file or cancelling
fileobj.input.onchange = e => fileSystemChange(e)



garbage.onclick = e => {
    if(!garbage.classList.contains('no-pointer')){
        let currSelectedFiles = [...document.querySelectorAll('.file-obj-div')].filter(x=>x.selected===true);

        deleteFiles(currSelectedFiles,fileobj.imgcontainer)
    } else {
        console.log('garbage is disabled!')
    }
}
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
            unselectEntity(div)
            div = handleFileByType(currfile,div) // return div and store in div
            container.appendChild(div) // append div to container
            // if getMedia file === currfile
            if(div.getMedia === currfile){
                // select files
                div.onclick = handleFileSelection
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
function handleFileSelection(e){
    const listing = e.currentTarget;
    let children = [...listing.parentElement.children]

    // the listing's selected status will toggle
    listing.selected = !listing.selected;
    
    // single file selection
    if(isShift === false && isCtl === false && isMeta === false) {
        console.log('button is not pressed')
        selectedFiles = handleSingleSelection(children,listing,selectedFiles)
    }
    // multi file selection
    else {
        console.log('button is pressed')
        selectedFiles = handleMultiSelection(children,listing,selectedFiles)
    }
    console.log(selectedFiles)
    
    // update filecounter
    updateFileCounter([select_counter,garbage],selectedFiles.length)

    
}
// handle single selection
function handleSingleSelection(children,target,arr){ 
    arr = []; // reset arr
    // if target exists
    if(target && children.includes(target)){
        // map children
            children = [...children].filter(w=>w!=target).map(x=>{
            // unselect all children, but not target
            unselectEntity(x)
            x.selected = false;
    })
    
        if(target.selected === true){
            selectEntity(target)
            arr.push(target)
        }
        if(target.selected === false){
           unselectEntity(target)
           arr.splice(arr.indexOf(target),1)
        }
    }
    return arr; // return selected file
}
// handle multi selection
function handleMultiSelection(children,target,arr){ 
    // if target exists
    if(target){
        if(isMeta === true || isCtl === true){
            if(target.selected===true){
                // console.log('target is true')
                selectEntity(target)
                console.log(arr.indexOf(target))
                arr.indexOf(target)===-1 ? arr.push(target) : null;
                console.log(arr)
            } 
            if(target.selected===false){
                // console.log('target is false')
                unselectEntity(target)
                arr.splice(arr.indexOf(target),1)
            }
        } 
        if(isShift===true){
            selectEntity(target)
        }
    } 
    return arr; // return selected file
}
// select entity
function selectEntity(elem){
    elem.classList.add('selected');
    elem.classList.remove('unselected');
    elem.classList.remove('deleted-item');
}
// unselect entity
function unselectEntity(elem){
    elem.classList.remove('selected');
    elem.classList.add('unselected');
    elem.classList.remove('deleted-item');
}
// show deleted item(s)
function showDeleted(x){
    x.classList.add('deleted-item')
}
// check if client is using a mac device
function isMacintosh(agent){
    return /macintosh?/ig.test(agent) ? true : false;
}
// file counter
function updateFileCounter(elements,num){
    let [file,garbage] = elements;
    file.textContent = file.textContent.replace(/\d*$/,num)
    if(file){
        console.log(file)
        if(num > 0){
            enableElement(elements)
        }
        else {
            disableElement(elements)
        }
    } else {
        console.log('element not detected for counting files')
        return false;
    }
}
function disableElement(elements){
return elements.forEach(x=>x.classList.add('no-pointer'))
}
function enableElement(elements){
return elements.forEach(x=>x.classList.remove('no-pointer'))
}

// delete files fn
function deleteFiles(files,filecontainer){
    console.log(filecontainer)
    console.log(files)

    // delete indication
    files.map(x=>{
        unselectEntity(x);
        showDeleted(x)
    })
    
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
    if(/Control/.test(e.key) && !isMacintosh){
        isCtl = true;

    }
    if(/Meta/.test(e.key) && isMacintosh){
        isMeta = true;
    }
}
window.onkeyup = e => {
    if(/Shift/.test(e.key)){
        isShift = false;
    }
    if(/Control/.test(e.key) && !isMacintosh){
        isCtl = false;

    }
    if(/Meta/.test(e.key) && isMacintosh){
        isMeta = false;
    }
}
