//imports
import { pushNotification } from './notification.js'
import { list_item, fileobj, tools } from './general.js';
import { filesize } from './handleFileSize.js';

// variables
const myform = document.getElementById('uploads');
let scrollbar = document.getElementById('scrollbar')
let scrolltab = document.getElementById('scrolltab')
const filecontainer = document.getElementById('file-container')
const header = document.getElementById('header-mast')
const garbage = document.getElementById('garbage-img-tool');
const caps = document.getElementById('caps-img-tool')
const shift = document.getElementById('shift-img-tool')
const ctrl = document.getElementById('ctrl-img-tool')
const command = document.getElementById('command-img-tool')
const stopper = document.getElementById('stop-img-tool')
const fileinfo = document.getElementById('file-info');
const select_counter = document.querySelector('.select-counter')
const holdcontainer = document.getElementById('file-hold-container')
const notificationCenter = document.getElementById('notification-center')
const mainupload = document.getElementById('upload-img')
const mvbg = document.getElementById('mv-bg2');
const fileOptions = document.getElementById('file-options')
let garbage_clone = garbage.cloneNode(true)
    garbage_clone.setAttribute('id','garbage-img-clone')
    garbage_clone.classList.add('garbage-clone')
let selectedFiles = []
let selectall = []

let isShift = false, shiftInit = false;
let isCtl = false;
let isMeta = false;

let [keyisdown,keyisdown1] = [false,false]

myform.onsubmit = e => e.preventDefault()

// functions
// getFiles
export function getFiles(system){
return !system ? console.error('file system is undefined.\nCheck and try again') : system.click();
}
// delete files fn
export function deleteFiles(files,elements,selectedFiles){
    // delete indication
    files.map(x=>{
        unselectEntity(x);
        files.forEach((a,b)=>{
            a.remove();
            postFetch('json','/tmp/delete',{file:a}); // delete the file form server
        });
            selectedFiles = [];
            updateFileCounter(elements,selectedFiles.length)
    })
    let getFilesNow = document.querySelectorAll('.file-obj-entity');
    if(getFilesNow.length < 1){
        fileinfo.classList.add('hidden')
        fileobj.buttons.img.classList.remove('hidden')
        fileobj.buttons.img.style.top = ((filecontainer.clientHeight/2) + (header.clientHeight)) + "px"
        fileobj.buttons.img.style.left =((window.innerWidth/2) - fileobj.buttons.img.clientWidth/2) + "px"
    }
    return selectedFiles;

}
// filesystem change
export function fileSystemChange(e){
    
    let files = e.currentTarget.files || undefined;
    let element = e.currentTarget.element || undefined;
    let container = fileobj.imgcontainer


    // if files exist
    const maxFiles = 25;
    if((files.length > 0 && (files.length+document.querySelectorAll('.file-obj-entity').length) <= maxFiles)){
        let objtypes = list_item.type;
        // shift upload button down
        fileobj.buttons.img.classList.add('hidden')
        fileinfo.classList.remove('hidden')
        container.classList.remove('hidden');
        for(let i = 0; i < files.length; i++){ // iterate through files
            if([...container.children].filename !== files[i].name){
                uploadFiles(container,objtypes,filesize,scrollbar,files[i],{fetch:true})
            }
            // console.log(files[i])
        }

        // submit form
        myform.submit()
        // postFetch('media','/upload',new FormData(document.getElementById('uploads')))
        
    } else {
        let type = 'error'
        let text = `${type.replace(/^e/i,'E')}:\nUpload Limit reached\nMaximum: ${maxFiles}`
        container.classList.add('hidden');
        // console.log(type + ": " + 'Sorry, but too many files have been uploaded')
        let counter = 0;
        pushNotification(notificationCenter,text,type,counter) // if error, fire function 1 time

    }
}
// file counter
export function updateFileCounter(elements,num){
    let [file,garbage,garbage_clone] = elements;
    file.textContent = file.textContent.replace(/\d*$/,num)
    if(file){
        // console.log(file)
        if(num > 0){
            enableElement(elements)
        }
        else {
            disableElement(elements)
        }
    } else {
        // console.log('element not detected for counting files')
        return false;
    }
}
// switch view
export function switchView(lis,target,container){
    let type = target.id.split('-')[0];
    // console.log(type)
    switch(true){
        // list view
        case type == 'list':
        list_item.type.tile = false;
        list_item.type.list = true;
        lis.forEach(li=>{
            let imgparent = [...li.children].find(x=>x.classList.contains('img-parent'));
            let imgchild = imgparent.children[1];
            let imgtext = imgparent.children[0]
            // imgtext.remove()
            // console.log(imgchild)
            li.classList.remove('file-obj-tile')
            li.classList.add('file-obj-list')
            imgchild.classList.remove('file-icon-img-tile')
            imgchild.classList.add('file-icon-img-list')
            
        })
        container.classList.add('hold-col')
        container.classList.remove('hold-row')
        container.classList.add('parent-list')
        container.classList.remove('parent-tile')
        break;

        // tile view
        case type == 'tile':
        list_item.type.list = false;
        list_item.type.tile = true;
        lis.forEach(li=>{
            let imgparent = [...li.children].find(x=>x.classList.contains('img-parent'));
            let imgchild = imgparent.children[1];
            // console.log(imgchild)
            li.classList.add('file-obj-tile')
            li.classList.remove('file-obj-list')
            imgchild.classList.remove('file-icon-img-list')
            imgchild.classList.add('file-icon-img-tile')
        })
        container.classList.remove('parent-list')
        container.classList.add('parent-tile')
        container.classList.remove('hold-col')
        container.classList.add('hold-row')
        break;

        // enable scroll
        case type == 'scroll':
            
            list_item.type.list;
            list_item.type.tile;
            let scrollbar = [...target.children].find(element=>element.id==='scrollbar');
            enableScroll(scrollbar,filesize)
        // lis.forEach(li=>{
        //     let imgparent = [...li.children].find(x=>x.classList.contains('img-parent'));
        //     let imgchild = imgparent.children[1];
        //     // console.log(imgchild)
        //     li.classList.add('file-obj-tile')
        //     li.classList.remove('file-obj-list')
        //     imgchild.classList.remove('file-icon-img-list')
        //     imgchild.classList.add('file-icon-img-tile')
        // })
        
        break;
        default:
            console.log(undefined)
    }
}
// select entity
export function selectEntity(elem){
    elem.classList.add('selected');
    elem.classList.remove('unselected');
    elem.classList.remove('deleted-item');
}
// unselect entity
export function unselectEntity(elem){
    elem.classList.remove('selected');
    elem.classList.add('unselected');
    elem.classList.remove('deleted-item');
}

