// check if tmp directory exists
fetch('/tmp/check',{method:'GET'}).then(r=>r.json()).then(d=>console.log(d))
const shift = document.getElementById('shift-img-tool')
const ctrl = document.getElementById('ctrl-img-tool')
const command = document.getElementById('command-img-tool')
const stopper = document.getElementById('stop-img-tool')

export let list_item = {
    type:{
        list:true,
        tile:false
    }
}

export const fileobj = new Object({
    input:document.getElementById('file-id'),
    buttons:{
        img:document.getElementById('upload-img'),
        tool:document.getElementById('upload-img-tool'),
        footer:document.querySelector('.footer-img')
    },
    imgcontainer:document.getElementById('file-hold-container'),
})

export const  tools = [ctrl,shift,command,stopper]

// export let selectedFiles = []