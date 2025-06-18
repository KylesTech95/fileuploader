
// handle notification
export function pushNotification(element,text,type,counter){
    // handle notification by type
    let newclass = `${type}-text`;
    let h4 = [...element.children].find(x=>/h4/ig.test(x.tagName));
    let oldclass = [...h4.classList].find(y => /-text/gi.test(y));
    if(oldclass)h4.classList.remove(oldclass);
    h4.textContent = text;
    h4.classList.add(newclass)

    // timers for show and remove
    let appear_time = 0, disappear_time = 7

    // set timeout to show notificaiton
    setTimeout(()=>{
        element.classList.remove('hide-notification')
    },appear_time*1000)

    // set interval to track count
    let timer = setInterval(()=>{
        counter++
        // console.log(counter)
        if(counter==appear_time) console.log('notificaiton appears!')
        if(counter==disappear_time) clearTimeout(timer)
    },1000)

    // set timeout to remove notification
    setTimeout(()=>{
        element.classList.add('hide-notification')
    },(disappear_time)*1000)
}