// upload files
function uploadFiles(container,objtypes,filesize,scrollbar,fileOfI,options={fetch:false,type:undefined, file:undefined}){
        let currfile = fileOfI; // store file in variable      
        let result;     
            // create a div to represent the file
            let li = document.createElement('li')
            let img = {
                file:document.createElement('img'),
                folder:document.createElement('img'),
                img_parent:document.createElement('a'),
                filetype:!options.fetch ? currfile.type.split`/`[1].replace(/x-ms-/g,'').replace(/\+xml/g,'') : options.type,
                p:document.createElement('p'),
            };
            img.p.textContent = !options.fetch ? currfile.name : options.file
            img.file.classList.add('file-icon-img');
            img.file.src = `./media/${'file'}-img.png`; // file src
            li.classList.add('file-obj-entity')
            img.p.classList.add('img-type')
            img.img_parent.classList.add('img-parent')
            img.img_parent.appendChild(img.p)
            img.img_parent.appendChild(img.file)
            li.appendChild(img.img_parent);
            
            let imgparent = [...li.children].find(x=>x.classList.contains('img-parent'));
            let imgchild = imgparent.children[1];
            // let imgtext = imgparent.children[0];

        
            // list or tile ? 
            for(let prop in objtypes){
                if(objtypes[prop]==true){
                    li.classList.add(`file-obj-${prop}`)
                    imgchild.classList.add(`file-icon-img-${prop}`)
                } else {
                    li.classList.remove(`file-obj-${prop}`)
                    imgchild.classList.remove(`file-icon-img-${prop}`)
                }

                        if(filesize==undefined){
                            result = imgchild.width + "px";
                        } else {
                            result = String(filesize).replace(/px/ig,'') + "px"
                        }
                    imgchild.style.width = result;
            }

            unselectEntity(li)
            li = handleFileByType(currfile,li,options) // return div and store in div
            container.appendChild(li) // append div to container
            // if getMedia file === currfile
            if(li.getMedia === currfile){
                // select files
                li.onclick = handleFileSelection
                // li.onmouseover = hoverFn
                // li.onmouseout = hoverOutFn
            }
}
// handle file by type
function handleFileByType(file,div,options){ // pass a file (file)
    // console.log(file)
    let type, type_pre;
    if(!options.fetch){
        type = file.type;
        type_pre = type.split`/`[0];
        // create object property for the general type
        file.genType = type_pre;
    } else {
        type = options.type;
        type_pre = type
        // create object property for the general type
        file.genType = type_pre;
    }
    // main.js:73 image/jpeg
    // main.js:73 image/png
    // main.js:73 text/rtf
    switch(true){ // as long as file is true
        case /text/gi.test(type):
        file.element = document.createElement('p')
        // method
            // console.log('this is a Text File')
        break;
        case /image/gi.test(type):
            // console.log('this is a Image File')
        if(/png/gi.test(type)){
            // console.log('this is a png file')
        }
        if(/jpg/gi.test(type)){
            // console.log('this is a jpg file')
        }
        if(/jpeg/gi.test(type)){
            // console.log('this is jpeg file')
        }
        if(/svg/gi.test(type)){
            // console.log('this is a svg file')
        }
        if(/gif/gi.test(type)){
            // console.log('this is a gif file')
        }
        if(/bmp/gi.test(type)){
            // console.log('this is a bmp file')
        }

        break;
        case /video/gi.test(type):
        file.element = document.createElement('video')

            // method
        if(/avi/gi.test(type)){
            // console.log('this is a avi file')
        }
        if(/wmv/gi.test(type)){
            // console.log('this is a wmv file')
        }
        if(/mp4/gi.test(type)){
            // console.log('this is a mp4 file')
        }
        if(/mov/gi.test(type)){
            // console.log('this is a mov file')
        }
        if(/flv/gi.test(type)){
            // console.log('this is a flv file')
        }
        break;
        case /audio/gi.test(type):
        file.element = document.createElement('audio')
            // method
        if(/ogg/gi.test(type)){
            // console.log('this is a ogg file')
        }
        if(/ogg/gi.test(type)){
            // console.log('this is a ogg file')
        }
        if(/m4a/gi.test(type)){
            // console.log('this is a m4a file')
        }
        if(/flac/gi.test(type)){
            // console.log('this is a flac file')
        }
        if(/mp3/gi.test(type)){
            // console.log('this is a mp3 file')
        }
        if(/wav/gi.test(type)){
            // console.log('this is a wav file')
        }
        break;
        default:
            console.log(undefined);
        break;
    }
    div.getMedia = file;
    div.selected = false;
    div.filename = options.file
    return div; // return the file
}
function handleFileSelection(e){
    const listing = e.currentTarget;
    let children = [...listing.parentElement.children]

    // the listing's selected status will toggle
    listing.selected = !listing.selected;

    // single file selection
    if(isShift === false && isCtl === false && isMeta === false) {
        // console.log('button is not pressed')
        selectedFiles = handleSingleSelection(children,listing,selectedFiles)
    }
    // multi file selection
    else {
        selectedFiles = handleMultiSelection(children,listing,selectedFiles)
    }
    // console.log(selectedFiles)

    // update filecounter
    updateFileCounter([select_counter,garbage,garbage_clone],selectedFiles.length)


}
// handle single selection
function handleSingleSelection(children,target,arr){
    if((arr.length===1 && target === arr[0])){
        unselectEntity(target); // unselect the entity
        arr.splice(arr.indexOf(target),1) // remove 1 from target's index
    } else {
        shiftInit = true;
        arr = []; // reset arr
        // if target exists
        if(target && children.includes(target)){
            // map children
                children = [...children].filter(w=>w!=target).map(x=>{
                // unselect all children, but not target
                unselectEntity(x)
                x.selected = false;
        })
        
        selectEntity(target)
        arr.push(target)
    }
    }
    return arr; // return selected file
    
}
// handle multi selection
function handleMultiSelection(children,target,arr){
    // if target exists
    if(target){
        let start,end;
        if(isMeta === true || isCtl === true){
            if(target.selected===true){
                selectEntity(target)
                // arr.indexOf(target)===-1 ? arr.push(target) : null;
                arr.push(target)
            }
            if(target.selected===false){
                // console.log('target is false')
                unselectEntity(target)
                arr.splice(arr.indexOf(target),1)
            }
                start = !end ? arr[arr.length-1] : end
                // console.log(start)
        }
        if(isShift===true && arr.length > 0){
            // reset shift selection            
            if(arr){
                // id start
                start = !start ? arr[arr.length-1] : start;
                // console.log(start)
                // id end
                end = target
                selectEntity(end)
                // console.log(end)

                if(children.indexOf(start) < children.indexOf(end)){
                    // going down
                    for(let i = children.indexOf(start); i <= children.indexOf(end); i++){
                        arr.indexOf(children[i])<0?arr.push(children[i]):null // push related elements into array
                        
                        // if(children[i].selected===false){
                            children[i].selected = true;
                            selectEntity(children[i])
                        // }
                    }
                } 
                if(children.indexOf(start) > children.indexOf(end)){
                    for(let j = children.indexOf(start); j >= children.indexOf(end); j--){
                        arr.indexOf(children[j])<0?arr.push(children[j]):null // push related elements into array
                        
                        // if(children[j].selected===false){
                            selectEntity(children[j])
                            children[j].selected = true;
                        // }
                    }
                }

            } else {
                console.log("Use Single Selection before using Shift")
            }

                let stidx = children.indexOf(start)
                let enidx = children.indexOf(end)
            
                // console.log(stidx)
                // console.log(enidx)

                
                // unselect the rest from end to < start 
                children.forEach((x,y)=>{
                    if(x.selected==true){
                        // console.log(stidx,enidx)
                        if(shiftInit === false && y <= stidx && y > enidx){
                            // console.log(x)
                            unselectEntity(x)
                            arr = arr.filter(z=>z!=x);
                        }
                    }
                })
                for(let i = 0; i < arr.length; i++){
                    if(arr[i]==arr[i+1]){
                        arr.splice(i+1,1)
                    }
                }
                updateFileCounter([select_counter,garbage,garbage_clone],arr.length)
                shiftInit = false;
                start = end
                // console.log(arr)
        };
    }
    return arr; // return selected file
}
function dealWithSelectCounterBySize(window,counter){
    let count_select = counter;

    if(window.innerWidth <= 900){
    count_select.textContent = count_select.textContent.replace(/ected/g,'')
    } else {
        let first = count_select.textContent.split`:`[0], last = count_select.textContent.split`:`[1]
        first = 'Selected';

        !/selected/g.test(count_select.textContent) ? count_select.textContent = first+": "+last : null;
    }
}
// show deleted item(s)
function showDeleted(x){
    x.classList.add('deleted-item')
}
// check if client is using a mac device
function isMacintosh(agent){
    return /macintosh?/ig.test(agent) ? true : false;
}
// check if client is using a windows device
function isWindows(agent){
    return /Window?/ig.test(agent) ? true : false;
}
// iterate through tools
tools.forEach(t=>{
    t.onclick = e => {
    // if there is at least 1 file present
    if(document.querySelectorAll('.file-obj-entity').length >= 1){
        isShift = false;
        isMeta = false;
        isCtl = false;

        const item = e.currentTarget
        tools.forEach(tool=> {
        tool.classList.add('disabled-tool');
        })
        // enable tool
        if(item.classList.contains('disabled-tool')){
            // enable tool
            item.classList.remove('disabled-tool')
        }
        handleTool(item)
    }
}
})
function handleTool(tool){
    let id = tool.id.split`-`[0]
    if(!/stop/i.test(id)){
        stopper.classList.remove('disabled-tool')
    }
    // console.log(id)
    switch(true){
    case /ctrl/i.test(id):
        isCtl = true;
    break;
    case /command/i.test(id):
        isMeta = true;
    break;
    case /shift/i.test(id) && shiftInit === true:
        isShift = true;
    break;
    case /stop/i.test(id):
        // console.log('you clicked stop!')
        tool.classList.add('disabled-tool')
        isCtl = false;
        isMeta = false;
        isShift = false;
    break;
    default:
        console.log(undefined);
    break;
    }
}
// disable element
function disableElement(elements){
return elements.forEach(x=>x.classList.add('no-pointer'))
}
// enable element
function enableElement(elements){
return elements.forEach(x=>x.classList.remove('no-pointer'))
}
// enable scroll
function enableScroll(target,filesize){
    scrolltab.style.left = !filesize ? (document.querySelector('.file-icon-img')?document.querySelector('.file-icon-img').width:0) + "px" : filesize + "px"
    target.classList.remove('close-scroll')
    target.classList.add('open-scroll')
}
// disable scroll
function disableScroll(target){
    target.classList.add('close-scroll')
    target.classList.remove('open-scroll')
    // console.log(target)
    let tab = [...target.children].find(t=>t.id=='scrolltab' && t.tagName=='SPAN');
    // console.log(tab)
    if(tab){
        tab.style.left = 0 + "px";
    }
}


