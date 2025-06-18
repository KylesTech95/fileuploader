// variables
const filecontainer = document.getElementById('file-container')
const header = document.getElementById('header-mast')
const garbage = document.getElementById('garbage-img-tool');
const caps = document.getElementById('caps-img-tool')
const shift = document.getElementById('shift-img-tool')
const ctrl = document.getElementById('ctrl-img-tool')
const command = document.getElementById('command-img-tool')
const stopper = document.getElementById('stop-img-tool')
const fileinfo = document.getElementById('file-info');
const fileobj = new Object({
    input:document.getElementById('file-id'),
    buttons:{
        img:document.getElementById('upload-img'),
        tool:document.getElementById('upload-img-tool'),
        footer:document.querySelector('.footer-img')
    },
    imgcontainer:document.getElementById('file-hold-container'),
})
const select_counter = document.querySelector('.select-counter')
let list_item = {
    type:{
        list:true,
        tile:false
    }
}

//________________________________
// set file upload icon to middle of screen
let midheight = window.innerHeight/2
let midwidth = window.innerWidth/2
let isShift = false;
let isCtl = false;
let isMeta = false;

// center file upload
fileobj.buttons.img.style.top = ((filecontainer.clientHeight/2) + (header.clientHeight)) + "px"
fileobj.buttons.img.style.left =((window.innerWidth/2) - fileobj.buttons.img.clientWidth/2) + "px"

// position container
filecontainer.style.top = midheight + 'px'

// upload a file
for(let i in fileobj.buttons){
    fileobj.buttons[i].onclick = () => getFiles(fileobj.input)
}
// onchange when choosing a file or cancelling
fileobj.input.onchange = e => fileSystemChange(e)

// garback onclick event
garbage.onclick = e => {
    isShift = false;
    isCtl = false;
    isMeta = false;
    
    tools.forEach(tool=> {
        tool.classList.add('disabled-tool');
    })

    if(!e.currentTarget.classList.contains('no-pointer')){
        let currSelectedFiles = [...document.querySelectorAll('.file-obj-entity')].filter(x=>x.selected===true);

        selectedFiles = deleteFiles(currSelectedFiles,[select_counter,e.currentTarget],selectedFiles)
    } else {
        console.log('garbage is disabled!')
    }
}

// iterate through tools
let tools = [ctrl,shift,command,stopper]
tools.forEach(t=>{
    t.onclick = e => {
    // if there is at least 2 file present
    if(document.querySelectorAll('.file-obj-entity').length >= 1){
        isShift = false;
        isMeta = false;
        isCtl = false;

        const item = e.currentTarget
        tools.forEach(tool=> {
        tool.classList.add('disabled-tool');
        })
        // caps is active
        if(item.classList.contains('disabled-tool')){
            // enable
            item.classList.remove('disabled-tool')
        }
        handleTool(item)
    }
}
})


let views = [...document.querySelectorAll('.view-tool')];
views.forEach(view=>{
    view.onclick = e => {
        console.log(e.currentTarget)
        views.forEach(v=>v.children[0].classList.add('disabled-tool'))
        let viewchildren = [...e.currentTarget.children]
        for(let i = 0; i < viewchildren.length; i++){
            console.log(viewchildren[i])
            viewchildren[i].classList.remove('disabled-tool')
        }
        switchView(document.querySelectorAll('.file-obj-entity'),e.currentTarget,document.getElementById('file-hold-container'))
}
})
//________________________________
// functions

