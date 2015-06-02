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

        // $('.side-nav-toggler').sideNav();

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
                }
            })
        ;
    });

})(jQuery);
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0L3JiLXByb3RvLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKipcbiAqICAgICAgICAgICBfXyAgICBfXyAgICAgICBfX18gICAgICAgX18gICBfXyAgICAgICAgICAgICAgIFxuICogICAgICAgICAgfCAgfCAgfCAgfCAgICAgLyAgIFxcICAgICB8ICB8IHwgIHwgICAgICAgICAgICAgIFxuICogICAgICAgICAgfCAgfF9ffCAgfCAgICAvICBeICBcXCAgICB8ICB8IHwgIHwgICAgICAgICAgICAgIFxuICogICAgICAgICAgfCAgIF9fICAgfCAgIC8gIC9fXFwgIFxcICAgfCAgfCB8ICB8ICAgICAgICAgICAgICBcbiAqICAgICAgICAgIHwgIHwgIHwgIHwgIC8gIF9fX19fICBcXCAgfCAgfCB8ICBgLS0tLS4gICAgICAgICBcbiAqICAgICAgICAgIHxfX3wgIHxfX3wgL19fLyAgICAgXFxfX1xcIHxfX3wgfF9fX19fX198ICAgICAgICAgXG4gKiAgICAgICAgIF9fX19fX18uIF9fICAuX19fX19fICAgICAuX18gICBfXy4gICAgICBfX18gICAgICBcbiAqICAgICAgICAvICAgICAgIHx8ICB8IHwgICBfICBcXCAgICB8ICBcXCB8ICB8ICAgICAvICAgXFwgICAgIFxuICogICAgICAgfCAgICgtLS0tYHwgIHwgfCAgfF8pICB8ICAgfCAgIFxcfCAgfCAgICAvICBeICBcXCAgICBcbiAqICAgICAgICBcXCAgIFxcICAgIHwgIHwgfCAgICAgIC8gICAgfCAgLiBgICB8ICAgLyAgL19cXCAgXFwgICBcbiAqICAgIC4tLS0tKSAgIHwgICB8ICB8IHwgIHxcXCAgXFwtLS0tfCAgfFxcICAgfCAgLyAgX19fX18gIFxcICBcbiAqICAgIHxfX19fX19fLyAgICB8X198IHwgX3wgYC5fX19fX3xfX3wgXFxfX3wgL19fLyAgICAgXFxfX1xcIFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gKi9cblxuKGZ1bmN0aW9uKCAkICkge1xuICAgIFxuICAgIC8vICQoIGZ1bmN0aW9uKCkge1xuICAgIC8vICAgICB3aW5kb3cubXlTd2lwZSA9ICQoJyNzd2lwZVdyYXBwZXInKS5Td2lwZSgpLmRhdGEoJ1N3aXBlJyk7XG4gICAgLy8gfSk7XG4gICAgXG4gICAgJChmdW5jdGlvbigpIHtcblxuICAgICAgICAvLyAkKCcuc2lkZS1uYXYtdG9nZ2xlcicpLnNpZGVOYXYoKTtcblxuICAgICAgICAkKCcubmF2YmFyLWZpeGVkIC5tYWluLW5hdi1vdXRlcicpXG4gICAgICAgICAgICAuaGVhZHJvb20oe1xuICAgICAgICAgICAgICAgIFwib2Zmc2V0XCI6IDgwLFxuICAgICAgICAgICAgICAgIFwidG9sZXJhbmNlXCI6IDUsXG4gICAgICAgICAgICAgICAgXCJjbGFzc2VzXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJpbml0aWFsXCI6IFwibmF2YmFyLWFuaW1hdGVkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwicGlubmVkXCI6IFwibmF2YmFyLXNsaWRlLWRvd25cIixcbiAgICAgICAgICAgICAgICAgICAgXCJ1bnBpbm5lZFwiOiBcIm5hdmJhci1zbGlkZS11cFwiLFxuICAgICAgICAgICAgICAgICAgICBcInRvcFwiOiBcIm5hdmJhci1vbi10b3BcIixcbiAgICAgICAgICAgICAgICAgICAgXCJub3RUb3BcIjogXCJuYXZiYXItbm90LXRvcFwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgO1xuICAgIH0pO1xuXG59KShqUXVlcnkpOyJdfQ==