scrolltab.onclick = e => {
    // console.log('target is clicked');
    if(filesize) e.currentTarget.style.left = filesize
    // console.log(filesize)
    // console.log(e.currentTarget);
}


// window events
// resize
window.onresize = e => {
    // resize fileobj.buttons
    if(document.querySelectorAll('.file-obj-entity').length >= 1){
        // console.log('files exist so button should stay')
        fileobj.buttons.img.style.top = ((filecontainer.clientHeight/2) + (header.clientHeight)) + "px"
    }
    fileobj.buttons.img.style.left =((window.innerWidth/2) - fileobj.buttons.img.clientWidth/2) + "px"

    // if screenwidth is mobile size
    dealWithSelectCounterBySize(window,select_counter)

}
window.onkeydown = e => {
        isShift = false;
        isMeta = false;
        isCtl = false;
    let allFiles = [...document.querySelectorAll('.file-obj-entity')]
    // if there is at least 2 file present
    if(document.querySelectorAll('.file-obj-entity').length >= 1){
        tools.forEach(tool=> {
        tool.classList.add('disabled-tool');
        })
    if(/Shift/.test(e.key)){
        isShift = true;
        shift.classList.remove('disabled-tool')
    }
    if(/Control/.test(e.key)){
        isCtl = true;
        ctrl.classList.remove('disabled-tool')
    }
    if(/Meta/.test(e.key) && isMacintosh){
        isMeta = true;
        command.classList.remove('disabled-tool')
    }
    if(/(Delete|Backspace)/i.test(e.key) && !garbage.classList.contains('no-pointer')){
        garbage.click();
        // console.log('garbage - remote click')
        isShift = false;
        isMeta = false;
        isCtl = false;
    }
    }
    if(/(capslock)/i.test(e.key)){
        let state = e.getModifierState(e.key);
        if(state){
            caps.classList.remove('no-pointer');
            caps.src = './media/caps-tool-green.png'
        }
    }
    // ctrl + a
    if(/(Meta|Control)/i.test(e.key)){
        keyisdown = true;
        selectall.push(e.key);
    }
    if(/^a$/i.test(e.key) && keyisdown === true){
        keyisdown1 = true;
        selectall.push(e.key);
    }
    selectall = selectall.slice(-2);

    if(keyisdown==true && keyisdown1==true && /(Meta|Control)/i.test(selectall[0])&&selectall[1]=='a'){
            selectedFiles = [...allFiles];
            allFiles.forEach((f,idx)=>{
                f.classList.add('selected')
                selectEntity(f);
                updateFileCounter([select_counter,garbage,garbage_clone],selectedFiles.length)
                f.selected = true;
            })
        }
}
window.onclick = e => {
    // console.log(e.target)
    let regex = /scroll(bar|tab|\-hr)/ig;
    let mousemove = e.currentTarget.mousemove || false;

    if(e.target.id == 'scroll-close'){
        scrolltab.classList.add('qt-trans-5')
        scrolltab.style.left = 0
        e.currentTarget.mousemove = false;
        mousemove = false;
    }

    if(!regex.test(e.target.id) && scrollbar.classList.contains('open-scroll') && mousemove==false) disableScroll(scrollbar);
    
}
window.onkeyup = e => {
    keyisdown1 = false;
    keyisdown = false;
    // if there is at least 2 file present
    if(document.querySelectorAll('.file-obj-entity').length >= 1){
    if(/Shift/i.test(e.key)){
        isShift = false;
        shift.classList.add('disabled-tool')
    }
    if(/(Meta|Control)/i.test(e.key)){
        isCtl = false;
        ctrl.classList.add('disabled-tool');
    }
    // if(/^a$/i.test(e.key)){
    //     keyisdown1 = false;
    // }
    if(/Meta/i.test(e.key) && isMacintosh){
        isMeta = false;
        command.classList.add('disabled-tool')
    }
    }
    if(/(capslock)/i.test(e.key)){
        let state = e.getModifierState(e.key);
        if(!state){
            caps.src = './media/caps-tool.png'
            caps.classList.add('no-pointer');
        }
    }

    if(keyisdown==false && keyisdown1 == false)
    {
        document.body.classList.remove('hidden')
    }
}
window.onscroll = e => {
    let scrollY = window.scrollY;
    let start = 100;
    let garbages = [garbage_clone,garbage]
    if([...document.querySelectorAll('.file-obj-entity')].length > 0){
        if(scrollY > start){ // if scrollY > 0 (top page)
            // send file-options to fixed position
            sendToFixed(fileOptions)


            holdcontainer.appendChild(garbage_clone)
            garbages.forEach(garbage=>{
                let otherGarbage;
                garbage.onclick = e => {
                    otherGarbage = garbages.find(g=>g!==e.currentTarget);

                    isShift = false;
                    isCtl = false;
                    isMeta = false;
                    
                    tools.forEach(tool=> {
                        tool.classList.add('disabled-tool');
                    })
            
                    if(!e.currentTarget.classList.contains('no-pointer')){
                        let currSelectedFiles = [...document.querySelectorAll('.file-obj-entity')].filter(x=>x.selected===true);
            
                        selectedFiles = deleteFiles(currSelectedFiles,[select_counter,e.currentTarget,otherGarbage],selectedFiles)
                    } else {
                        console.log('garbage is disabled!')
                    }
                }
            })
        
        } else {
            // send file-options to absolute position
            sendToAbsolute(fileOptions)
            garbage_clone.remove();
        }
    } else {
        // console.log('we need files before scroll fn works')
    }
}

