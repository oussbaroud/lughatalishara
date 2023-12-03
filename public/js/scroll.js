const header = document.getElementById("header");
const nav = document.getElementById("nav");

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
    header.scrollTop = window.scrollY;
}
console.log(header.scrollTop);
console.log(window.scrollY);