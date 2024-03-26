const reqLink = window.location.href.toString().split(window.location.host)[1]

if(window.innerWidth <= 600 && reqLink !== '/manage/rotatescreen') {
    window.location.href = '/manage/rotatescreen';
}