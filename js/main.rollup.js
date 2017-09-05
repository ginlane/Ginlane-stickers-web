$(window).on('beforeunload', function() {
    $(window).scrollTop(0);
});
var isTouchDevice = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|playbook|silk|BlackBerry|BB10|Windows Phone|Tizen|Bada|webOS|IEMobile|Opera Mini)/);
var isTouch       = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0) || (navigator.maxTouchPoints));
var touchStartY   = 0;
var touchStartX   = 0;
var touchEndY     = 0;
var touchEndX     = 0;
var prevTime      = new Date().getTime();
var scrollings    = [];
var moving        = true;
var sections      = $('#main-container .section');
var bubble        = $('.typing-bubble');
var sectionCounts = sections.length;
var count         = 1;


function setNextAnimation() {
  if( count < sectionCounts ){
    var thisSection = $(sections[count]);
    thisSection.addClass('show');
    $(bubble[count]).addClass('hidden');
    var cur = $(window).scrollTop();
    $('.scroll-to-learn').addClass('hidden');
    $('body').animate({scrollTop: thisSection.offset().top - 30});
    setTimeout(() => {
      retunrBubble();
      if( count === sectionCounts - 1 ) {
        $(window).off('mousewheel', MouseWheelHandler);
      }
      count++;
    }, 1000);
  }
}

function retunrBubble() {
  if ( count != sectionCounts - 1) {
     setTimeout(() => {
      $(bubble[count]).removeClass('hidden');
      moving = true;
    }, 2000)
  }
}

function scrolling(type){
  if(type == 'down'){
    if ( moving ) {
      moveSectionDown();
    }
  }
}

function moveSectionDown(){
    moving = false;
    setNextAnimation();
}

function getAverage(elements, number){
  var sum = 0;

  //taking `number` elements from the end to make the average, if there are not enought, 1
  var lastElements = elements.slice(Math.max(elements.length - number, 1));

  for(var i = 0; i < lastElements.length; i++){
      sum = sum + lastElements[i];
  }
  return Math.ceil(sum/number);
}

function MouseWheelHandler(e) {
  var curTime = new Date().getTime();

  e = window.event || e || e.originalEvent;

  var value = e.wheelDelta || -e.deltaY || -e.detail;
  var delta = Math.max(-1, Math.min(1, value));

  //Limiting the array to 150 (lets not waist memory!)
  if(scrollings.length > 149){
      scrollings.shift();
  }

  //keeping record of the previous scrollings
  scrollings.push(Math.abs(value));


  var timeDiff = curTime-prevTime;
  prevTime = curTime;

  //haven't they scrolled in a while?
  //(enough to be consider a different scrolling action to scroll another section)
  if(timeDiff > 200){
      //emptying the array, we dont care about old scrollings for our averages
      scrollings = [];
  }


  var averageEnd = getAverage(scrollings, 10);
  var averageMiddle = getAverage(scrollings, 70);
  var isAccelerating = averageEnd >= averageMiddle;

  if(isAccelerating){
      //scrolling down?
      if ( window.outerWidth >= 1024 ) {
        if (delta < 0) {
          scrolling('down');
        //scrolling up?
        }
        else {
          scrolling('down')
        }
      }
  }

  return false;
}
if ( window.outerWidth >= 1024 ) {
  $(window).on('mousewheel', MouseWheelHandler);
}
