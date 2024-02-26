const header = document.getElementById("header");
const nav = document.getElementById("nav");
let lastScrollTop = window.scrollY;
let scroll;
window.onscroll = () => {
/*    let scrollTop = window.scrollY;
    let vH = window.innerHeight;
    let cH = nav.getBoundingClientRect().height;
    let headerTop = header.getBoundingClientRect().top + window.scrollY;

    if(scrollTop >= cH - vH + headerTop){
        nav.style.transform = `translateY(-${cH - vH + headerTop}px)`;
        nav.style.position = "fixed";
    }else{
        nav.style.transform = "";
        nav.style.position = "";
    } */
    const scrollTopPosition = window.scrollY;
    const headerScrollPosition = header.scrollTop;

    header.scrollTop = window.scrollY;

    //console.log('header' + header.scrollTop);
    //console.log('window' + window.scrollY);
    //console.log('difference' + (window.scrollY - lastScrollTop));  

    lastScrollTop =
    scrollTopPosition <= 0 ? 0 : scrollTopPosition;  
}