function switchView(lis,target,container){
    
    let type = target.id.split('-')[0];
    console.log(type)
    switch(true){
        case type == 'list':
        list_item.type.tile = false;
        list_item.type.list = true;
        console.log('list view')
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
        container.classList.add('hold-col')
        console.log('tile view')
        container.classList.remove('parent-list')
        container.classList.add('parent-tile')
        break;
        default:
            console.log(undefined)
    }
}
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
    case /shift/i.test(id):
        isShift = true;
    break;
    case /stop/i.test(id):
        console.log('you clicked stop!')
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
// getFiles
function getFiles(system){
return !system ? console.error('file system is undefined.\nCheck and try again') : system.click();
}
// filesystem change
function fileSystemChange(e){
    
    let files = e.currentTarget.files || undefined;
    let element = e.currentTarget.element || undefined;
    let container = fileobj.imgcontainer

    // cleanup leftover files
    // cleanUpExistingFiles(container)

    // if files exist
    const maxFiles = 10;
    if(files.length > 0 && files.length < maxFiles){
        let objtypes = list_item.type;
        // shift upload button down
        fileobj.buttons.img.classList.add('hidden')
        fileinfo.classList.remove('hidden')
        container.classList.remove('hidden');
        for(let i = 0; i < files.length; i++){ // iterate through files
            currfile = files[i]; // store file in variable            
            // create a div to represent the file
            let li = document.createElement('li')
            let img = {
                file:document.createElement('img'),
                folder:document.createElement('img'),
                img_parent:document.createElement('a'),
                filetype:currfile.type.split`/`[1].replace(/x-ms-/g,'').replace(/\+xml/g,''),
                p:document.createElement('p'),
            };
            console.log(element)
            img.p.textContent = currfile.name
            img.file.classList.add('file-icon-img');
            img.file.src = `./media/${'file'}-img.png`; // file src
            // img.folder.classList.add('folder-icon-img');
            // img.folder.src = './media/folder.png';
            li.classList.add('file-obj-entity')
            img.p.classList.add('img-type')
            img.img_parent.classList.add('img-parent')
            img.img_parent.appendChild(img.p)
            img.img_parent.appendChild(img.file)
            li.appendChild(img.img_parent);
            
            let imgparent = [...li.children].find(x=>x.classList.contains('img-parent'));
            let imgchild = imgparent.children[1];
            let imgtext = imgparent.children[0];

        
            // list or tile ? 
            for(let prop in objtypes){
                if(objtypes[prop]==true){
                    console.log(prop)
                    li.classList.add(`file-obj-${prop}`)
                    imgchild.classList.add(`file-icon-img-${prop}`)
                } else {
                    li.classList.remove(`file-obj-${prop}`)
                    imgchild.classList.remove(`file-icon-img-${prop}`)
                }
            }

            unselectEntity(li)
            li = handleFileByType(currfile,li) // return div and store in div
            container.appendChild(li) // append div to container
            // if getMedia file === currfile
            if(li.getMedia === currfile){
                // select files
                li.onclick = handleFileSelection
                // li.onmouseover = hoverFn
                // li.onmouseout = hoverOutFn
            }
        }
    } else {
        container.classList.add('hidden');
        console.log('Sorry, but too many files have been uploaded')
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
        // console.log('button is not pressed')
        selectedFiles = handleSingleSelection(children,listing,selectedFiles)
    }
    // multi file selection
    else {
        selectedFiles = handleMultiSelection(children,listing,selectedFiles)
    }
    // console.log(selectedFiles)

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
        let start,end;
        if(isMeta === true || isCtl === true){
            if(target.selected===true){
                selectEntity(target)
                arr.indexOf(target)===-1 ? arr.push(target) : null;
            }
            if(target.selected===false){
                // console.log('target is false')
                unselectEntity(target)
                arr.splice(arr.indexOf(target),1)
            }
                start = arr[arr.length-1]
                console.log(start)
        }
        if(isShift===true){
            if(arr.length > 0){
                // id start
                console.log(start)
                start = !start ? arr[arr.length-1] : start;
                if(target.selected===true){
                    // id end
                    end = target
                    selectEntity(end)

                    for(let i = children.indexOf(start); i <= children.indexOf(end); i++){
                        // console.log(i)
                        // console.log(children[i]);
                        // console.log(children[i].selected);
                        arr.indexOf(children[i])===-1 ? arr.push(children[i]) : null;
                        if(children[i].selected===false){
                            children[i].selected = true;
                            selectEntity(children[i])
                        }
                    }
                    for(let j = children.indexOf(start); j >= children.indexOf(end); j--){
                        // console.log(i)
                        // console.log(children[i]);
                        // console.log(children[i].selected);
                        arr.indexOf(children[j])===-1 ? arr.push(children[j]) : null;
                        if(children[j].selected===false){
                            selectEntity(children[j])
                            children[j].selected = true;
                        }
                    }
                    start = end;
                }
            } else {
                console.log("Use Single Selection before using Shift")
            }

            // case: selected item is outside of range (start - end)
            // children.forEach(child=>{
            //     if(child.selected===true){
            //         let childIdx = children.indexOf(child),
            //         st = children.indexOf(start),
            //         en = children.indexOf(end);
            //         // if child is outside range
            //         if((childIdx < st ||  childIdx > en) && arr.length > 1){
            //             // set child to false
            //             child.selected = false;
            //             // unselect
            //             unselectEntity(child)
            //             // update selected files
            //             arr.splice(arr.indexOf(child),1)
            //             // update file count
            //             updateFileCounter([select_counter,garbage],arr.length)
            //         }
            //     }
            // })
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
// check if client is using a windows device
function isWindows(agent){
    return /Window?/ig.test(agent) ? true : false;
}
// file counter
function updateFileCounter(elements,num){
    let [file,garbage] = elements;
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
        console.log('element not detected for counting files')
        return false;
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
// delete files fn
function deleteFiles(files,elements,selectedFiles){
    // delete indication
    files.map(x=>{
        unselectEntity(x);
        files.forEach((a,b)=>a.remove());
            selectedFiles = [];
            updateFileCounter(elements,selectedFiles.length)
    })
    let getFilesNow = document.querySelectorAll('.file-obj-entity');
    if(getFilesNow.length < 1){
        fileinfo.classList.add('hidden')
        console.log('no more files!')
        fileobj.buttons.img.classList.remove('hidden')
        fileobj.buttons.img.style.top = ((filecontainer.clientHeight/2) + (header.clientHeight)) + "px"
        fileobj.buttons.img.style.left =((window.innerWidth/2) - fileobj.buttons.img.clientWidth/2) + "px"
    }
    return selectedFiles;

}
// clean up existing files
function cleanUpExistingFiles(container){
    let existing_files = [...container.children]||null;
    if(existing_files) existing_files.map(file=>file.remove());
}
function hoverFn(e){
    const target = e.currentTarget;
    if(target.selected === true){
        target.classList.add('selected')
        target.classList.remove('unselected')
    }
}
function hoverOutFn(e){
    const target = e.currentTarget;
    if(target.selected === true){
        target.classList.remove('selected')
    }
}


//________________________________
// window events

// resize
let selectall = []
window.onresize = e => {
    // resize fileobj.buttons
    if(document.querySelectorAll('.file-obj-entity').length >= 1){
        console.log('files exist so button should stay')
        fileobj.buttons.img.style.top = ((filecontainer.clientHeight/2) + (header.clientHeight)) + "px"
    }
    fileobj.buttons.img.style.left =((window.innerWidth/2) - fileobj.buttons.img.clientWidth/2) + "px"

    // if screenwidth is mobile size
    dealWithSelectCounterBySize(window,select_counter)

}
let [keyisdown,keyisdown1] = [false,false]
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
        console.log('garbage - remote click')
        isShift = false;
        isMeta = false;
        isCtl = false;
    }
    }
    if(/(capslock)/i.test(e.key)){
        let state = e.getModifierState(e.key);
        console.log(state)
        if(state){
            caps.classList.remove('no-pointer');
            caps.src = './media/caps-tool-green.png'
        }
    }
    console.log(e.key)
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
            console.log(selectall)
            selectedFiles = [...allFiles];
            allFiles.forEach((f,idx)=>{
                f.classList.add('selected')
                selectEntity(f);
                updateFileCounter([select_counter,garbage],selectedFiles.length)
                f.selected = true;
            })
        }
        // console.log(keyisdown)
        // console.log(keyisdown1)
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

    // console.log(keyisdown)
    // console.log(keyisdown1)

    // if(keyisdown==false && keyisdown1==false){
    //         document.body.classList.remove('hidden')
    //     }
}
window.onload = e => {
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