// window onload
window.onload = async e => {
    // fetch existing files from /tmp directory
    const tmpFiles = await fetch('/tmp/check',{method:'GET'}).then(r=>r.json()).then(d=>d.data) // check if tmp directory exists
    let alldata = getExistingData(await tmpFiles,filesize)
    
    alldata.length > 0 ? fileobj.buttons.img.classList.add('hidden') : fileobj.buttons.img.classList.remove('hidden');
    let nums = [1,2,3];
    mvbg.style.backgroundImage = `url('./media/bg${nums[Math.floor(Math.random()*nums.length)]}.jpg')`;
    
    dealWithSelectCounterBySize(window,select_counter)
    // get the device type
    const agent = window.navigator.userAgent;

    // if device is a mac
    if(isMacintosh(agent)){
        command.classList.remove('hidden');
    } else {
        command.classList.add('hidden');
    }
    // if device is windows
    if(isWindows(agent)){
        command.classList.add('hidden');
    }

    // set timeout for upload img to appear (main)
    setTimeout(()=>{
        mainupload.classList.remove('passive-hidden')
    },1000)
}
// get existing data
function getExistingData(tmp,filesize){
    let container = fileobj.imgcontainer
    let objtypes = list_item.type
    let currentimg;
    let allimages = []
    for(let i in tmp){ // iterate through files
        if(tmp[i].image && tmp[i].image.length > 0) currentimg = tmp[i];
        // console.log(currentimg)
        for(let j in currentimg){

            if(/^image$/i.test(j)){
                // console.log(currentimg[j])
                let img = currentimg[j]; // get file,
                let typeOf = i
                // push image into allimages
                img.forEach(ig => allimages.indexOf(ig)==-1 ? allimages.push(ig) : null)
                // function uploadFiles(container,objtypes,filesize,scrollbar,fileOfI,options={fetch:false,type:undefined}){
                img.map(image => uploadFiles(container,objtypes,filesize,scrollbar,tmp[i],{fetch:true,type:typeOf,file:image}))
            }
        }
    }
    return allimages;
}
function sendToAbsolute(element){
    element.classList.add('absolute');
    element.classList.remove('fixed');
}
function sendToFixed(element){
    element.classList.remove('absolute');
    element.classList.add('fixed');
}

async function postFetch(type,url,body){
    let response
    switch(true){
        case type=='media':
        response = await fetch(url,{headers:{'Content-Type':'multipart/form-data'},method:'POST',body:body})
        
        break;

        case type=='json':
        response = await fetch(url,{headers:{'Content-Type':'application/json'},method:'POST',body:JSON.stringify(body)})
        
        break;
    }
    return response
}
