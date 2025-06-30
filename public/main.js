import { fileobj, tools } from './lib/general.js'
import { fileSystemChange, switchView, getFiles, deleteFiles } from './lib/handleFiles.js';
// variables
const filecontainer = document.getElementById('file-container')
const header = document.getElementById('header-mast')
const garbage = document.getElementById('garbage-img-tool');
const fileinfo = document.getElementById('file-info');
const select_counter = document.querySelector('.select-counter')
let views = [...document.querySelectorAll('.view-tool')]
let garbage_clone = garbage.cloneNode(true)
    garbage_clone.classList.add('garbage-clone')
    garbage_clone.setAttribute('id','garbage-img-clone')

let midheight = window.innerHeight/2
let isShift = false;
let isCtl = false;
let isMeta = false;
let selectedFiles = []

//________________________________

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
            console.log(tools)

            // if garbage is enabled
            if(!e.currentTarget.classList.contains('no-pointer')){
                let currSelectedFiles = [...document.querySelectorAll('.file-obj-entity')].filter(x=>x.selected===true);
                    console.log(garbage_clone)
                    selectedFiles = deleteFiles(currSelectedFiles,[select_counter,e.currentTarget,garbage_clone],selectedFiles)
            } else {
                console.log('garbage is disabled!')
            }
}

// handle each view
views.forEach(view=>{
    view.onclick = e => {
        views.forEach(v=>{
            if(!/scroll(bar|tab|-v)/gi.test(e.currentTarget.id) && !/scroll(bar|tab|-v)/gi.test(v.id)){
                v.children[0].classList.add('disabled-tool')
            }
        })
        let viewchildren = [...e.currentTarget.children]
        for(let i = 0; i < viewchildren.length; i++){
            // console.log(viewchildren[i])
            viewchildren[i].classList.remove('disabled-tool')
        }
        switchView(document.querySelectorAll('.file-obj-entity'),e.currentTarget,document.getElementById('file-hold-container'))
}
})




