// variables
const filecontainer = document.getElementById('file-container')
const fileobj = new Object({
    element:document.getElementById('file-id'),
    img:document.getElementById('upload-img'),
    imgcontainer:document.getElementById('img-container'),
})
// set file upload icon to middle of screen
let midheight = window.innerHeight/2
filecontainer.style.top = midheight + 'px'


// click on icon to upload a file
fileobj.img.onclick = () => getFiles(fileobj.element)
fileobj.element.onchange = e => {
    let files = e.currentTarget.files || undefined;
    let container = fileobj.imgcontainer
    
    // cleanup leftover files
    let existing_files = [...container.children]||null;
    if(existing_files) existing_files.map(file=>file.remove());
    if(files.length > 0){ 
        container.classList.remove('hidden')
        for(let i = 0; i < files.length; i++){
            let img = new Image(350,300)
            img.src = '/media/' + files[i].name
            container.appendChild(img)
        }
    } else {
        container.classList.add('hidden')
    } 
}







// functions

// getFiles 
function getFiles(system){
return !system ? console.error('file system is undefined.\nCheck and try again') : system.click();
}

