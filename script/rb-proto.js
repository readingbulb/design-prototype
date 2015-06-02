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
 ;

(function( $ ) {
    
    // $( function() {
    //     window.mySwipe = $('#swipeWrapper').Swipe().data('Swipe');
    // });
    
    $(function() {

        Nav.init();

        // $('.side-nav-toggler').sideNav();
    });

})(jQuery);
},{"./proto/Nav":2}],2:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0L3JiLXByb3RvLmpzIiwic3JjL3NjcmlwdC9wcm90by9OYXYvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKipcbiAqICAgICAgICAgICBfXyAgICBfXyAgICAgICBfX18gICAgICAgX18gICBfXyAgICAgICAgICAgICAgIFxuICogICAgICAgICAgfCAgfCAgfCAgfCAgICAgLyAgIFxcICAgICB8ICB8IHwgIHwgICAgICAgICAgICAgIFxuICogICAgICAgICAgfCAgfF9ffCAgfCAgICAvICBeICBcXCAgICB8ICB8IHwgIHwgICAgICAgICAgICAgIFxuICogICAgICAgICAgfCAgIF9fICAgfCAgIC8gIC9fXFwgIFxcICAgfCAgfCB8ICB8ICAgICAgICAgICAgICBcbiAqICAgICAgICAgIHwgIHwgIHwgIHwgIC8gIF9fX19fICBcXCAgfCAgfCB8ICBgLS0tLS4gICAgICAgICBcbiAqICAgICAgICAgIHxfX3wgIHxfX3wgL19fLyAgICAgXFxfX1xcIHxfX3wgfF9fX19fX198ICAgICAgICAgXG4gKiAgICAgICAgIF9fX19fX18uIF9fICAuX19fX19fICAgICAuX18gICBfXy4gICAgICBfX18gICAgICBcbiAqICAgICAgICAvICAgICAgIHx8ICB8IHwgICBfICBcXCAgICB8ICBcXCB8ICB8ICAgICAvICAgXFwgICAgIFxuICogICAgICAgfCAgICgtLS0tYHwgIHwgfCAgfF8pICB8ICAgfCAgIFxcfCAgfCAgICAvICBeICBcXCAgICBcbiAqICAgICAgICBcXCAgIFxcICAgIHwgIHwgfCAgICAgIC8gICAgfCAgLiBgICB8ICAgLyAgL19cXCAgXFwgICBcbiAqICAgIC4tLS0tKSAgIHwgICB8ICB8IHwgIHxcXCAgXFwtLS0tfCAgfFxcICAgfCAgLyAgX19fX18gIFxcICBcbiAqICAgIHxfX19fX19fLyAgICB8X198IHwgX3wgYC5fX19fX3xfX3wgXFxfX3wgL19fLyAgICAgXFxfX1xcIFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gKi9cblxuIHZhciBOYXYgPSByZXF1aXJlKCcuL3Byb3RvL05hdicpXG4gO1xuXG4oZnVuY3Rpb24oICQgKSB7XG4gICAgXG4gICAgLy8gJCggZnVuY3Rpb24oKSB7XG4gICAgLy8gICAgIHdpbmRvdy5teVN3aXBlID0gJCgnI3N3aXBlV3JhcHBlcicpLlN3aXBlKCkuZGF0YSgnU3dpcGUnKTtcbiAgICAvLyB9KTtcbiAgICBcbiAgICAkKGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIE5hdi5pbml0KCk7XG5cbiAgICAgICAgLy8gJCgnLnNpZGUtbmF2LXRvZ2dsZXInKS5zaWRlTmF2KCk7XG4gICAgfSk7XG5cbn0pKGpRdWVyeSk7IiwidmFyIE5hdiA9IHtcbiAgICBpbml0OiBpbml0XG59O1xuXG5mdW5jdGlvbiBpbml0KCkge1xuXG4gICAgZnVuY3Rpb24gdG9nZ2xlRmlsdGVyTmF2KCkge1xuICAgICAgICB2YXIgJGVsID0gJCgnLmZpbHRlci1uYXYtaW5uZXInKTtcblxuICAgICAgICBpZiAoICRlbC5oYXNDbGFzcygnYWN0aXZlJykgKSB7XG4gICAgICAgICAgICAkZWwucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgJCgnLmZpbHRlci1uYXYtdG9nZ2xlcicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICRlbC5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAkKCcuZmlsdGVyLW5hdi10b2dnbGVyJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJCgnLmZpbHRlci1uYXYtdG9nZ2xlciwgLmZpbHRlci1saW5rJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgdG9nZ2xlRmlsdGVyTmF2KCk7XG4gICAgfSk7XG5cbiAgICAkKCcubmF2YmFyLWZpeGVkIC5tYWluLW5hdi1vdXRlcicpXG4gICAgICAgIC5oZWFkcm9vbSh7XG4gICAgICAgICAgICBcIm9mZnNldFwiOiA4MCxcbiAgICAgICAgICAgIFwidG9sZXJhbmNlXCI6IDUsXG4gICAgICAgICAgICBcImNsYXNzZXNcIjoge1xuICAgICAgICAgICAgICAgIFwiaW5pdGlhbFwiOiBcIm5hdmJhci1hbmltYXRlZFwiLFxuICAgICAgICAgICAgICAgIFwicGlubmVkXCI6IFwibmF2YmFyLXNsaWRlLWRvd25cIixcbiAgICAgICAgICAgICAgICBcInVucGlubmVkXCI6IFwibmF2YmFyLXNsaWRlLXVwXCIsXG4gICAgICAgICAgICAgICAgXCJ0b3BcIjogXCJuYXZiYXItb24tdG9wXCIsXG4gICAgICAgICAgICAgICAgXCJub3RUb3BcIjogXCJuYXZiYXItbm90LXRvcFwiXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBcIm9uVW5waW5cIjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJCgnLmZpbHRlci1uYXYtaW5uZXInKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgJCgnLmZpbHRlci1uYXYtdG9nZ2xlcicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTmF2OyJdfQ==
