var ua = navigator.userAgent.toLowerCase();
if (ua.match(/MicroMessenger/i) != "micromessenger") {
    $('.dlete').css('display', 'block');
    $('.dlete').on('click', function () {
             window.history.back();
          
    });
}