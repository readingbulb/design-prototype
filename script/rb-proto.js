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

 ,   Aggressor = require( './proto/Aggressor' )
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

        if ($( '#main' ).hasClass( 'latest-main' )) Aggressor.getFeed( 'latest' );
        else if ($( '#main' ).hasClass( 'featured-main' )) Aggressor.getFeed( 'featured' );
        else if ($( '#main' ).hasClass( 'subscribed-main' )) Aggressor.getFeed( 'subscribed' );

        // $('.side-nav-toggler').sideNav();
    });

})(jQuery);
},{"./proto/Aggressor":2,"./proto/BrowserLimit":3,"./proto/Content":4,"./proto/MediaFilter":6,"./proto/Nav":7,"./proto/SearchFilter":8}],2:[function(require,module,exports){
var Impulsor = require( '../Impulsor' );

var Aggressor = {
    initFilter: initFilter,
    getFeed: getFeed,
    setSubscribe: setSubscribe,
    setFilterBySource: setFilterBySource,
    setFilterByLang: setFilterByLang,
    renderData: renderData,
    handleError: handleError,
    runLog: runLog
};

function getFeed( feedType, val ) {
    
    feedType = feedType || 'latest';

    var _self = this
    ,   _params = {
            k: val
        }
    ;

    $.ajax({
        type: "GET",
        url: feedType + ".json",
        dataType: 'json',
        success: function( data ) {

            // console.log( data[0] );

            $('#main-preloader').toggleClass( 'hidden' );
            
            for ( var i = 0; i < data.length; i ++ ) {
                _self.renderData( feedType, data[i] );
            }
        },

        error: function( jqxhr, textStatus, error ) {
            _self.handleError( jqxhr, textStatus, error );
        }
    });
}

function setSubscribe( val ) {

    var _self = this;

    $.ajax({
        url: 'http://readingbulb.com/api/set_subscribe',
        data: { k: val },
        type: 'GET',
        dataType: 'jsonp',
        success: function(data) {
            console.log( data );
            if (data.status=="added") _self.getFeed( 'subscribe', val );
        },
        error: function( jqxhr, textStatus, error ) {
            _self.handleError( jqxhr, textStatus, error );
        }
    });
}

function initFilter() {
    if (!$( '.media-toggler-link' ).length ) return;

    var _self = this;

    var $elSourceToggler = $( '.media-toggler-link' );

    // $('#filterToggler').one('click', function(e) {
    //     _self.setFilterByLang( '1' );
    // });

    $elSourceToggler.each(
        function(i) {
            $(this).on('click', function(e) {
                _self.setFilterBySource( $(this).data('val') );
            });
        }
    );
}

function setFilterByLang( val ) {

    var _self = this;

    var _params = {
        type: 'language',
        value: val + ''
    };

    $.ajax({
        type: "GET",
        url: "http://readingbulb.com/api/set_filter?type=language&value=1",
        dataType: 'jsonp',
        data: _params,
        success: function( data ) {
            _self.runLog(data);
        },
        error: function( jqxhr, textStatus, error ) {
            _self.handleError( jqxhr, textStatus, error );
        }
    });
}

function setFilterBySource( val ) {

    var _self = this;

    var _params = {
        type: 'source',
        value: val
    };

    $.ajax({
        type: "GET",
        url: "http://readingbulb.com/api/set_filter?type=source&value=198",
        dataType: 'jsonp',
        data: '',
        success: function( data ) {
            console.log( data[0] );
        },
        error: function( jqxhr, textStatus, error ) {
            _self.handleError( jqxhr, textStatus, error );
        }
    });
}

function renderData( feedType, data ) {
    Impulsor.createMarkup( feedType, $('#feeds-outer'), data );
}

function runLog( data ) {
    console.log( data );
}

function handleError( jqxhr, textStatus, error ) {
    console.log(jqxhr);
    console.log(textStatus);
    console.log(error);
}

module.exports = Aggressor;
},{"../Impulsor":5}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
var Impulsor = {
    createMarkup: createMarkup,
    parseTimeago: parseTimeago
};

function createMarkup( modelType, context, data ) {

    if( !$('.markup-model').length ) return;

    context = context || $('#feeds-outer');

    var _self = this;

    var $mm = $('.card.markup-model');

    if ( modelType === 'featured' ) {

        $mm
            .clone()
            .removeClass('markup-model')
            .find( '.card-image img' ).attr( 'src', data.image ).end()
            .find( '.card-content-title a' ).attr( 'href', data.content_url ).text( data.title ).end()
            .find( '.meta-from' ).text( data.source.name ).end()
            .find( '.meta-timeago' ).text( _self.parseTimeago( data.time_news ) ).end()
            .find( '.card-content-summary' ).html( data.summary ).end()
            .appendTo( context );
    }

    else if ( modelType === 'latest' ) {

        $mm
            .clone()
            .removeClass('markup-model')
            .find( '.card-content-title a' ).attr( 'href', data.content_url ).text( data.title ).end()
            .find( '.meta-from' ).text( data.source.name ).end()
            .find( '.meta-timeago' ).text( _self.parseTimeago( data.time_news ) ).end()
            .appendTo( context );
    }

    else if ( modelType === 'subscribed' ) {

        $mm
            .clone()
            .removeClass('markup-model')
            .find( '.card-image img' ).attr( 'src', data.image ).end()
            .find( '.card-content-title a' ).attr( 'href', data.content_url ).text( data.title ).end()
            .find( '.meta-from' ).text( data.source.name ).end()
            .find( '.meta-timeago' ).text( _self.parseTimeago( data.time_news ) ).end()
            .find( '.card-content-summary' ).html( data.summary ).end()
            .appendTo( context );

            $( '.card-image img' ).each(
                function( i ) {
                    if ( $( this ).attr( 'src' ) === '' ) $( this ).remove();
                }
            );
    }

}

function parseTimeago( m ) {
    return moment( m, 'YYYY-MM-DD HH:mm:ss' ).fromNow();
}

module.exports = Impulsor;
},{}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
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

        console.log( $(this) );

        e.preventDefault();
        toggleFilterNav();
    });

    $('.is-headroom .navbar-fixed .main-nav-outer')
        .headroom({
            "offset": 80,
            "tolerance": 3,
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
},{}],8:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0L3JiLXByb3RvLmpzIiwic3JjL3NjcmlwdC9wcm90by9BZ2dyZXNzb3IvaW5kZXguanMiLCJzcmMvc2NyaXB0L3Byb3RvL0Jyb3dzZXJMaW1pdC9pbmRleC5qcyIsInNyYy9zY3JpcHQvcHJvdG8vQ29udGVudC9pbmRleC5qcyIsInNyYy9zY3JpcHQvcHJvdG8vSW1wdWxzb3IvaW5kZXguanMiLCJzcmMvc2NyaXB0L3Byb3RvL01lZGlhRmlsdGVyL2luZGV4LmpzIiwic3JjL3NjcmlwdC9wcm90by9OYXYvaW5kZXguanMiLCJzcmMvc2NyaXB0L3Byb3RvL1NlYXJjaEZpbHRlci9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKioqXG4gKiAgICAgICAgICAgX18gICAgX18gICAgICAgX19fICAgICAgIF9fICAgX18gICAgICAgICAgICAgICBcbiAqICAgICAgICAgIHwgIHwgIHwgIHwgICAgIC8gICBcXCAgICAgfCAgfCB8ICB8ICAgICAgICAgICAgICBcbiAqICAgICAgICAgIHwgIHxfX3wgIHwgICAgLyAgXiAgXFwgICAgfCAgfCB8ICB8ICAgICAgICAgICAgICBcbiAqICAgICAgICAgIHwgICBfXyAgIHwgICAvICAvX1xcICBcXCAgIHwgIHwgfCAgfCAgICAgICAgICAgICAgXG4gKiAgICAgICAgICB8ICB8ICB8ICB8ICAvICBfX19fXyAgXFwgIHwgIHwgfCAgYC0tLS0uICAgICAgICAgXG4gKiAgICAgICAgICB8X198ICB8X198IC9fXy8gICAgIFxcX19cXCB8X198IHxfX19fX19ffCAgICAgICAgIFxuICogICAgICAgICBfX19fX19fLiBfXyAgLl9fX19fXyAgICAgLl9fICAgX18uICAgICAgX19fICAgICAgXG4gKiAgICAgICAgLyAgICAgICB8fCAgfCB8ICAgXyAgXFwgICAgfCAgXFwgfCAgfCAgICAgLyAgIFxcICAgICBcbiAqICAgICAgIHwgICAoLS0tLWB8ICB8IHwgIHxfKSAgfCAgIHwgICBcXHwgIHwgICAgLyAgXiAgXFwgICAgXG4gKiAgICAgICAgXFwgICBcXCAgICB8ICB8IHwgICAgICAvICAgIHwgIC4gYCAgfCAgIC8gIC9fXFwgIFxcICAgXG4gKiAgICAuLS0tLSkgICB8ICAgfCAgfCB8ICB8XFwgIFxcLS0tLXwgIHxcXCAgIHwgIC8gIF9fX19fICBcXCAgXG4gKiAgICB8X19fX19fXy8gICAgfF9ffCB8IF98IGAuX19fX198X198IFxcX198IC9fXy8gICAgIFxcX19cXCBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICovXG5cbiB2YXIgQnJvd3NlckxpbWl0ID0gcmVxdWlyZSgnLi9wcm90by9Ccm93c2VyTGltaXQnKVxuICwgICBOYXYgPSByZXF1aXJlKCcuL3Byb3RvL05hdicpXG4gLCAgIENvbnRlbnQgPSByZXF1aXJlKCcuL3Byb3RvL0NvbnRlbnQnKVxuICwgICBNZWRpYUZpbHRlciA9IHJlcXVpcmUoJy4vcHJvdG8vTWVkaWFGaWx0ZXInKVxuICwgICBTZWFyY2hGaWx0ZXIgPSByZXF1aXJlKCcuL3Byb3RvL1NlYXJjaEZpbHRlcicpXG5cbiAsICAgQWdncmVzc29yID0gcmVxdWlyZSggJy4vcHJvdG8vQWdncmVzc29yJyApXG4gO1xuXG4gQnJvd3NlckxpbWl0LmluaXQoKTtcblxuKGZ1bmN0aW9uKCAkICkge1xuICAgIFxuICAgIC8vICQoIGZ1bmN0aW9uKCkge1xuICAgIC8vICAgICB3aW5kb3cubXlTd2lwZSA9ICQoJyNzd2lwZVdyYXBwZXInKS5Td2lwZSgpLmRhdGEoJ1N3aXBlJyk7XG4gICAgLy8gfSk7XG4gICAgXG4gICAgJChmdW5jdGlvbigpIHtcblxuICAgICAgICBOYXYuaW5pdCgpO1xuICAgICAgICBcbiAgICAgICAgQ29udGVudC5pbml0Q292ZXJVSSgpO1xuICAgICAgICBcbiAgICAgICAgTWVkaWFGaWx0ZXIuaW5pdE1lZGlhTGlzdCgpO1xuICAgICAgICBNZWRpYUZpbHRlci5pbml0Q29udHJ5RmlsdGVyKCk7XG4gICAgICAgIE1lZGlhRmlsdGVyLmluaXRJbml0aWFsU2Nyb2xsKCk7XG4gICAgICAgIE1lZGlhRmlsdGVyLmluaXRPdmVybGF5VG9nZ2xlcigpO1xuICAgICAgICBNZWRpYUZpbHRlci5pbml0U2VsZWN0TWVkaWFCeUxhbmcoKTtcblxuICAgICAgICBTZWFyY2hGaWx0ZXIuaW5pdE92ZXJsYXlUb2dnbGVyKCk7XG5cbiAgICAgICAgaWYgKCQoICcjbWFpbicgKS5oYXNDbGFzcyggJ2xhdGVzdC1tYWluJyApKSBBZ2dyZXNzb3IuZ2V0RmVlZCggJ2xhdGVzdCcgKTtcbiAgICAgICAgZWxzZSBpZiAoJCggJyNtYWluJyApLmhhc0NsYXNzKCAnZmVhdHVyZWQtbWFpbicgKSkgQWdncmVzc29yLmdldEZlZWQoICdmZWF0dXJlZCcgKTtcbiAgICAgICAgZWxzZSBpZiAoJCggJyNtYWluJyApLmhhc0NsYXNzKCAnc3Vic2NyaWJlZC1tYWluJyApKSBBZ2dyZXNzb3IuZ2V0RmVlZCggJ3N1YnNjcmliZWQnICk7XG5cbiAgICAgICAgLy8gJCgnLnNpZGUtbmF2LXRvZ2dsZXInKS5zaWRlTmF2KCk7XG4gICAgfSk7XG5cbn0pKGpRdWVyeSk7IiwidmFyIEltcHVsc29yID0gcmVxdWlyZSggJy4uL0ltcHVsc29yJyApO1xuXG52YXIgQWdncmVzc29yID0ge1xuICAgIGluaXRGaWx0ZXI6IGluaXRGaWx0ZXIsXG4gICAgZ2V0RmVlZDogZ2V0RmVlZCxcbiAgICBzZXRTdWJzY3JpYmU6IHNldFN1YnNjcmliZSxcbiAgICBzZXRGaWx0ZXJCeVNvdXJjZTogc2V0RmlsdGVyQnlTb3VyY2UsXG4gICAgc2V0RmlsdGVyQnlMYW5nOiBzZXRGaWx0ZXJCeUxhbmcsXG4gICAgcmVuZGVyRGF0YTogcmVuZGVyRGF0YSxcbiAgICBoYW5kbGVFcnJvcjogaGFuZGxlRXJyb3IsXG4gICAgcnVuTG9nOiBydW5Mb2dcbn07XG5cbmZ1bmN0aW9uIGdldEZlZWQoIGZlZWRUeXBlLCB2YWwgKSB7XG4gICAgXG4gICAgZmVlZFR5cGUgPSBmZWVkVHlwZSB8fCAnbGF0ZXN0JztcblxuICAgIHZhciBfc2VsZiA9IHRoaXNcbiAgICAsICAgX3BhcmFtcyA9IHtcbiAgICAgICAgICAgIGs6IHZhbFxuICAgICAgICB9XG4gICAgO1xuXG4gICAgJC5hamF4KHtcbiAgICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgICAgdXJsOiBmZWVkVHlwZSArIFwiLmpzb25cIixcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oIGRhdGEgKSB7XG5cbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCBkYXRhWzBdICk7XG5cbiAgICAgICAgICAgICQoJyNtYWluLXByZWxvYWRlcicpLnRvZ2dsZUNsYXNzKCAnaGlkZGVuJyApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSArKyApIHtcbiAgICAgICAgICAgICAgICBfc2VsZi5yZW5kZXJEYXRhKCBmZWVkVHlwZSwgZGF0YVtpXSApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGVycm9yOiBmdW5jdGlvbigganF4aHIsIHRleHRTdGF0dXMsIGVycm9yICkge1xuICAgICAgICAgICAgX3NlbGYuaGFuZGxlRXJyb3IoIGpxeGhyLCB0ZXh0U3RhdHVzLCBlcnJvciApO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHNldFN1YnNjcmliZSggdmFsICkge1xuXG4gICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICQuYWpheCh7XG4gICAgICAgIHVybDogJ2h0dHA6Ly9yZWFkaW5nYnVsYi5jb20vYXBpL3NldF9zdWJzY3JpYmUnLFxuICAgICAgICBkYXRhOiB7IGs6IHZhbCB9LFxuICAgICAgICB0eXBlOiAnR0VUJyxcbiAgICAgICAgZGF0YVR5cGU6ICdqc29ucCcsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCBkYXRhICk7XG4gICAgICAgICAgICBpZiAoZGF0YS5zdGF0dXM9PVwiYWRkZWRcIikgX3NlbGYuZ2V0RmVlZCggJ3N1YnNjcmliZScsIHZhbCApO1xuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24oIGpxeGhyLCB0ZXh0U3RhdHVzLCBlcnJvciApIHtcbiAgICAgICAgICAgIF9zZWxmLmhhbmRsZUVycm9yKCBqcXhociwgdGV4dFN0YXR1cywgZXJyb3IgKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBpbml0RmlsdGVyKCkge1xuICAgIGlmICghJCggJy5tZWRpYS10b2dnbGVyLWxpbmsnICkubGVuZ3RoICkgcmV0dXJuO1xuXG4gICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgIHZhciAkZWxTb3VyY2VUb2dnbGVyID0gJCggJy5tZWRpYS10b2dnbGVyLWxpbmsnICk7XG5cbiAgICAvLyAkKCcjZmlsdGVyVG9nZ2xlcicpLm9uZSgnY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgLy8gICAgIF9zZWxmLnNldEZpbHRlckJ5TGFuZyggJzEnICk7XG4gICAgLy8gfSk7XG5cbiAgICAkZWxTb3VyY2VUb2dnbGVyLmVhY2goXG4gICAgICAgIGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICAgICQodGhpcykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIF9zZWxmLnNldEZpbHRlckJ5U291cmNlKCAkKHRoaXMpLmRhdGEoJ3ZhbCcpICk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICk7XG59XG5cbmZ1bmN0aW9uIHNldEZpbHRlckJ5TGFuZyggdmFsICkge1xuXG4gICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgIHZhciBfcGFyYW1zID0ge1xuICAgICAgICB0eXBlOiAnbGFuZ3VhZ2UnLFxuICAgICAgICB2YWx1ZTogdmFsICsgJydcbiAgICB9O1xuXG4gICAgJC5hamF4KHtcbiAgICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgICAgdXJsOiBcImh0dHA6Ly9yZWFkaW5nYnVsYi5jb20vYXBpL3NldF9maWx0ZXI/dHlwZT1sYW5ndWFnZSZ2YWx1ZT0xXCIsXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbnAnLFxuICAgICAgICBkYXRhOiBfcGFyYW1zLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiggZGF0YSApIHtcbiAgICAgICAgICAgIF9zZWxmLnJ1bkxvZyhkYXRhKTtcbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCBqcXhociwgdGV4dFN0YXR1cywgZXJyb3IgKSB7XG4gICAgICAgICAgICBfc2VsZi5oYW5kbGVFcnJvcigganF4aHIsIHRleHRTdGF0dXMsIGVycm9yICk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gc2V0RmlsdGVyQnlTb3VyY2UoIHZhbCApIHtcblxuICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICB2YXIgX3BhcmFtcyA9IHtcbiAgICAgICAgdHlwZTogJ3NvdXJjZScsXG4gICAgICAgIHZhbHVlOiB2YWxcbiAgICB9O1xuXG4gICAgJC5hamF4KHtcbiAgICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgICAgdXJsOiBcImh0dHA6Ly9yZWFkaW5nYnVsYi5jb20vYXBpL3NldF9maWx0ZXI/dHlwZT1zb3VyY2UmdmFsdWU9MTk4XCIsXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbnAnLFxuICAgICAgICBkYXRhOiAnJyxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oIGRhdGEgKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyggZGF0YVswXSApO1xuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24oIGpxeGhyLCB0ZXh0U3RhdHVzLCBlcnJvciApIHtcbiAgICAgICAgICAgIF9zZWxmLmhhbmRsZUVycm9yKCBqcXhociwgdGV4dFN0YXR1cywgZXJyb3IgKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiByZW5kZXJEYXRhKCBmZWVkVHlwZSwgZGF0YSApIHtcbiAgICBJbXB1bHNvci5jcmVhdGVNYXJrdXAoIGZlZWRUeXBlLCAkKCcjZmVlZHMtb3V0ZXInKSwgZGF0YSApO1xufVxuXG5mdW5jdGlvbiBydW5Mb2coIGRhdGEgKSB7XG4gICAgY29uc29sZS5sb2coIGRhdGEgKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlRXJyb3IoIGpxeGhyLCB0ZXh0U3RhdHVzLCBlcnJvciApIHtcbiAgICBjb25zb2xlLmxvZyhqcXhocik7XG4gICAgY29uc29sZS5sb2codGV4dFN0YXR1cyk7XG4gICAgY29uc29sZS5sb2coZXJyb3IpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEFnZ3Jlc3NvcjsiLCJ2YXIgQnJvd3NlckxpbWl0ID0ge1xuICAgIGluaXQ6IGluaXRcbn07XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG5cbiAgICBpZiAoIU1vZGVybml6ci50b3VjaCkgeyBcbiAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJicm93c2VyLWxpbWl0XCIpO1xuICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCcm93c2VyTGltaXQ7IiwidmFyIENvbnRlbnQgPSB7XG4gICAgaW5pdENvdmVyVUk6IGluaXRDb3ZlclVJXG59O1xuXG5mdW5jdGlvbiBpbml0Q292ZXJVSSgpIHtcbiAgICBpZiAoICEkKCcuY29udGVudC1jb3Zlci1pbWFnZScpLmxlbmd0aCApIHJldHVybjtcblxuICAgIHZhciAkdGFyZ2V0ID0gJCgnLmNvbnRlbnQtY292ZXItaW1hZ2UnKTtcblxuICAgICR0YXJnZXQuZWFjaCggZnVuY3Rpb24oIGkgKSB7XG5cbiAgICAgICAgdmFyIF9zcmMgPSAkKCB0aGlzICkuZGF0YSgnc3JjJyk7XG5cbiAgICAgICAgJCggdGhpcyApLmJhY2tncm91bmQoe1xuICAgICAgICAgICAgc291cmNlOiBfc3JjXG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbnRlbnQ7IiwidmFyIEltcHVsc29yID0ge1xuICAgIGNyZWF0ZU1hcmt1cDogY3JlYXRlTWFya3VwLFxuICAgIHBhcnNlVGltZWFnbzogcGFyc2VUaW1lYWdvXG59O1xuXG5mdW5jdGlvbiBjcmVhdGVNYXJrdXAoIG1vZGVsVHlwZSwgY29udGV4dCwgZGF0YSApIHtcblxuICAgIGlmKCAhJCgnLm1hcmt1cC1tb2RlbCcpLmxlbmd0aCApIHJldHVybjtcblxuICAgIGNvbnRleHQgPSBjb250ZXh0IHx8ICQoJyNmZWVkcy1vdXRlcicpO1xuXG4gICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgIHZhciAkbW0gPSAkKCcuY2FyZC5tYXJrdXAtbW9kZWwnKTtcblxuICAgIGlmICggbW9kZWxUeXBlID09PSAnZmVhdHVyZWQnICkge1xuXG4gICAgICAgICRtbVxuICAgICAgICAgICAgLmNsb25lKClcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnbWFya3VwLW1vZGVsJylcbiAgICAgICAgICAgIC5maW5kKCAnLmNhcmQtaW1hZ2UgaW1nJyApLmF0dHIoICdzcmMnLCBkYXRhLmltYWdlICkuZW5kKClcbiAgICAgICAgICAgIC5maW5kKCAnLmNhcmQtY29udGVudC10aXRsZSBhJyApLmF0dHIoICdocmVmJywgZGF0YS5jb250ZW50X3VybCApLnRleHQoIGRhdGEudGl0bGUgKS5lbmQoKVxuICAgICAgICAgICAgLmZpbmQoICcubWV0YS1mcm9tJyApLnRleHQoIGRhdGEuc291cmNlLm5hbWUgKS5lbmQoKVxuICAgICAgICAgICAgLmZpbmQoICcubWV0YS10aW1lYWdvJyApLnRleHQoIF9zZWxmLnBhcnNlVGltZWFnbyggZGF0YS50aW1lX25ld3MgKSApLmVuZCgpXG4gICAgICAgICAgICAuZmluZCggJy5jYXJkLWNvbnRlbnQtc3VtbWFyeScgKS5odG1sKCBkYXRhLnN1bW1hcnkgKS5lbmQoKVxuICAgICAgICAgICAgLmFwcGVuZFRvKCBjb250ZXh0ICk7XG4gICAgfVxuXG4gICAgZWxzZSBpZiAoIG1vZGVsVHlwZSA9PT0gJ2xhdGVzdCcgKSB7XG5cbiAgICAgICAgJG1tXG4gICAgICAgICAgICAuY2xvbmUoKVxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdtYXJrdXAtbW9kZWwnKVxuICAgICAgICAgICAgLmZpbmQoICcuY2FyZC1jb250ZW50LXRpdGxlIGEnICkuYXR0ciggJ2hyZWYnLCBkYXRhLmNvbnRlbnRfdXJsICkudGV4dCggZGF0YS50aXRsZSApLmVuZCgpXG4gICAgICAgICAgICAuZmluZCggJy5tZXRhLWZyb20nICkudGV4dCggZGF0YS5zb3VyY2UubmFtZSApLmVuZCgpXG4gICAgICAgICAgICAuZmluZCggJy5tZXRhLXRpbWVhZ28nICkudGV4dCggX3NlbGYucGFyc2VUaW1lYWdvKCBkYXRhLnRpbWVfbmV3cyApICkuZW5kKClcbiAgICAgICAgICAgIC5hcHBlbmRUbyggY29udGV4dCApO1xuICAgIH1cblxuICAgIGVsc2UgaWYgKCBtb2RlbFR5cGUgPT09ICdzdWJzY3JpYmVkJyApIHtcblxuICAgICAgICAkbW1cbiAgICAgICAgICAgIC5jbG9uZSgpXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ21hcmt1cC1tb2RlbCcpXG4gICAgICAgICAgICAuZmluZCggJy5jYXJkLWltYWdlIGltZycgKS5hdHRyKCAnc3JjJywgZGF0YS5pbWFnZSApLmVuZCgpXG4gICAgICAgICAgICAuZmluZCggJy5jYXJkLWNvbnRlbnQtdGl0bGUgYScgKS5hdHRyKCAnaHJlZicsIGRhdGEuY29udGVudF91cmwgKS50ZXh0KCBkYXRhLnRpdGxlICkuZW5kKClcbiAgICAgICAgICAgIC5maW5kKCAnLm1ldGEtZnJvbScgKS50ZXh0KCBkYXRhLnNvdXJjZS5uYW1lICkuZW5kKClcbiAgICAgICAgICAgIC5maW5kKCAnLm1ldGEtdGltZWFnbycgKS50ZXh0KCBfc2VsZi5wYXJzZVRpbWVhZ28oIGRhdGEudGltZV9uZXdzICkgKS5lbmQoKVxuICAgICAgICAgICAgLmZpbmQoICcuY2FyZC1jb250ZW50LXN1bW1hcnknICkuaHRtbCggZGF0YS5zdW1tYXJ5ICkuZW5kKClcbiAgICAgICAgICAgIC5hcHBlbmRUbyggY29udGV4dCApO1xuXG4gICAgICAgICAgICAkKCAnLmNhcmQtaW1hZ2UgaW1nJyApLmVhY2goXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oIGkgKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICggJCggdGhpcyApLmF0dHIoICdzcmMnICkgPT09ICcnICkgJCggdGhpcyApLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgfVxuXG59XG5cbmZ1bmN0aW9uIHBhcnNlVGltZWFnbyggbSApIHtcbiAgICByZXR1cm4gbW9tZW50KCBtLCAnWVlZWS1NTS1ERCBISDptbTpzcycgKS5mcm9tTm93KCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gSW1wdWxzb3I7IiwidmFyIE1lZGlhRmlsdGVyID0ge1xuICAgIGluaXRNZWRpYUxpc3Q6IGluaXRNZWRpYUxpc3QsXG4gICAgaW5pdENvbnRyeUZpbHRlcjogaW5pdENvbnRyeUZpbHRlcixcbiAgICBpbml0SW5pdGlhbFNjcm9sbDogaW5pdEluaXRpYWxTY3JvbGwsXG4gICAgaW5pdE92ZXJsYXlUb2dnbGVyOiBpbml0T3ZlcmxheVRvZ2dsZXIsXG4gICAgaW5pdFNlbGVjdE1lZGlhQnlMYW5nOiBpbml0U2VsZWN0TWVkaWFCeUxhbmdcbn07XG5cbmZ1bmN0aW9uIGluaXRPdmVybGF5VG9nZ2xlcigpIHtcbiAgICBpZiAoICEkKCcuZmlsdGVyLW5hdi1vdXRlciAjZmlsdGVyVG9nZ2xlcicpLmxlbmd0aCAmJlxuICAgICAgICAgISQoJy5maWx0ZXItb3V0ZXInKS5sZW5ndGhcbiAgICApIHJldHVybjtcblxuICAgIHZhciAkdG9nZ2xlckluID0gJCgnI2ZpbHRlclRvZ2dsZXInKVxuICAgICwgICAkdG9nZ2xlck91dCA9ICQoJy5maWx0ZXItc3VibWl0LWJ0biwgLmZpbHRlci1vdXRlci1vdmVybGF5JylcbiAgICAsICAgJHRvZ2dsZXJQYXJlbnQgPSAkKCcuZmlsdGVyLW5hdi1pbm5lcicpXG4gICAgLCAgICRlbCA9ICQoJy5maWx0ZXItb3V0ZXInKVxuICAgIDtcblxuICAgICR0b2dnbGVySW4ub24oICdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgJHRvZ2dsZXJQYXJlbnQucmVtb3ZlQ2xhc3MoICdhY3RpdmUnICk7XG5cbiAgICAgICAgaWYgKCAhJGVsLmhhc0NsYXNzKCdhY3RpdmUnKSApXG4gICAgICAgICAgICAkZWwuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICQoJ2JvZHknKS50b2dnbGVDbGFzcygnbm8tc2Nyb2xsJyk7XG4gICAgfSk7XG5cbiAgICAkdG9nZ2xlck91dC5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGlmICggJGVsLmhhc0NsYXNzKCdhY3RpdmUnKSApXG4gICAgICAgICAgICAkZWwucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICQoJ2JvZHknKS50b2dnbGVDbGFzcygnbm8tc2Nyb2xsJyk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGluaXRNZWRpYUxpc3QoKSB7XG4gICAgaWYgKCAhJCgnLm1lZGlhLXRvZ2dsZXItbGluaycpLmxlbmd0aCApIHJldHVybjtcblxuICAgIHZhciAkZWwgPSAkKCcubWVkaWEtdG9nZ2xlci1saW5rJyk7XG5cbiAgICAkZWwuZWFjaChcbiAgICAgICAgZnVuY3Rpb24oaSkge1xuXG4gICAgICAgICAgICB2YXIgJGljb24gPSAkKHRoaXMpLmZpbmQoJy5pY29uJyk7XG5cbiAgICAgICAgICAgICQodGhpcykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgICRpY29uLnRvZ2dsZUNsYXNzKCdmYS1jaGVjaycpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICk7XG59XG5cbmZ1bmN0aW9uIGluaXRDb250cnlGaWx0ZXIoKSB7XG4gICAgaWYgKCAhJCgnLmZpbHRlci1zZWwnKS5sZW5ndGggKSByZXR1cm47XG5cbiAgICAkKCcjZmlsdGVyQnlDb3VudHJ5JylcbiAgICAgICAgLmRyb3Bkb3duKHtcbiAgICAgICAgICAgIG1vYmlsZTogdHJ1ZSxcbiAgICAgICAgICAgIGxhYmVsOiAnU2VsZWN0IENvdW50cnknXG4gICAgICAgIH0pO1xuXG4gICAgJCgnI2ZpbHRlckJ5TGFuZycpXG4gICAgICAgIC5kcm9wZG93bih7XG4gICAgICAgICAgICBtb2JpbGU6IHRydWUsXG4gICAgICAgICAgICBsYWJlbDogJ1NlbGVjdCBMYW5ndWFnZSdcbiAgICAgICAgfSk7XG59XG5cbmZ1bmN0aW9uIGluaXRJbml0aWFsU2Nyb2xsKCkge1xuICAgIGlmICggISQoJy5maWx0ZXItaW5pdGlhbC1vdXRlciAuZmlsdGVyLWluaXRpYWwtbGluaycpLmxlbmd0aCAmJlxuICAgICAgICAgISQoJy5maWx0ZXItbWVkaWEtb3V0ZXIgLm1lZGlhLWdyb3VwJykubGVuZ3RoXG4gICAgKSByZXR1cm47XG5cbiAgICB2YXIgJHRhcmdldHMgPSAkKCcuZmlsdGVyLW1lZGlhLW91dGVyLnNlbGVjdGVkIC5tZWRpYS1ncm91cCcpXG4gICAgLCAgICRpbml0aWFscyA9ICQoJy5maWx0ZXItaW5pdGlhbC1vdXRlciAuZmlsdGVyLWluaXRpYWwtbGluaycpXG4gICAgO1xuXG4gICAgJGluaXRpYWxzLmVhY2goIGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgdmFyICRlbCA9ICQodGhpcylcbiAgICAgICAgLCAgIF9pbml0aWFsID0gJGVsLmRhdGEoJ2luaXRpYWwtbGluaycpXG4gICAgICAgICwgICBUYXJnZXQgPSB7fVxuICAgICAgICA7XG5cbiAgICAgICAgJGVsLm9uKCAnY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIC8vIFNldCB0aGUgZWxlbWVudFxuICAgICAgICAgICAgVGFyZ2V0LiRlbCA9ICR0YXJnZXRzLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oIGkgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJCh0aGlzKS5hdHRyKCdkYXRhLWluaXRpYWwnKSA9PT0gX2luaXRpYWw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAvLyBHZXQgaXRzIG9mZnNldCB0b3BcbiAgICAgICAgICAgIFRhcmdldC50b3AgPSBUYXJnZXQuJGVsLm9mZnNldCgpLnRvcDtcblxuICAgICAgICAgICAgLy8gR2V0IHRoZSBzY3JvbGxUb3Agb2Zmc2V0XG4gICAgICAgICAgICBUYXJnZXQub2Zmc2V0ID0gJCgnLmZpbHRlci1tZWRpYS1vdXRlcicpLm9mZnNldCgpLnRvcCB8fCAwO1xuXG4gICAgICAgICAgICBzY3JvbGxPdXRlciggVGFyZ2V0ICk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gc2Nyb2xsT3V0ZXIoIGRhdGEgKSB7XG5cbiAgICAgICAgZGF0YSA9IGRhdGEgfHwge307XG4gICAgICAgIGRhdGEub2Zmc2V0ID0gZGF0YS5vZmZzZXQgfHwgMDtcbiAgICAgICAgZGF0YS50b3AgPSBkYXRhLnRvcCB8fCAwO1xuXG4gICAgICAgIHZhciB2YWwgPSBkYXRhLnRvcCAtIGRhdGEub2Zmc2V0XG4gICAgICAgICwgICAkb3V0ZXIgPSAkKCcuZmlsdGVyLW1lZGlhLW91dGVyJyk7XG5cbiAgICAgICAgJG91dGVyLmFuaW1hdGUoXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAnKz0nICsgdmFsICsgJydcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnc2xvdydcbiAgICAgICAgKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGluaXRTZWxlY3RNZWRpYUJ5TGFuZygpIHtcbiAgICBpZiAoICEkKCcuZmlsdGVyLXNlbGVjdC1vdXRlciAjZmlsdGVyQnlMYW5nJykubGVuZ3RoICYmXG4gICAgICAgICAhJCgnLmZpbHRlci1tZWRpYS1vdXRlcicpLmxlbmd0aFxuICAgICkgcmV0dXJuO1xuXG4gICAgdmFyICRzZWwgPSAkKCcjZmlsdGVyQnlMYW5nJylcbiAgICAsICAgJHRhcmdldCA9ICQoJy5maWx0ZXItbWVkaWEtb3V0ZXInKVxuICAgIDtcblxuICAgICRzZWwub24oJ2NoYW5nZScsIGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICB2YXIgX3ZhbCA9ICQodGhpcykudmFsKClcblxuICAgICAgICAsICAkX3RhcmdldCA9ICQoJy5maWx0ZXItbWVkaWEtb3V0ZXInKS5maWx0ZXIoXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oIGkgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkKHRoaXMpLmF0dHIoJ2RhdGEtbGFuZycpID09PSBfdmFsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIClcbiAgICAgICAgO1xuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCRfdGFyZ2V0KTtcblxuICAgICAgICAkKCcuZmlsdGVyLW1lZGlhLW91dGVyJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgICAgICRfdGFyZ2V0LmFkZENsYXNzKCdzZWxlY3RlZCcpO1xuICAgIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1lZGlhRmlsdGVyOyIsInZhciBOYXYgPSB7XG4gICAgaW5pdDogaW5pdFxufTtcblxuZnVuY3Rpb24gaW5pdCgpIHtcblxuICAgIGZ1bmN0aW9uIHRvZ2dsZUZpbHRlck5hdigpIHtcbiAgICAgICAgdmFyICRlbCA9ICQoJy5maWx0ZXItbmF2LWlubmVyJyk7XG5cbiAgICAgICAgaWYgKCAkZWwuaGFzQ2xhc3MoJ2FjdGl2ZScpICkge1xuICAgICAgICAgICAgJGVsLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICQoJy5maWx0ZXItbmF2LXRvZ2dsZXInKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAkZWwuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgJCgnLmZpbHRlci1uYXYtdG9nZ2xlcicpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICQoJy5maWx0ZXItbmF2LXRvZ2dsZXInKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgY29uc29sZS5sb2coICQodGhpcykgKTtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHRvZ2dsZUZpbHRlck5hdigpO1xuICAgIH0pO1xuXG4gICAgJCgnLmlzLWhlYWRyb29tIC5uYXZiYXItZml4ZWQgLm1haW4tbmF2LW91dGVyJylcbiAgICAgICAgLmhlYWRyb29tKHtcbiAgICAgICAgICAgIFwib2Zmc2V0XCI6IDgwLFxuICAgICAgICAgICAgXCJ0b2xlcmFuY2VcIjogMyxcbiAgICAgICAgICAgIFwiY2xhc3Nlc1wiOiB7XG4gICAgICAgICAgICAgICAgXCJpbml0aWFsXCI6IFwibmF2YmFyLWFuaW1hdGVkXCIsXG4gICAgICAgICAgICAgICAgXCJwaW5uZWRcIjogXCJuYXZiYXItc2xpZGUtZG93blwiLFxuICAgICAgICAgICAgICAgIFwidW5waW5uZWRcIjogXCJuYXZiYXItc2xpZGUtdXBcIixcbiAgICAgICAgICAgICAgICBcInRvcFwiOiBcIm5hdmJhci1vbi10b3BcIixcbiAgICAgICAgICAgICAgICBcIm5vdFRvcFwiOiBcIm5hdmJhci1ub3QtdG9wXCJcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIFwib25VbnBpblwiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkKCcuZmlsdGVyLW5hdi1pbm5lcicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAkKCcuZmlsdGVyLW5hdi10b2dnbGVyJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBOYXY7IiwidmFyIFNlYXJjaEZpbHRlciA9IHtcbiAgICBpbml0T3ZlcmxheVRvZ2dsZXI6IGluaXRPdmVybGF5VG9nZ2xlclxufTtcblxuZnVuY3Rpb24gaW5pdE92ZXJsYXlUb2dnbGVyKCkge1xuICAgIGlmICggISQoJy5maWx0ZXItbmF2LW91dGVyICNzZWFyY2hUb2dnbGVyJykubGVuZ3RoICYmXG4gICAgICAgICAhJCgnLnNlYXJjaC1vdXRlcicpLmxlbmd0aFxuICAgICkgcmV0dXJuO1xuXG4gICAgdmFyICR0b2dnbGVySW4gPSAkKCcjc2VhcmNoVG9nZ2xlcicpXG4gICAgLCAgICR0b2dnbGVyT3V0ID0gJCgnLnNlYXJjaC1zdWJtaXQtYnRuLCAuc2VhcmNoLW91dGVyLW92ZXJsYXknKVxuICAgICwgICAkdG9nZ2xlclBhcmVudCA9ICQoJy5maWx0ZXItbmF2LWlubmVyJylcbiAgICAsICAgJGVsID0gJCgnLnNlYXJjaC1vdXRlcicpXG4gICAgO1xuXG4gICAgJHRvZ2dsZXJJbi5vbiggJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAkdG9nZ2xlclBhcmVudC5yZW1vdmVDbGFzcyggJ2FjdGl2ZScgKTtcblxuICAgICAgICBpZiAoICEkZWwuaGFzQ2xhc3MoJ2FjdGl2ZScpIClcbiAgICAgICAgICAgICRlbC5hZGRDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgJCgnYm9keScpLnRvZ2dsZUNsYXNzKCduby1zY3JvbGwnKTtcbiAgICB9KTtcblxuICAgICR0b2dnbGVyT3V0Lm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzKTtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgaWYgKCAkZWwuaGFzQ2xhc3MoJ2FjdGl2ZScpIClcbiAgICAgICAgICAgICRlbC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgJCgnYm9keScpLnRvZ2dsZUNsYXNzKCduby1zY3JvbGwnKTtcbiAgICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZWFyY2hGaWx0ZXI7Il19
