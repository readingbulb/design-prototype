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

(function( $ ) {
    
    // $( function() {
    //     window.mySwipe = $('#swipeWrapper').Swipe().data('Swipe');
    // });
    
    $(function() {

        $('.side-nav-toggler').sideNav();

        // $('header.navbar-fixed')
        //     .headroom({
        //         "offset": 80,
        //         "tolerance": 5,
        //         "classes": {
        //             "initial": "navbar-animated",
        //             "pinned": "navbar-slide-down",
        //             "unpinned": "navbar-slide-up",
        //             "top": "navbar-on-top",
        //             "notTop": "navbar-not-top"
        //         }
        //     });
    });

})(jQuery);
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0L3JiLXByb3RvLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKioqXG4gKiAgICAgICAgICAgX18gICAgX18gICAgICAgX19fICAgICAgIF9fICAgX18gICAgICAgICAgICAgICBcbiAqICAgICAgICAgIHwgIHwgIHwgIHwgICAgIC8gICBcXCAgICAgfCAgfCB8ICB8ICAgICAgICAgICAgICBcbiAqICAgICAgICAgIHwgIHxfX3wgIHwgICAgLyAgXiAgXFwgICAgfCAgfCB8ICB8ICAgICAgICAgICAgICBcbiAqICAgICAgICAgIHwgICBfXyAgIHwgICAvICAvX1xcICBcXCAgIHwgIHwgfCAgfCAgICAgICAgICAgICAgXG4gKiAgICAgICAgICB8ICB8ICB8ICB8ICAvICBfX19fXyAgXFwgIHwgIHwgfCAgYC0tLS0uICAgICAgICAgXG4gKiAgICAgICAgICB8X198ICB8X198IC9fXy8gICAgIFxcX19cXCB8X198IHxfX19fX19ffCAgICAgICAgIFxuICogICAgICAgICBfX19fX19fLiBfXyAgLl9fX19fXyAgICAgLl9fICAgX18uICAgICAgX19fICAgICAgXG4gKiAgICAgICAgLyAgICAgICB8fCAgfCB8ICAgXyAgXFwgICAgfCAgXFwgfCAgfCAgICAgLyAgIFxcICAgICBcbiAqICAgICAgIHwgICAoLS0tLWB8ICB8IHwgIHxfKSAgfCAgIHwgICBcXHwgIHwgICAgLyAgXiAgXFwgICAgXG4gKiAgICAgICAgXFwgICBcXCAgICB8ICB8IHwgICAgICAvICAgIHwgIC4gYCAgfCAgIC8gIC9fXFwgIFxcICAgXG4gKiAgICAuLS0tLSkgICB8ICAgfCAgfCB8ICB8XFwgIFxcLS0tLXwgIHxcXCAgIHwgIC8gIF9fX19fICBcXCAgXG4gKiAgICB8X19fX19fXy8gICAgfF9ffCB8IF98IGAuX19fX198X198IFxcX198IC9fXy8gICAgIFxcX19cXCBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICovXG5cbihmdW5jdGlvbiggJCApIHtcbiAgICBcbiAgICAvLyAkKCBmdW5jdGlvbigpIHtcbiAgICAvLyAgICAgd2luZG93Lm15U3dpcGUgPSAkKCcjc3dpcGVXcmFwcGVyJykuU3dpcGUoKS5kYXRhKCdTd2lwZScpO1xuICAgIC8vIH0pO1xuICAgIFxuICAgICQoZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgJCgnLnNpZGUtbmF2LXRvZ2dsZXInKS5zaWRlTmF2KCk7XG5cbiAgICAgICAgLy8gJCgnaGVhZGVyLm5hdmJhci1maXhlZCcpXG4gICAgICAgIC8vICAgICAuaGVhZHJvb20oe1xuICAgICAgICAvLyAgICAgICAgIFwib2Zmc2V0XCI6IDgwLFxuICAgICAgICAvLyAgICAgICAgIFwidG9sZXJhbmNlXCI6IDUsXG4gICAgICAgIC8vICAgICAgICAgXCJjbGFzc2VzXCI6IHtcbiAgICAgICAgLy8gICAgICAgICAgICAgXCJpbml0aWFsXCI6IFwibmF2YmFyLWFuaW1hdGVkXCIsXG4gICAgICAgIC8vICAgICAgICAgICAgIFwicGlubmVkXCI6IFwibmF2YmFyLXNsaWRlLWRvd25cIixcbiAgICAgICAgLy8gICAgICAgICAgICAgXCJ1bnBpbm5lZFwiOiBcIm5hdmJhci1zbGlkZS11cFwiLFxuICAgICAgICAvLyAgICAgICAgICAgICBcInRvcFwiOiBcIm5hdmJhci1vbi10b3BcIixcbiAgICAgICAgLy8gICAgICAgICAgICAgXCJub3RUb3BcIjogXCJuYXZiYXItbm90LXRvcFwiXG4gICAgICAgIC8vICAgICAgICAgfVxuICAgICAgICAvLyAgICAgfSk7XG4gICAgfSk7XG5cbn0pKGpRdWVyeSk7Il19
