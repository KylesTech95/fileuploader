import { fileobj, tools } from './lib/general.js'
import { fileSystemChange, switchView, getFiles, deleteFiles } from './lib/handleFiles.js';
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

let views = [...document.querySelectorAll('.view-tool')]//.filter(y=>y.id!=='scroll-v');
views.forEach(view=>{
    view.onclick = e => {
        views.forEach(v=>{
            if(v.id!=='scroll-v'){
                v.children[0].classList.add('disabled-tool')
            }
            if(e.currentTarget.id=='scroll-v'){
                console.log('test pass on target');
            }
        })
        let viewchildren = [...e.currentTarget.children]
        for(let i = 0; i < viewchildren.length; i++){
            console.log(viewchildren[i])
            viewchildren[i].classList.remove('disabled-tool')
        }
        switchView(document.querySelectorAll('.file-obj-entity'),e.currentTarget,document.getElementById('file-hold-container'))
}
})






