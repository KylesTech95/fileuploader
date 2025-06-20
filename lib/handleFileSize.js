const scrollbar = document.getElementById('scrollbar')
const scrolltab = document.getElementById('scrolltab')
const scrollhr = document.getElementById('scroll-hr')
let trackpos = []
let mytarget = [] // pointer/target 
let px = 'px'
let targetlocked = false;
export let filesize;

// functions
function slideTab(e){
    e.currentTarget.mousemove = true;
    let position = [(e.pageX||e.touches[0].clientX),0];
    trackpos.push(position[0]) // track x position
    trackpos = trackpos.slice(-2)
    // console.log(trackpos)
    // console.log(position)
    let [right,left] = [trackpos[1]>trackpos[0],trackpos[1]<trackpos[0]] // object descructuring
    if(targetlocked===true){
        let leftbar = scrollbar.getBoundingClientRect().x+15, rightbar = (leftbar + document.getElementById('scrollbar').clientWidth-document.getElementById('scroll-close').clientWidth-15)
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
// touchstart
window.ontouchstart = e => {
    // console.log(e.pageX,e.pageY)
    // console.log(e.target)
    mytarget = e.target.id === 'scrolltab' && scrollbar.classList.contains('open-scroll') ? scrolltab : undefined;
    targetlocked = e.target.id === 'scrolltab' && scrollbar.classList.contains('open-scroll');

    if(mytarget){
        scrolltab.classList.remove('qt-trans-5')
        window.addEventListener('touchmove',slideTab) // mouse move event
    }
}
// dragstart
window.ondragstart = e => {
    // console.log(e.pageX,e.pageY)
    // console.log(e.target)
    mytarget = e.target.id === 'scrolltab' && scrollbar.classList.contains('open-scroll') ? scrolltab : undefined;
    targetlocked = e.target.id === 'scrolltab' && scrollbar.classList.contains('open-scroll');

    if(mytarget){
        scrolltab.classList.remove('qt-trans-5')
        window.ondrag = slideTab // mouse move event
    }
}
// mouseup (end)
window.onmouseup = e => {
    targetlocked = false;
}
// touchend (end)
window.ontouchend = e => {
    targetlocked = false;
}

// hr onclick
scrollhr.onclick = e => {
    filesize = fileSizeByClick(filesize,e)
    console.log(filesize)
}

//   /\  
//  //\\
//   ||
//   ||
//   ||

// handle file size by clicking scroll line (hr)
function fileSizeByClick(filesize,e){
    let scrollbar = e.currentTarget.parentElement || scrollbar;
    console.log(scrollbar)
    let getClickPos = e.clientX;
    console.log(getClickPos);
    scrolltab.classList.add('qt-trans-5')
    scrolltab.style.left = (getClickPos-scrollbar.getBoundingClientRect().x) + px;
    filesize = (getClickPos-scrollbar.getBoundingClientRect().x) + px

    let currLis = [...document.querySelectorAll('.file-icon-img')];
    currLis.map(li=>li.style.width = filesize);

    scrolltab.classList.remove('qt-trans-5')
    return filesize
}