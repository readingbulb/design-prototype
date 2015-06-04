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

 var BrowserLimit = require('./proto/BrowserLimit')
 ,   Nav = require('./proto/Nav')
 ,   Content = require('./proto/Content')
 ,   MediaFilter = require('./proto/MediaFilter')
 ,   SearchFilter = require('./proto/SearchFilter')
 ;

 BrowserLimit.init();

(function( $ ) {
    
    // $( function() {
    //     window.mySwipe = $('#swipeWrapper').Swipe().data('Swipe');
    // });
    
    $(function() {

        Nav.init();
        
        Content.initCoverUI();
        
        MediaFilter.initMediaList();
        MediaFilter.initContryFilter();
        MediaFilter.initInitialScroll();
        MediaFilter.initOverlayToggler();
        MediaFilter.initSelectMediaByLang();

        SearchFilter.initOverlayToggler();

        // $('.side-nav-toggler').sideNav();
    });

})(jQuery);
},{"./proto/BrowserLimit":2,"./proto/Content":3,"./proto/MediaFilter":4,"./proto/Nav":5,"./proto/SearchFilter":6}],2:[function(require,module,exports){
var BrowserLimit = {
    init: init
};

function init() {

    if (!Modernizr.touch) { 
        var el = document.getElementById("browser-limit");
        el.classList.add("active");
    }
}

module.exports = BrowserLimit;
},{}],3:[function(require,module,exports){
var Content = {
    initCoverUI: initCoverUI
};

function initCoverUI() {
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
},{}],4:[function(require,module,exports){
var MediaFilter = {
    initMediaList: initMediaList,
    initContryFilter: initContryFilter,
    initInitialScroll: initInitialScroll,
    initOverlayToggler: initOverlayToggler,
    initSelectMediaByLang: initSelectMediaByLang
};

function initOverlayToggler() {
    if ( !$('.filter-nav-outer #filterToggler').length &&
         !$('.filter-outer').length
    ) return;

    var $togglerIn = $('#filterToggler')
    ,   $togglerOut = $('.filter-submit-btn, .filter-outer-overlay')
    ,   $togglerParent = $('.filter-nav-inner')
    ,   $el = $('.filter-outer')
    ;

    $togglerIn.on( 'click', function(e) {

        e.preventDefault();

        $togglerParent.removeClass( 'active' );

        if ( !$el.hasClass('active') )
            $el.addClass('active');

        $('body').toggleClass('no-scroll');
    });

    $togglerOut.on('click', function(e) {

        e.preventDefault();

        if ( $el.hasClass('active') )
            $el.removeClass('active');

        $('body').toggleClass('no-scroll');
    });
}

function initMediaList() {
    if ( !$('.media-toggler-link').length ) return;

    var $el = $('.media-toggler-link');

    $el.each(
        function(i) {

            var $icon = $(this).find('.icon');

            $(this).on('click', function(e) {
                e.preventDefault();

                $icon.toggleClass('fa-check');
            })
        }
    );
}

function initContryFilter() {
    if ( !$('.filter-sel').length ) return;

    $('#filterByCountry')
        .dropdown({
            mobile: true,
            label: 'Select Country'
        });

    $('#filterByLang')
        .dropdown({
            mobile: true,
            label: 'Select Language'
        });
}

function initInitialScroll() {
    if ( !$('.filter-initial-outer .filter-initial-link').length &&
         !$('.filter-media-outer .media-group').length
    ) return;

    var $targets = $('.filter-media-outer.selected .media-group')
    ,   $initials = $('.filter-initial-outer .filter-initial-link')
    ;

    $initials.each( function(i) {
        var $el = $(this)
        ,   _initial = $el.data('initial-link')
        ,   Target = {}
        ;

        $el.on( 'click', function(e) {
            e.preventDefault();

            // Set the element
            Target.$el = $targets.filter(
                    function( i ) {
                        return $(this).attr('data-initial') === _initial;
                    }
                );

            // Get its offset top
            Target.top = Target.$el.offset().top;

            // Get the scrollTop offset
            Target.offset = $('.filter-media-outer').offset().top || 0;

            scrollOuter( Target );
        });
    });

    function scrollOuter( data ) {

        data = data || {};
        data.offset = data.offset || 0;
        data.top = data.top || 0;

        var val = data.top - data.offset
        ,   $outer = $('.filter-media-outer');

        $outer.animate(
            {
                scrollTop: '+=' + val + ''
            },
            'slow'
        );
    }
}

function initSelectMediaByLang() {
    if ( !$('.filter-select-outer #filterByLang').length &&
         !$('.filter-media-outer').length
    ) return;

    var $sel = $('#filterByLang')
    ,   $target = $('.filter-media-outer')
    ;

    $sel.on('change', function(e) {

        var _val = $(this).val()

        ,  $_target = $('.filter-media-outer').filter(
                function( i ) {
                    return $(this).attr('data-lang') === _val;
                }
            )
        ;

        // console.log($_target);

        $('.filter-media-outer').removeClass('selected');
        $_target.addClass('selected');
    });
}

module.exports = MediaFilter;
},{}],5:[function(require,module,exports){
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

    $('.filter-nav-toggler').on('click', function(e) {

        e.preventDefault();
        toggleFilterNav();
    });

    $('.is-headroom .navbar-fixed .main-nav-outer')
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
},{}],6:[function(require,module,exports){
var SearchFilter = {
    initOverlayToggler: initOverlayToggler
};

function initOverlayToggler() {
    if ( !$('.filter-nav-outer #searchToggler').length &&
         !$('.search-outer').length
    ) return;

    var $togglerIn = $('#searchToggler')
    ,   $togglerOut = $('.search-submit-btn, .search-outer-overlay')
    ,   $togglerParent = $('.filter-nav-inner')
    ,   $el = $('.search-outer')
    ;

    $togglerIn.on( 'click', function(e) {

        e.preventDefault();

        $togglerParent.removeClass( 'active' );

        if ( !$el.hasClass('active') )
            $el.addClass('active');

        $('body').toggleClass('no-scroll');
    });

    $togglerOut.on('click', function(e) {

        console.log(this);

        e.preventDefault();

        if ( $el.hasClass('active') )
            $el.removeClass('active');

        $('body').toggleClass('no-scroll');
    });
}

module.exports = SearchFilter;
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0L3JiLXByb3RvLmpzIiwic3JjL3NjcmlwdC9wcm90by9Ccm93c2VyTGltaXQvaW5kZXguanMiLCJzcmMvc2NyaXB0L3Byb3RvL0NvbnRlbnQvaW5kZXguanMiLCJzcmMvc2NyaXB0L3Byb3RvL01lZGlhRmlsdGVyL2luZGV4LmpzIiwic3JjL3NjcmlwdC9wcm90by9OYXYvaW5kZXguanMiLCJzcmMvc2NyaXB0L3Byb3RvL1NlYXJjaEZpbHRlci9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKioqXG4gKiAgICAgICAgICAgX18gICAgX18gICAgICAgX19fICAgICAgIF9fICAgX18gICAgICAgICAgICAgICBcbiAqICAgICAgICAgIHwgIHwgIHwgIHwgICAgIC8gICBcXCAgICAgfCAgfCB8ICB8ICAgICAgICAgICAgICBcbiAqICAgICAgICAgIHwgIHxfX3wgIHwgICAgLyAgXiAgXFwgICAgfCAgfCB8ICB8ICAgICAgICAgICAgICBcbiAqICAgICAgICAgIHwgICBfXyAgIHwgICAvICAvX1xcICBcXCAgIHwgIHwgfCAgfCAgICAgICAgICAgICAgXG4gKiAgICAgICAgICB8ICB8ICB8ICB8ICAvICBfX19fXyAgXFwgIHwgIHwgfCAgYC0tLS0uICAgICAgICAgXG4gKiAgICAgICAgICB8X198ICB8X198IC9fXy8gICAgIFxcX19cXCB8X198IHxfX19fX19ffCAgICAgICAgIFxuICogICAgICAgICBfX19fX19fLiBfXyAgLl9fX19fXyAgICAgLl9fICAgX18uICAgICAgX19fICAgICAgXG4gKiAgICAgICAgLyAgICAgICB8fCAgfCB8ICAgXyAgXFwgICAgfCAgXFwgfCAgfCAgICAgLyAgIFxcICAgICBcbiAqICAgICAgIHwgICAoLS0tLWB8ICB8IHwgIHxfKSAgfCAgIHwgICBcXHwgIHwgICAgLyAgXiAgXFwgICAgXG4gKiAgICAgICAgXFwgICBcXCAgICB8ICB8IHwgICAgICAvICAgIHwgIC4gYCAgfCAgIC8gIC9fXFwgIFxcICAgXG4gKiAgICAuLS0tLSkgICB8ICAgfCAgfCB8ICB8XFwgIFxcLS0tLXwgIHxcXCAgIHwgIC8gIF9fX19fICBcXCAgXG4gKiAgICB8X19fX19fXy8gICAgfF9ffCB8IF98IGAuX19fX198X198IFxcX198IC9fXy8gICAgIFxcX19cXCBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICovXG5cbiB2YXIgQnJvd3NlckxpbWl0ID0gcmVxdWlyZSgnLi9wcm90by9Ccm93c2VyTGltaXQnKVxuICwgICBOYXYgPSByZXF1aXJlKCcuL3Byb3RvL05hdicpXG4gLCAgIENvbnRlbnQgPSByZXF1aXJlKCcuL3Byb3RvL0NvbnRlbnQnKVxuICwgICBNZWRpYUZpbHRlciA9IHJlcXVpcmUoJy4vcHJvdG8vTWVkaWFGaWx0ZXInKVxuICwgICBTZWFyY2hGaWx0ZXIgPSByZXF1aXJlKCcuL3Byb3RvL1NlYXJjaEZpbHRlcicpXG4gO1xuXG4gQnJvd3NlckxpbWl0LmluaXQoKTtcblxuKGZ1bmN0aW9uKCAkICkge1xuICAgIFxuICAgIC8vICQoIGZ1bmN0aW9uKCkge1xuICAgIC8vICAgICB3aW5kb3cubXlTd2lwZSA9ICQoJyNzd2lwZVdyYXBwZXInKS5Td2lwZSgpLmRhdGEoJ1N3aXBlJyk7XG4gICAgLy8gfSk7XG4gICAgXG4gICAgJChmdW5jdGlvbigpIHtcblxuICAgICAgICBOYXYuaW5pdCgpO1xuICAgICAgICBcbiAgICAgICAgQ29udGVudC5pbml0Q292ZXJVSSgpO1xuICAgICAgICBcbiAgICAgICAgTWVkaWFGaWx0ZXIuaW5pdE1lZGlhTGlzdCgpO1xuICAgICAgICBNZWRpYUZpbHRlci5pbml0Q29udHJ5RmlsdGVyKCk7XG4gICAgICAgIE1lZGlhRmlsdGVyLmluaXRJbml0aWFsU2Nyb2xsKCk7XG4gICAgICAgIE1lZGlhRmlsdGVyLmluaXRPdmVybGF5VG9nZ2xlcigpO1xuICAgICAgICBNZWRpYUZpbHRlci5pbml0U2VsZWN0TWVkaWFCeUxhbmcoKTtcblxuICAgICAgICBTZWFyY2hGaWx0ZXIuaW5pdE92ZXJsYXlUb2dnbGVyKCk7XG5cbiAgICAgICAgLy8gJCgnLnNpZGUtbmF2LXRvZ2dsZXInKS5zaWRlTmF2KCk7XG4gICAgfSk7XG5cbn0pKGpRdWVyeSk7IiwidmFyIEJyb3dzZXJMaW1pdCA9IHtcbiAgICBpbml0OiBpbml0XG59O1xuXG5mdW5jdGlvbiBpbml0KCkge1xuXG4gICAgaWYgKCFNb2Rlcm5penIudG91Y2gpIHsgXG4gICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnJvd3Nlci1saW1pdFwiKTtcbiAgICAgICAgZWwuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQnJvd3NlckxpbWl0OyIsInZhciBDb250ZW50ID0ge1xuICAgIGluaXRDb3ZlclVJOiBpbml0Q292ZXJVSVxufTtcblxuZnVuY3Rpb24gaW5pdENvdmVyVUkoKSB7XG4gICAgaWYgKCAhJCgnLmNvbnRlbnQtY292ZXItaW1hZ2UnKS5sZW5ndGggKSByZXR1cm47XG5cbiAgICB2YXIgJHRhcmdldCA9ICQoJy5jb250ZW50LWNvdmVyLWltYWdlJyk7XG5cbiAgICAkdGFyZ2V0LmVhY2goIGZ1bmN0aW9uKCBpICkge1xuXG4gICAgICAgIHZhciBfc3JjID0gJCggdGhpcyApLmRhdGEoJ3NyYycpO1xuXG4gICAgICAgICQoIHRoaXMgKS5iYWNrZ3JvdW5kKHtcbiAgICAgICAgICAgIHNvdXJjZTogX3NyY1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb250ZW50OyIsInZhciBNZWRpYUZpbHRlciA9IHtcbiAgICBpbml0TWVkaWFMaXN0OiBpbml0TWVkaWFMaXN0LFxuICAgIGluaXRDb250cnlGaWx0ZXI6IGluaXRDb250cnlGaWx0ZXIsXG4gICAgaW5pdEluaXRpYWxTY3JvbGw6IGluaXRJbml0aWFsU2Nyb2xsLFxuICAgIGluaXRPdmVybGF5VG9nZ2xlcjogaW5pdE92ZXJsYXlUb2dnbGVyLFxuICAgIGluaXRTZWxlY3RNZWRpYUJ5TGFuZzogaW5pdFNlbGVjdE1lZGlhQnlMYW5nXG59O1xuXG5mdW5jdGlvbiBpbml0T3ZlcmxheVRvZ2dsZXIoKSB7XG4gICAgaWYgKCAhJCgnLmZpbHRlci1uYXYtb3V0ZXIgI2ZpbHRlclRvZ2dsZXInKS5sZW5ndGggJiZcbiAgICAgICAgICEkKCcuZmlsdGVyLW91dGVyJykubGVuZ3RoXG4gICAgKSByZXR1cm47XG5cbiAgICB2YXIgJHRvZ2dsZXJJbiA9ICQoJyNmaWx0ZXJUb2dnbGVyJylcbiAgICAsICAgJHRvZ2dsZXJPdXQgPSAkKCcuZmlsdGVyLXN1Ym1pdC1idG4sIC5maWx0ZXItb3V0ZXItb3ZlcmxheScpXG4gICAgLCAgICR0b2dnbGVyUGFyZW50ID0gJCgnLmZpbHRlci1uYXYtaW5uZXInKVxuICAgICwgICAkZWwgPSAkKCcuZmlsdGVyLW91dGVyJylcbiAgICA7XG5cbiAgICAkdG9nZ2xlckluLm9uKCAnY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICR0b2dnbGVyUGFyZW50LnJlbW92ZUNsYXNzKCAnYWN0aXZlJyApO1xuXG4gICAgICAgIGlmICggISRlbC5oYXNDbGFzcygnYWN0aXZlJykgKVxuICAgICAgICAgICAgJGVsLmFkZENsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgICAkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ25vLXNjcm9sbCcpO1xuICAgIH0pO1xuXG4gICAgJHRvZ2dsZXJPdXQub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBpZiAoICRlbC5oYXNDbGFzcygnYWN0aXZlJykgKVxuICAgICAgICAgICAgJGVsLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgICAkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ25vLXNjcm9sbCcpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBpbml0TWVkaWFMaXN0KCkge1xuICAgIGlmICggISQoJy5tZWRpYS10b2dnbGVyLWxpbmsnKS5sZW5ndGggKSByZXR1cm47XG5cbiAgICB2YXIgJGVsID0gJCgnLm1lZGlhLXRvZ2dsZXItbGluaycpO1xuXG4gICAgJGVsLmVhY2goXG4gICAgICAgIGZ1bmN0aW9uKGkpIHtcblxuICAgICAgICAgICAgdmFyICRpY29uID0gJCh0aGlzKS5maW5kKCcuaWNvbicpO1xuXG4gICAgICAgICAgICAkKHRoaXMpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICAkaWNvbi50b2dnbGVDbGFzcygnZmEtY2hlY2snKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICApO1xufVxuXG5mdW5jdGlvbiBpbml0Q29udHJ5RmlsdGVyKCkge1xuICAgIGlmICggISQoJy5maWx0ZXItc2VsJykubGVuZ3RoICkgcmV0dXJuO1xuXG4gICAgJCgnI2ZpbHRlckJ5Q291bnRyeScpXG4gICAgICAgIC5kcm9wZG93bih7XG4gICAgICAgICAgICBtb2JpbGU6IHRydWUsXG4gICAgICAgICAgICBsYWJlbDogJ1NlbGVjdCBDb3VudHJ5J1xuICAgICAgICB9KTtcblxuICAgICQoJyNmaWx0ZXJCeUxhbmcnKVxuICAgICAgICAuZHJvcGRvd24oe1xuICAgICAgICAgICAgbW9iaWxlOiB0cnVlLFxuICAgICAgICAgICAgbGFiZWw6ICdTZWxlY3QgTGFuZ3VhZ2UnXG4gICAgICAgIH0pO1xufVxuXG5mdW5jdGlvbiBpbml0SW5pdGlhbFNjcm9sbCgpIHtcbiAgICBpZiAoICEkKCcuZmlsdGVyLWluaXRpYWwtb3V0ZXIgLmZpbHRlci1pbml0aWFsLWxpbmsnKS5sZW5ndGggJiZcbiAgICAgICAgICEkKCcuZmlsdGVyLW1lZGlhLW91dGVyIC5tZWRpYS1ncm91cCcpLmxlbmd0aFxuICAgICkgcmV0dXJuO1xuXG4gICAgdmFyICR0YXJnZXRzID0gJCgnLmZpbHRlci1tZWRpYS1vdXRlci5zZWxlY3RlZCAubWVkaWEtZ3JvdXAnKVxuICAgICwgICAkaW5pdGlhbHMgPSAkKCcuZmlsdGVyLWluaXRpYWwtb3V0ZXIgLmZpbHRlci1pbml0aWFsLWxpbmsnKVxuICAgIDtcblxuICAgICRpbml0aWFscy5lYWNoKCBmdW5jdGlvbihpKSB7XG4gICAgICAgIHZhciAkZWwgPSAkKHRoaXMpXG4gICAgICAgICwgICBfaW5pdGlhbCA9ICRlbC5kYXRhKCdpbml0aWFsLWxpbmsnKVxuICAgICAgICAsICAgVGFyZ2V0ID0ge31cbiAgICAgICAgO1xuXG4gICAgICAgICRlbC5vbiggJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAvLyBTZXQgdGhlIGVsZW1lbnRcbiAgICAgICAgICAgIFRhcmdldC4kZWwgPSAkdGFyZ2V0cy5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCBpICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICQodGhpcykuYXR0cignZGF0YS1pbml0aWFsJykgPT09IF9pbml0aWFsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgLy8gR2V0IGl0cyBvZmZzZXQgdG9wXG4gICAgICAgICAgICBUYXJnZXQudG9wID0gVGFyZ2V0LiRlbC5vZmZzZXQoKS50b3A7XG5cbiAgICAgICAgICAgIC8vIEdldCB0aGUgc2Nyb2xsVG9wIG9mZnNldFxuICAgICAgICAgICAgVGFyZ2V0Lm9mZnNldCA9ICQoJy5maWx0ZXItbWVkaWEtb3V0ZXInKS5vZmZzZXQoKS50b3AgfHwgMDtcblxuICAgICAgICAgICAgc2Nyb2xsT3V0ZXIoIFRhcmdldCApO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIHNjcm9sbE91dGVyKCBkYXRhICkge1xuXG4gICAgICAgIGRhdGEgPSBkYXRhIHx8IHt9O1xuICAgICAgICBkYXRhLm9mZnNldCA9IGRhdGEub2Zmc2V0IHx8IDA7XG4gICAgICAgIGRhdGEudG9wID0gZGF0YS50b3AgfHwgMDtcblxuICAgICAgICB2YXIgdmFsID0gZGF0YS50b3AgLSBkYXRhLm9mZnNldFxuICAgICAgICAsICAgJG91dGVyID0gJCgnLmZpbHRlci1tZWRpYS1vdXRlcicpO1xuXG4gICAgICAgICRvdXRlci5hbmltYXRlKFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogJys9JyArIHZhbCArICcnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ3Nsb3cnXG4gICAgICAgICk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBpbml0U2VsZWN0TWVkaWFCeUxhbmcoKSB7XG4gICAgaWYgKCAhJCgnLmZpbHRlci1zZWxlY3Qtb3V0ZXIgI2ZpbHRlckJ5TGFuZycpLmxlbmd0aCAmJlxuICAgICAgICAgISQoJy5maWx0ZXItbWVkaWEtb3V0ZXInKS5sZW5ndGhcbiAgICApIHJldHVybjtcblxuICAgIHZhciAkc2VsID0gJCgnI2ZpbHRlckJ5TGFuZycpXG4gICAgLCAgICR0YXJnZXQgPSAkKCcuZmlsdGVyLW1lZGlhLW91dGVyJylcbiAgICA7XG5cbiAgICAkc2VsLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgdmFyIF92YWwgPSAkKHRoaXMpLnZhbCgpXG5cbiAgICAgICAgLCAgJF90YXJnZXQgPSAkKCcuZmlsdGVyLW1lZGlhLW91dGVyJykuZmlsdGVyKFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCBpICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJCh0aGlzKS5hdHRyKCdkYXRhLWxhbmcnKSA9PT0gX3ZhbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApXG4gICAgICAgIDtcblxuICAgICAgICAvLyBjb25zb2xlLmxvZygkX3RhcmdldCk7XG5cbiAgICAgICAgJCgnLmZpbHRlci1tZWRpYS1vdXRlcicpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuICAgICAgICAkX3RhcmdldC5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNZWRpYUZpbHRlcjsiLCJ2YXIgTmF2ID0ge1xuICAgIGluaXQ6IGluaXRcbn07XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG5cbiAgICBmdW5jdGlvbiB0b2dnbGVGaWx0ZXJOYXYoKSB7XG4gICAgICAgIHZhciAkZWwgPSAkKCcuZmlsdGVyLW5hdi1pbm5lcicpO1xuXG4gICAgICAgIGlmICggJGVsLmhhc0NsYXNzKCdhY3RpdmUnKSApIHtcbiAgICAgICAgICAgICRlbC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAkKCcuZmlsdGVyLW5hdi10b2dnbGVyJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgJGVsLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICQoJy5maWx0ZXItbmF2LXRvZ2dsZXInKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAkKCcuZmlsdGVyLW5hdi10b2dnbGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdG9nZ2xlRmlsdGVyTmF2KCk7XG4gICAgfSk7XG5cbiAgICAkKCcuaXMtaGVhZHJvb20gLm5hdmJhci1maXhlZCAubWFpbi1uYXYtb3V0ZXInKVxuICAgICAgICAuaGVhZHJvb20oe1xuICAgICAgICAgICAgXCJvZmZzZXRcIjogODAsXG4gICAgICAgICAgICBcInRvbGVyYW5jZVwiOiA1LFxuICAgICAgICAgICAgXCJjbGFzc2VzXCI6IHtcbiAgICAgICAgICAgICAgICBcImluaXRpYWxcIjogXCJuYXZiYXItYW5pbWF0ZWRcIixcbiAgICAgICAgICAgICAgICBcInBpbm5lZFwiOiBcIm5hdmJhci1zbGlkZS1kb3duXCIsXG4gICAgICAgICAgICAgICAgXCJ1bnBpbm5lZFwiOiBcIm5hdmJhci1zbGlkZS11cFwiLFxuICAgICAgICAgICAgICAgIFwidG9wXCI6IFwibmF2YmFyLW9uLXRvcFwiLFxuICAgICAgICAgICAgICAgIFwibm90VG9wXCI6IFwibmF2YmFyLW5vdC10b3BcIlxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgXCJvblVucGluXCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICQoJy5maWx0ZXItbmF2LWlubmVyJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgICQoJy5maWx0ZXItbmF2LXRvZ2dsZXInKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE5hdjsiLCJ2YXIgU2VhcmNoRmlsdGVyID0ge1xuICAgIGluaXRPdmVybGF5VG9nZ2xlcjogaW5pdE92ZXJsYXlUb2dnbGVyXG59O1xuXG5mdW5jdGlvbiBpbml0T3ZlcmxheVRvZ2dsZXIoKSB7XG4gICAgaWYgKCAhJCgnLmZpbHRlci1uYXYtb3V0ZXIgI3NlYXJjaFRvZ2dsZXInKS5sZW5ndGggJiZcbiAgICAgICAgICEkKCcuc2VhcmNoLW91dGVyJykubGVuZ3RoXG4gICAgKSByZXR1cm47XG5cbiAgICB2YXIgJHRvZ2dsZXJJbiA9ICQoJyNzZWFyY2hUb2dnbGVyJylcbiAgICAsICAgJHRvZ2dsZXJPdXQgPSAkKCcuc2VhcmNoLXN1Ym1pdC1idG4sIC5zZWFyY2gtb3V0ZXItb3ZlcmxheScpXG4gICAgLCAgICR0b2dnbGVyUGFyZW50ID0gJCgnLmZpbHRlci1uYXYtaW5uZXInKVxuICAgICwgICAkZWwgPSAkKCcuc2VhcmNoLW91dGVyJylcbiAgICA7XG5cbiAgICAkdG9nZ2xlckluLm9uKCAnY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICR0b2dnbGVyUGFyZW50LnJlbW92ZUNsYXNzKCAnYWN0aXZlJyApO1xuXG4gICAgICAgIGlmICggISRlbC5oYXNDbGFzcygnYWN0aXZlJykgKVxuICAgICAgICAgICAgJGVsLmFkZENsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgICAkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ25vLXNjcm9sbCcpO1xuICAgIH0pO1xuXG4gICAgJHRvZ2dsZXJPdXQub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMpO1xuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBpZiAoICRlbC5oYXNDbGFzcygnYWN0aXZlJykgKVxuICAgICAgICAgICAgJGVsLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgICAkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ25vLXNjcm9sbCcpO1xuICAgIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNlYXJjaEZpbHRlcjsiXX0=
