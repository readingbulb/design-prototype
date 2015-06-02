(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/***
 *           __    __       ___       __   __               
 *          |  |  |  |     /   \     |  | |  |              
 *          |  |__|  |    /  ^  \    |  | |  |              
 *          |   __   |   /  /_\  \   |  | |  |              
 *          |  |  |  |  /  _____  \  |  | |  `----.         
 *          |__|  |__| /__/     \__\ |__| |_______|         
 *         _______. __  .______     .__   __.      ___      
 *        /       ||  | |   _  \    |  \ |  |     /   \     
 *       |   (----`|  | |  |_)  |   |   \|  |    /  ^  \    
 *        \   \    |  | |      /    |  . `  |   /  /_\  \   
 *    .----)   |   |  | |  |\  \----|  |\   |  /  _____  \  
 *    |_______/    |__| | _| `._____|__| \__| /__/     \__\ 
 *                                                          
 */

 var Nav = require('./proto/Nav')
 ,   Content = require('./proto/Content')
 ;

(function( $ ) {
    
    // $( function() {
    //     window.mySwipe = $('#swipeWrapper').Swipe().data('Swipe');
    // });
    
    $(function() {

        Nav.init();
        Content.initCoverImage();

        // $('.side-nav-toggler').sideNav();
    });

})(jQuery);
},{"./proto/Content":2,"./proto/Nav":3}],2:[function(require,module,exports){
var Content = {
    initCoverImage: initCoverImage
};

function initCoverImage() {
    if ( !$('.content-cover-image').length ) return;

    var $target = $('.content-cover-image');

    $target.each( function( i ) {

        var _src = $( this ).data('src');

        $( this ).background({
            source: _src
        });
    });
}

module.exports = Content;
},{}],3:[function(require,module,exports){
var Nav = {
    init: init
};

function init() {

    function toggleFilterNav() {
        var $el = $('.filter-nav-inner');

        if ( $el.hasClass('active') ) {
            $el.removeClass('active');
            $('.filter-nav-toggler').removeClass('active');
        }
        else {
            $el.addClass('active');
            $('.filter-nav-toggler').addClass('active');
        }
    }

    $('.filter-nav-toggler, .filter-link').on('click', function(e) {
        e.preventDefault();

        toggleFilterNav();
    });

    $('.navbar-fixed .main-nav-outer')
        .headroom({
            "offset": 80,
            "tolerance": 5,
            "classes": {
                "initial": "navbar-animated",
                "pinned": "navbar-slide-down",
                "unpinned": "navbar-slide-up",
                "top": "navbar-on-top",
                "notTop": "navbar-not-top"
            },

            "onUnpin": function() {
                $('.filter-nav-inner').removeClass('active');
                $('.filter-nav-toggler').removeClass('active');
            }
        })
    ;
}

module.exports = Nav;
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0L3JiLXByb3RvLmpzIiwic3JjL3NjcmlwdC9wcm90by9Db250ZW50L2luZGV4LmpzIiwic3JjL3NjcmlwdC9wcm90by9OYXYvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKioqXG4gKiAgICAgICAgICAgX18gICAgX18gICAgICAgX19fICAgICAgIF9fICAgX18gICAgICAgICAgICAgICBcbiAqICAgICAgICAgIHwgIHwgIHwgIHwgICAgIC8gICBcXCAgICAgfCAgfCB8ICB8ICAgICAgICAgICAgICBcbiAqICAgICAgICAgIHwgIHxfX3wgIHwgICAgLyAgXiAgXFwgICAgfCAgfCB8ICB8ICAgICAgICAgICAgICBcbiAqICAgICAgICAgIHwgICBfXyAgIHwgICAvICAvX1xcICBcXCAgIHwgIHwgfCAgfCAgICAgICAgICAgICAgXG4gKiAgICAgICAgICB8ICB8ICB8ICB8ICAvICBfX19fXyAgXFwgIHwgIHwgfCAgYC0tLS0uICAgICAgICAgXG4gKiAgICAgICAgICB8X198ICB8X198IC9fXy8gICAgIFxcX19cXCB8X198IHxfX19fX19ffCAgICAgICAgIFxuICogICAgICAgICBfX19fX19fLiBfXyAgLl9fX19fXyAgICAgLl9fICAgX18uICAgICAgX19fICAgICAgXG4gKiAgICAgICAgLyAgICAgICB8fCAgfCB8ICAgXyAgXFwgICAgfCAgXFwgfCAgfCAgICAgLyAgIFxcICAgICBcbiAqICAgICAgIHwgICAoLS0tLWB8ICB8IHwgIHxfKSAgfCAgIHwgICBcXHwgIHwgICAgLyAgXiAgXFwgICAgXG4gKiAgICAgICAgXFwgICBcXCAgICB8ICB8IHwgICAgICAvICAgIHwgIC4gYCAgfCAgIC8gIC9fXFwgIFxcICAgXG4gKiAgICAuLS0tLSkgICB8ICAgfCAgfCB8ICB8XFwgIFxcLS0tLXwgIHxcXCAgIHwgIC8gIF9fX19fICBcXCAgXG4gKiAgICB8X19fX19fXy8gICAgfF9ffCB8IF98IGAuX19fX198X198IFxcX198IC9fXy8gICAgIFxcX19cXCBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICovXG5cbiB2YXIgTmF2ID0gcmVxdWlyZSgnLi9wcm90by9OYXYnKVxuICwgICBDb250ZW50ID0gcmVxdWlyZSgnLi9wcm90by9Db250ZW50JylcbiA7XG5cbihmdW5jdGlvbiggJCApIHtcbiAgICBcbiAgICAvLyAkKCBmdW5jdGlvbigpIHtcbiAgICAvLyAgICAgd2luZG93Lm15U3dpcGUgPSAkKCcjc3dpcGVXcmFwcGVyJykuU3dpcGUoKS5kYXRhKCdTd2lwZScpO1xuICAgIC8vIH0pO1xuICAgIFxuICAgICQoZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgTmF2LmluaXQoKTtcbiAgICAgICAgQ29udGVudC5pbml0Q292ZXJJbWFnZSgpO1xuXG4gICAgICAgIC8vICQoJy5zaWRlLW5hdi10b2dnbGVyJykuc2lkZU5hdigpO1xuICAgIH0pO1xuXG59KShqUXVlcnkpOyIsInZhciBDb250ZW50ID0ge1xuICAgIGluaXRDb3ZlckltYWdlOiBpbml0Q292ZXJJbWFnZVxufTtcblxuZnVuY3Rpb24gaW5pdENvdmVySW1hZ2UoKSB7XG4gICAgaWYgKCAhJCgnLmNvbnRlbnQtY292ZXItaW1hZ2UnKS5sZW5ndGggKSByZXR1cm47XG5cbiAgICB2YXIgJHRhcmdldCA9ICQoJy5jb250ZW50LWNvdmVyLWltYWdlJyk7XG5cbiAgICAkdGFyZ2V0LmVhY2goIGZ1bmN0aW9uKCBpICkge1xuXG4gICAgICAgIHZhciBfc3JjID0gJCggdGhpcyApLmRhdGEoJ3NyYycpO1xuXG4gICAgICAgICQoIHRoaXMgKS5iYWNrZ3JvdW5kKHtcbiAgICAgICAgICAgIHNvdXJjZTogX3NyY1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb250ZW50OyIsInZhciBOYXYgPSB7XG4gICAgaW5pdDogaW5pdFxufTtcblxuZnVuY3Rpb24gaW5pdCgpIHtcblxuICAgIGZ1bmN0aW9uIHRvZ2dsZUZpbHRlck5hdigpIHtcbiAgICAgICAgdmFyICRlbCA9ICQoJy5maWx0ZXItbmF2LWlubmVyJyk7XG5cbiAgICAgICAgaWYgKCAkZWwuaGFzQ2xhc3MoJ2FjdGl2ZScpICkge1xuICAgICAgICAgICAgJGVsLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICQoJy5maWx0ZXItbmF2LXRvZ2dsZXInKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAkZWwuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgJCgnLmZpbHRlci1uYXYtdG9nZ2xlcicpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICQoJy5maWx0ZXItbmF2LXRvZ2dsZXIsIC5maWx0ZXItbGluaycpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIHRvZ2dsZUZpbHRlck5hdigpO1xuICAgIH0pO1xuXG4gICAgJCgnLm5hdmJhci1maXhlZCAubWFpbi1uYXYtb3V0ZXInKVxuICAgICAgICAuaGVhZHJvb20oe1xuICAgICAgICAgICAgXCJvZmZzZXRcIjogODAsXG4gICAgICAgICAgICBcInRvbGVyYW5jZVwiOiA1LFxuICAgICAgICAgICAgXCJjbGFzc2VzXCI6IHtcbiAgICAgICAgICAgICAgICBcImluaXRpYWxcIjogXCJuYXZiYXItYW5pbWF0ZWRcIixcbiAgICAgICAgICAgICAgICBcInBpbm5lZFwiOiBcIm5hdmJhci1zbGlkZS1kb3duXCIsXG4gICAgICAgICAgICAgICAgXCJ1bnBpbm5lZFwiOiBcIm5hdmJhci1zbGlkZS11cFwiLFxuICAgICAgICAgICAgICAgIFwidG9wXCI6IFwibmF2YmFyLW9uLXRvcFwiLFxuICAgICAgICAgICAgICAgIFwibm90VG9wXCI6IFwibmF2YmFyLW5vdC10b3BcIlxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgXCJvblVucGluXCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICQoJy5maWx0ZXItbmF2LWlubmVyJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgICQoJy5maWx0ZXItbmF2LXRvZ2dsZXInKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE5hdjsiXX0=
