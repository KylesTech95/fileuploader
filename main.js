import { fileobj, tools } from './lib/general.js'
import { fileSystemChange, updateFileCounter, switchView, unselectEntity, selectEntity } from './lib/handleFiles.js';
// variables
const filecontainer = document.getElementById('file-container')
const header = document.getElementById('header-mast')
const garbage = document.getElementById('garbage-img-tool');
const fileinfo = document.getElementById('file-info');
const select_counter = document.querySelector('.select-counter')
let selectedFiles = []

//________________________________
// set file upload icon to middle of screen
let midheight = window.innerHeight/2
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


// getFiles
function getFiles(system){
return !system ? console.error('file system is undefined.\nCheck and try again') : system.click();
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






