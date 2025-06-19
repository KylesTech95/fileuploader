const scrollbar = document.getElementById('scrollbar')
const scrolltab = document.getElementById('scrolltab')
let trackpos = []
let mytarget = [] // pointer/target 
let px = 'px'
export let targetlocked = false;
export let filesize;

// functions
function slideTab(e){
    e.currentTarget.mousemove = true;
    let position = [e.pageX,0];
    trackpos.push(position[0]) // track x position
    trackpos = trackpos.slice(-2)
    // console.log(trackpos)
    // console.log(position)
    let [right,left] = [trackpos[1]>trackpos[0],trackpos[1]<trackpos[0]] // object descructuring
    if(targetlocked===true){
        let leftbar = scrollbar.getBoundingClientRect().x, rightbar = (leftbar + document.getElementById('scrollbar').clientWidth)
        // console.log(leftbar,rightbar)
        // console.log(targetlocked)
        // console.log(position[0])

        if(position[0] >= leftbar && position[0] <= rightbar){
            if(right){
            position[0]+=1
            }

            if(left){
            position[0]-=1
            }   
            // store position in filesize
            filesize = (position[0]-98);
            console.log(filesize)
            // update scrolltab position
            scrolltab.style.left = filesize + px
            let currentfiles = document.querySelectorAll('.file-icon-img') // get currentfiles
           return currentfiles.length > 0 ? [...currentfiles].map(f=>f.style.width = filesize + px) : null;

            // console.log(position[0])
        }

    }
}

// mosuedown
window.onmousedown = e => {
    // console.log(e.pageX,e.pageY)
    // console.log(e.target)
    mytarget = e.target.id === 'scrolltab' && scrollbar.classList.contains('open-scroll') ? scrolltab : undefined;
    targetlocked = e.target.id === 'scrolltab' && scrollbar.classList.contains('open-scroll');

    if(mytarget){
        scrolltab.classList.remove('qt-trans-5')
        window.onmousemove = slideTab // mouse move event
    }
}
// mouseup
window.onmouseup = e => {
targetlocked = false;
}