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
    
    $( function() {

        // convert rgb to hex value string
        function rgb2hex(rgb) {
            if (/^#[0-9A-F]{6}$/i.test(rgb)) { return rgb; }

            rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

            if (rgb === null) { return "N/A"; }

            function hex(x) {
                return ("0" + parseInt(x).toString(16)).slice(-2);
            }

            return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
        }

        $('.dynamic-color .col').each(function () {
            $(this).children().each(function () {
                
                var color = $(this).css('background-color'),
                classes = $(this).attr('class');
                
                $(this).html(rgb2hex(color) + " " + classes);

                if (classes.indexOf("darken") >= 0 || $(this).hasClass('black')) {
                    $(this).css('color', 'rgba(255,255,255,.9');
                }
            });
        });

        // Plugin initialization
        $('.slider').slider({full_width: true});
        $('.parallax').parallax();
        $('.modal-trigger').leanModal();
        $('.scrollspy').scrollSpy();
        $('.button-collapse').sideNav({'edge': 'left'});
        $('.datepicker').pickadate({selectYears: 20});
        $('select').not('.disabled').material_select();
    });
})(jQuery);
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0L3JiLXN0eWxlZ3VpZGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKipcbiAqICAgICAgICAgICBfXyAgICBfXyAgICAgICBfX18gICAgICAgX18gICBfXyAgICAgICAgICAgICAgIFxuICogICAgICAgICAgfCAgfCAgfCAgfCAgICAgLyAgIFxcICAgICB8ICB8IHwgIHwgICAgICAgICAgICAgIFxuICogICAgICAgICAgfCAgfF9ffCAgfCAgICAvICBeICBcXCAgICB8ICB8IHwgIHwgICAgICAgICAgICAgIFxuICogICAgICAgICAgfCAgIF9fICAgfCAgIC8gIC9fXFwgIFxcICAgfCAgfCB8ICB8ICAgICAgICAgICAgICBcbiAqICAgICAgICAgIHwgIHwgIHwgIHwgIC8gIF9fX19fICBcXCAgfCAgfCB8ICBgLS0tLS4gICAgICAgICBcbiAqICAgICAgICAgIHxfX3wgIHxfX3wgL19fLyAgICAgXFxfX1xcIHxfX3wgfF9fX19fX198ICAgICAgICAgXG4gKiAgICAgICAgIF9fX19fX18uIF9fICAuX19fX19fICAgICAuX18gICBfXy4gICAgICBfX18gICAgICBcbiAqICAgICAgICAvICAgICAgIHx8ICB8IHwgICBfICBcXCAgICB8ICBcXCB8ICB8ICAgICAvICAgXFwgICAgIFxuICogICAgICAgfCAgICgtLS0tYHwgIHwgfCAgfF8pICB8ICAgfCAgIFxcfCAgfCAgICAvICBeICBcXCAgICBcbiAqICAgICAgICBcXCAgIFxcICAgIHwgIHwgfCAgICAgIC8gICAgfCAgLiBgICB8ICAgLyAgL19cXCAgXFwgICBcbiAqICAgIC4tLS0tKSAgIHwgICB8ICB8IHwgIHxcXCAgXFwtLS0tfCAgfFxcICAgfCAgLyAgX19fX18gIFxcICBcbiAqICAgIHxfX19fX19fLyAgICB8X198IHwgX3wgYC5fX19fX3xfX3wgXFxfX3wgL19fLyAgICAgXFxfX1xcIFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gKi9cblxuKGZ1bmN0aW9uKCAkICkge1xuICAgIFxuICAgICQoIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIC8vIGNvbnZlcnQgcmdiIHRvIGhleCB2YWx1ZSBzdHJpbmdcbiAgICAgICAgZnVuY3Rpb24gcmdiMmhleChyZ2IpIHtcbiAgICAgICAgICAgIGlmICgvXiNbMC05QS1GXXs2fSQvaS50ZXN0KHJnYikpIHsgcmV0dXJuIHJnYjsgfVxuXG4gICAgICAgICAgICByZ2IgPSByZ2IubWF0Y2goL15yZ2JcXCgoXFxkKyksXFxzKihcXGQrKSxcXHMqKFxcZCspXFwpJC8pO1xuXG4gICAgICAgICAgICBpZiAocmdiID09PSBudWxsKSB7IHJldHVybiBcIk4vQVwiOyB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGhleCh4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChcIjBcIiArIHBhcnNlSW50KHgpLnRvU3RyaW5nKDE2KSkuc2xpY2UoLTIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gXCIjXCIgKyBoZXgocmdiWzFdKSArIGhleChyZ2JbMl0pICsgaGV4KHJnYlszXSk7XG4gICAgICAgIH1cblxuICAgICAgICAkKCcuZHluYW1pYy1jb2xvciAuY29sJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKHRoaXMpLmNoaWxkcmVuKCkuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdmFyIGNvbG9yID0gJCh0aGlzKS5jc3MoJ2JhY2tncm91bmQtY29sb3InKSxcbiAgICAgICAgICAgICAgICBjbGFzc2VzID0gJCh0aGlzKS5hdHRyKCdjbGFzcycpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICQodGhpcykuaHRtbChyZ2IyaGV4KGNvbG9yKSArIFwiIFwiICsgY2xhc3Nlcyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoY2xhc3Nlcy5pbmRleE9mKFwiZGFya2VuXCIpID49IDAgfHwgJCh0aGlzKS5oYXNDbGFzcygnYmxhY2snKSkge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmNzcygnY29sb3InLCAncmdiYSgyNTUsMjU1LDI1NSwuOScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBQbHVnaW4gaW5pdGlhbGl6YXRpb25cbiAgICAgICAgJCgnLnNsaWRlcicpLnNsaWRlcih7ZnVsbF93aWR0aDogdHJ1ZX0pO1xuICAgICAgICAkKCcucGFyYWxsYXgnKS5wYXJhbGxheCgpO1xuICAgICAgICAkKCcubW9kYWwtdHJpZ2dlcicpLmxlYW5Nb2RhbCgpO1xuICAgICAgICAkKCcuc2Nyb2xsc3B5Jykuc2Nyb2xsU3B5KCk7XG4gICAgICAgICQoJy5idXR0b24tY29sbGFwc2UnKS5zaWRlTmF2KHsnZWRnZSc6ICdsZWZ0J30pO1xuICAgICAgICAkKCcuZGF0ZXBpY2tlcicpLnBpY2thZGF0ZSh7c2VsZWN0WWVhcnM6IDIwfSk7XG4gICAgICAgICQoJ3NlbGVjdCcpLm5vdCgnLmRpc2FibGVkJykubWF0ZXJpYWxfc2VsZWN0KCk7XG4gICAgfSk7XG59KShqUXVlcnkpOyJdfQ==
