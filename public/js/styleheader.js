const checkMenu = document.getElementById('check-menu');
// const header = document.getElementById('header');
const main = document.getElementById('main');

function ifCheckMenu(){
    if(checkMenu.checked){
        console.log("checked");
        main.style.display ="none";
        header.style.width = "100%";
        header.style.overflowY = "scroll";
    }else{
        header.style.overflowY = "hidden";
        main.style.display ="block";
        if(window.innerWidth >= 1000){
            header.style.width = "350px";
          }else{
            header.style.width = "100px";
          }
    }
}