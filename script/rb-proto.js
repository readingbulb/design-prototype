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
 ,   SubscribeFilter = require('./proto/SubscribeFilter')

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
        SubscribeFilter.init();

        if ($( '#main' ).hasClass( 'latest-main' )) Aggressor.getFeed( 'latest' );
        else if ($( '#main' ).hasClass( 'featured-main' )) Aggressor.getFeed( 'featured' );
        else if ($( '#main' ).hasClass( 'subscribed-main' )) Aggressor.getFeed( 'subscribed' );

        // $('.side-nav-toggler').sideNav();
    });

})(jQuery);
},{"./proto/Aggressor":2,"./proto/BrowserLimit":3,"./proto/Content":4,"./proto/MediaFilter":6,"./proto/Nav":7,"./proto/SearchFilter":8,"./proto/SubscribeFilter":9}],2:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
var SubscribeFilter = {
    init: init
};

function init() {
    if ( !$('#sfSelected').length ) return;

    var $sfSelected = $('#sfSelected')
    ,   $sfToggler  = $('.sf-toggler')
    ,   $sfInputOuter = $('.sf-input-outer')
    ,   $sfInputRowOuters = $('.sf-input-row-outer')
    ;

    $sfSelected
        .dropdown({
            mobile: true,
            label: 'Add keyword(s)'
        });

    $sfToggler.on('click', function(e) {
        e.preventDefault();
        $sfInputOuter.toggleClass('active');
    });

    var rowN = $sfInputRowOuters.length;

    $sfInputRowOuters.each( function(i) {
        var $row = $(this);

        $(this)
            .find('.sf-input-toggler').on('click', function(e) {

                e.preventDefault();

                var $thisRow = $(this).parent().closest('.sf-input-row-outer');
                console.log($thisRow.attr('data-clone'));

                // if ( $thisRow.val() !== '' ) {
                //     var _inputVal = $(this).prev('.sf-input').val();
                //     var $newRow = $thisRow.clone(true).appendTo( $sfInputOuter );
                //     $newRow.find('.sf-input').val('');
                //     $thisRow.attr('data-clone', false);
                // } else {
                //     $thisRow.remove();
                // }
            })
    });
}

module.exports = SubscribeFilter;
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0L3JiLXByb3RvLmpzIiwic3JjL3NjcmlwdC9wcm90by9BZ2dyZXNzb3IvaW5kZXguanMiLCJzcmMvc2NyaXB0L3Byb3RvL0Jyb3dzZXJMaW1pdC9pbmRleC5qcyIsInNyYy9zY3JpcHQvcHJvdG8vQ29udGVudC9pbmRleC5qcyIsInNyYy9zY3JpcHQvcHJvdG8vSW1wdWxzb3IvaW5kZXguanMiLCJzcmMvc2NyaXB0L3Byb3RvL01lZGlhRmlsdGVyL2luZGV4LmpzIiwic3JjL3NjcmlwdC9wcm90by9OYXYvaW5kZXguanMiLCJzcmMvc2NyaXB0L3Byb3RvL1NlYXJjaEZpbHRlci9pbmRleC5qcyIsInNyYy9zY3JpcHQvcHJvdG8vU3Vic2NyaWJlRmlsdGVyL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9JQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqKlxuICogICAgICAgICAgIF9fICAgIF9fICAgICAgIF9fXyAgICAgICBfXyAgIF9fICAgICAgICAgICAgICAgXG4gKiAgICAgICAgICB8ICB8ICB8ICB8ICAgICAvICAgXFwgICAgIHwgIHwgfCAgfCAgICAgICAgICAgICAgXG4gKiAgICAgICAgICB8ICB8X198ICB8ICAgIC8gIF4gIFxcICAgIHwgIHwgfCAgfCAgICAgICAgICAgICAgXG4gKiAgICAgICAgICB8ICAgX18gICB8ICAgLyAgL19cXCAgXFwgICB8ICB8IHwgIHwgICAgICAgICAgICAgIFxuICogICAgICAgICAgfCAgfCAgfCAgfCAgLyAgX19fX18gIFxcICB8ICB8IHwgIGAtLS0tLiAgICAgICAgIFxuICogICAgICAgICAgfF9ffCAgfF9ffCAvX18vICAgICBcXF9fXFwgfF9ffCB8X19fX19fX3wgICAgICAgICBcbiAqICAgICAgICAgX19fX19fXy4gX18gIC5fX19fX18gICAgIC5fXyAgIF9fLiAgICAgIF9fXyAgICAgIFxuICogICAgICAgIC8gICAgICAgfHwgIHwgfCAgIF8gIFxcICAgIHwgIFxcIHwgIHwgICAgIC8gICBcXCAgICAgXG4gKiAgICAgICB8ICAgKC0tLS1gfCAgfCB8ICB8XykgIHwgICB8ICAgXFx8ICB8ICAgIC8gIF4gIFxcICAgIFxuICogICAgICAgIFxcICAgXFwgICAgfCAgfCB8ICAgICAgLyAgICB8ICAuIGAgIHwgICAvICAvX1xcICBcXCAgIFxuICogICAgLi0tLS0pICAgfCAgIHwgIHwgfCAgfFxcICBcXC0tLS18ICB8XFwgICB8ICAvICBfX19fXyAgXFwgIFxuICogICAgfF9fX19fX18vICAgIHxfX3wgfCBffCBgLl9fX19ffF9ffCBcXF9ffCAvX18vICAgICBcXF9fXFwgXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAqL1xuXG4gdmFyIEJyb3dzZXJMaW1pdCA9IHJlcXVpcmUoJy4vcHJvdG8vQnJvd3NlckxpbWl0JylcbiAsICAgTmF2ID0gcmVxdWlyZSgnLi9wcm90by9OYXYnKVxuICwgICBDb250ZW50ID0gcmVxdWlyZSgnLi9wcm90by9Db250ZW50JylcbiAsICAgTWVkaWFGaWx0ZXIgPSByZXF1aXJlKCcuL3Byb3RvL01lZGlhRmlsdGVyJylcbiAsICAgU2VhcmNoRmlsdGVyID0gcmVxdWlyZSgnLi9wcm90by9TZWFyY2hGaWx0ZXInKVxuICwgICBTdWJzY3JpYmVGaWx0ZXIgPSByZXF1aXJlKCcuL3Byb3RvL1N1YnNjcmliZUZpbHRlcicpXG5cbiAsICAgQWdncmVzc29yID0gcmVxdWlyZSggJy4vcHJvdG8vQWdncmVzc29yJyApXG4gO1xuXG4gQnJvd3NlckxpbWl0LmluaXQoKTtcblxuKGZ1bmN0aW9uKCAkICkge1xuICAgIFxuICAgIC8vICQoIGZ1bmN0aW9uKCkge1xuICAgIC8vICAgICB3aW5kb3cubXlTd2lwZSA9ICQoJyNzd2lwZVdyYXBwZXInKS5Td2lwZSgpLmRhdGEoJ1N3aXBlJyk7XG4gICAgLy8gfSk7XG4gICAgXG4gICAgJChmdW5jdGlvbigpIHtcblxuICAgICAgICBOYXYuaW5pdCgpO1xuICAgICAgICBcbiAgICAgICAgQ29udGVudC5pbml0Q292ZXJVSSgpO1xuICAgICAgICBcbiAgICAgICAgTWVkaWFGaWx0ZXIuaW5pdE1lZGlhTGlzdCgpO1xuICAgICAgICBNZWRpYUZpbHRlci5pbml0Q29udHJ5RmlsdGVyKCk7XG4gICAgICAgIE1lZGlhRmlsdGVyLmluaXRJbml0aWFsU2Nyb2xsKCk7XG4gICAgICAgIE1lZGlhRmlsdGVyLmluaXRPdmVybGF5VG9nZ2xlcigpO1xuICAgICAgICBNZWRpYUZpbHRlci5pbml0U2VsZWN0TWVkaWFCeUxhbmcoKTtcbiAgICAgICAgU2VhcmNoRmlsdGVyLmluaXRPdmVybGF5VG9nZ2xlcigpO1xuICAgICAgICBTdWJzY3JpYmVGaWx0ZXIuaW5pdCgpO1xuXG4gICAgICAgIGlmICgkKCAnI21haW4nICkuaGFzQ2xhc3MoICdsYXRlc3QtbWFpbicgKSkgQWdncmVzc29yLmdldEZlZWQoICdsYXRlc3QnICk7XG4gICAgICAgIGVsc2UgaWYgKCQoICcjbWFpbicgKS5oYXNDbGFzcyggJ2ZlYXR1cmVkLW1haW4nICkpIEFnZ3Jlc3Nvci5nZXRGZWVkKCAnZmVhdHVyZWQnICk7XG4gICAgICAgIGVsc2UgaWYgKCQoICcjbWFpbicgKS5oYXNDbGFzcyggJ3N1YnNjcmliZWQtbWFpbicgKSkgQWdncmVzc29yLmdldEZlZWQoICdzdWJzY3JpYmVkJyApO1xuXG4gICAgICAgIC8vICQoJy5zaWRlLW5hdi10b2dnbGVyJykuc2lkZU5hdigpO1xuICAgIH0pO1xuXG59KShqUXVlcnkpOyIsInZhciBJbXB1bHNvciA9IHJlcXVpcmUoICcuLi9JbXB1bHNvcicgKTtcblxudmFyIEFnZ3Jlc3NvciA9IHtcbiAgICBpbml0RmlsdGVyOiBpbml0RmlsdGVyLFxuICAgIGdldEZlZWQ6IGdldEZlZWQsXG4gICAgc2V0U3Vic2NyaWJlOiBzZXRTdWJzY3JpYmUsXG4gICAgc2V0RmlsdGVyQnlTb3VyY2U6IHNldEZpbHRlckJ5U291cmNlLFxuICAgIHNldEZpbHRlckJ5TGFuZzogc2V0RmlsdGVyQnlMYW5nLFxuICAgIHJlbmRlckRhdGE6IHJlbmRlckRhdGEsXG4gICAgaGFuZGxlRXJyb3I6IGhhbmRsZUVycm9yLFxuICAgIHJ1bkxvZzogcnVuTG9nXG59O1xuXG5mdW5jdGlvbiBnZXRGZWVkKCBmZWVkVHlwZSwgdmFsICkge1xuICAgIFxuICAgIGZlZWRUeXBlID0gZmVlZFR5cGUgfHwgJ2xhdGVzdCc7XG5cbiAgICB2YXIgX3NlbGYgPSB0aGlzXG4gICAgLCAgIF9wYXJhbXMgPSB7XG4gICAgICAgICAgICBrOiB2YWxcbiAgICAgICAgfVxuICAgIDtcblxuICAgICQuYWpheCh7XG4gICAgICAgIHR5cGU6IFwiR0VUXCIsXG4gICAgICAgIHVybDogZmVlZFR5cGUgKyBcIi5qc29uXCIsXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKCBkYXRhICkge1xuXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyggZGF0YVswXSApO1xuXG4gICAgICAgICAgICAkKCcjbWFpbi1wcmVsb2FkZXInKS50b2dnbGVDbGFzcyggJ2hpZGRlbicgKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZm9yICggdmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkgKysgKSB7XG4gICAgICAgICAgICAgICAgX3NlbGYucmVuZGVyRGF0YSggZmVlZFR5cGUsIGRhdGFbaV0gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBlcnJvcjogZnVuY3Rpb24oIGpxeGhyLCB0ZXh0U3RhdHVzLCBlcnJvciApIHtcbiAgICAgICAgICAgIF9zZWxmLmhhbmRsZUVycm9yKCBqcXhociwgdGV4dFN0YXR1cywgZXJyb3IgKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBzZXRTdWJzY3JpYmUoIHZhbCApIHtcblxuICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6ICdodHRwOi8vcmVhZGluZ2J1bGIuY29tL2FwaS9zZXRfc3Vic2NyaWJlJyxcbiAgICAgICAgZGF0YTogeyBrOiB2YWwgfSxcbiAgICAgICAgdHlwZTogJ0dFVCcsXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbnAnLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyggZGF0YSApO1xuICAgICAgICAgICAgaWYgKGRhdGEuc3RhdHVzPT1cImFkZGVkXCIpIF9zZWxmLmdldEZlZWQoICdzdWJzY3JpYmUnLCB2YWwgKTtcbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCBqcXhociwgdGV4dFN0YXR1cywgZXJyb3IgKSB7XG4gICAgICAgICAgICBfc2VsZi5oYW5kbGVFcnJvcigganF4aHIsIHRleHRTdGF0dXMsIGVycm9yICk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gaW5pdEZpbHRlcigpIHtcbiAgICBpZiAoISQoICcubWVkaWEtdG9nZ2xlci1saW5rJyApLmxlbmd0aCApIHJldHVybjtcblxuICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICB2YXIgJGVsU291cmNlVG9nZ2xlciA9ICQoICcubWVkaWEtdG9nZ2xlci1saW5rJyApO1xuXG4gICAgLy8gJCgnI2ZpbHRlclRvZ2dsZXInKS5vbmUoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgIC8vICAgICBfc2VsZi5zZXRGaWx0ZXJCeUxhbmcoICcxJyApO1xuICAgIC8vIH0pO1xuXG4gICAgJGVsU291cmNlVG9nZ2xlci5lYWNoKFxuICAgICAgICBmdW5jdGlvbihpKSB7XG4gICAgICAgICAgICAkKHRoaXMpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBfc2VsZi5zZXRGaWx0ZXJCeVNvdXJjZSggJCh0aGlzKS5kYXRhKCd2YWwnKSApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICApO1xufVxuXG5mdW5jdGlvbiBzZXRGaWx0ZXJCeUxhbmcoIHZhbCApIHtcblxuICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICB2YXIgX3BhcmFtcyA9IHtcbiAgICAgICAgdHlwZTogJ2xhbmd1YWdlJyxcbiAgICAgICAgdmFsdWU6IHZhbCArICcnXG4gICAgfTtcblxuICAgICQuYWpheCh7XG4gICAgICAgIHR5cGU6IFwiR0VUXCIsXG4gICAgICAgIHVybDogXCJodHRwOi8vcmVhZGluZ2J1bGIuY29tL2FwaS9zZXRfZmlsdGVyP3R5cGU9bGFuZ3VhZ2UmdmFsdWU9MVwiLFxuICAgICAgICBkYXRhVHlwZTogJ2pzb25wJyxcbiAgICAgICAgZGF0YTogX3BhcmFtcyxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oIGRhdGEgKSB7XG4gICAgICAgICAgICBfc2VsZi5ydW5Mb2coZGF0YSk7XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yOiBmdW5jdGlvbigganF4aHIsIHRleHRTdGF0dXMsIGVycm9yICkge1xuICAgICAgICAgICAgX3NlbGYuaGFuZGxlRXJyb3IoIGpxeGhyLCB0ZXh0U3RhdHVzLCBlcnJvciApO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHNldEZpbHRlckJ5U291cmNlKCB2YWwgKSB7XG5cbiAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgdmFyIF9wYXJhbXMgPSB7XG4gICAgICAgIHR5cGU6ICdzb3VyY2UnLFxuICAgICAgICB2YWx1ZTogdmFsXG4gICAgfTtcblxuICAgICQuYWpheCh7XG4gICAgICAgIHR5cGU6IFwiR0VUXCIsXG4gICAgICAgIHVybDogXCJodHRwOi8vcmVhZGluZ2J1bGIuY29tL2FwaS9zZXRfZmlsdGVyP3R5cGU9c291cmNlJnZhbHVlPTE5OFwiLFxuICAgICAgICBkYXRhVHlwZTogJ2pzb25wJyxcbiAgICAgICAgZGF0YTogJycsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKCBkYXRhICkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coIGRhdGFbMF0gKTtcbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCBqcXhociwgdGV4dFN0YXR1cywgZXJyb3IgKSB7XG4gICAgICAgICAgICBfc2VsZi5oYW5kbGVFcnJvcigganF4aHIsIHRleHRTdGF0dXMsIGVycm9yICk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gcmVuZGVyRGF0YSggZmVlZFR5cGUsIGRhdGEgKSB7XG4gICAgSW1wdWxzb3IuY3JlYXRlTWFya3VwKCBmZWVkVHlwZSwgJCgnI2ZlZWRzLW91dGVyJyksIGRhdGEgKTtcbn1cblxuZnVuY3Rpb24gcnVuTG9nKCBkYXRhICkge1xuICAgIGNvbnNvbGUubG9nKCBkYXRhICk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUVycm9yKCBqcXhociwgdGV4dFN0YXR1cywgZXJyb3IgKSB7XG4gICAgY29uc29sZS5sb2coanF4aHIpO1xuICAgIGNvbnNvbGUubG9nKHRleHRTdGF0dXMpO1xuICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBZ2dyZXNzb3I7IiwidmFyIEJyb3dzZXJMaW1pdCA9IHtcbiAgICBpbml0OiBpbml0XG59O1xuXG5mdW5jdGlvbiBpbml0KCkge1xuXG4gICAgaWYgKCFNb2Rlcm5penIudG91Y2gpIHsgXG4gICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnJvd3Nlci1saW1pdFwiKTtcbiAgICAgICAgZWwuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQnJvd3NlckxpbWl0OyIsInZhciBDb250ZW50ID0ge1xuICAgIGluaXRDb3ZlclVJOiBpbml0Q292ZXJVSVxufTtcblxuZnVuY3Rpb24gaW5pdENvdmVyVUkoKSB7XG4gICAgaWYgKCAhJCgnLmNvbnRlbnQtY292ZXItaW1hZ2UnKS5sZW5ndGggKSByZXR1cm47XG5cbiAgICB2YXIgJHRhcmdldCA9ICQoJy5jb250ZW50LWNvdmVyLWltYWdlJyk7XG5cbiAgICAkdGFyZ2V0LmVhY2goIGZ1bmN0aW9uKCBpICkge1xuXG4gICAgICAgIHZhciBfc3JjID0gJCggdGhpcyApLmRhdGEoJ3NyYycpO1xuXG4gICAgICAgICQoIHRoaXMgKS5iYWNrZ3JvdW5kKHtcbiAgICAgICAgICAgIHNvdXJjZTogX3NyY1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb250ZW50OyIsInZhciBJbXB1bHNvciA9IHtcbiAgICBjcmVhdGVNYXJrdXA6IGNyZWF0ZU1hcmt1cCxcbiAgICBwYXJzZVRpbWVhZ286IHBhcnNlVGltZWFnb1xufTtcblxuZnVuY3Rpb24gY3JlYXRlTWFya3VwKCBtb2RlbFR5cGUsIGNvbnRleHQsIGRhdGEgKSB7XG5cbiAgICBpZiggISQoJy5tYXJrdXAtbW9kZWwnKS5sZW5ndGggKSByZXR1cm47XG5cbiAgICBjb250ZXh0ID0gY29udGV4dCB8fCAkKCcjZmVlZHMtb3V0ZXInKTtcblxuICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICB2YXIgJG1tID0gJCgnLmNhcmQubWFya3VwLW1vZGVsJyk7XG5cbiAgICBpZiAoIG1vZGVsVHlwZSA9PT0gJ2ZlYXR1cmVkJyApIHtcblxuICAgICAgICAkbW1cbiAgICAgICAgICAgIC5jbG9uZSgpXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ21hcmt1cC1tb2RlbCcpXG4gICAgICAgICAgICAuZmluZCggJy5jYXJkLWltYWdlIGltZycgKS5hdHRyKCAnc3JjJywgZGF0YS5pbWFnZSApLmVuZCgpXG4gICAgICAgICAgICAuZmluZCggJy5jYXJkLWNvbnRlbnQtdGl0bGUgYScgKS5hdHRyKCAnaHJlZicsIGRhdGEuY29udGVudF91cmwgKS50ZXh0KCBkYXRhLnRpdGxlICkuZW5kKClcbiAgICAgICAgICAgIC5maW5kKCAnLm1ldGEtZnJvbScgKS50ZXh0KCBkYXRhLnNvdXJjZS5uYW1lICkuZW5kKClcbiAgICAgICAgICAgIC5maW5kKCAnLm1ldGEtdGltZWFnbycgKS50ZXh0KCBfc2VsZi5wYXJzZVRpbWVhZ28oIGRhdGEudGltZV9uZXdzICkgKS5lbmQoKVxuICAgICAgICAgICAgLmZpbmQoICcuY2FyZC1jb250ZW50LXN1bW1hcnknICkuaHRtbCggZGF0YS5zdW1tYXJ5ICkuZW5kKClcbiAgICAgICAgICAgIC5hcHBlbmRUbyggY29udGV4dCApO1xuICAgIH1cblxuICAgIGVsc2UgaWYgKCBtb2RlbFR5cGUgPT09ICdsYXRlc3QnICkge1xuXG4gICAgICAgICRtbVxuICAgICAgICAgICAgLmNsb25lKClcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnbWFya3VwLW1vZGVsJylcbiAgICAgICAgICAgIC5maW5kKCAnLmNhcmQtY29udGVudC10aXRsZSBhJyApLmF0dHIoICdocmVmJywgZGF0YS5jb250ZW50X3VybCApLnRleHQoIGRhdGEudGl0bGUgKS5lbmQoKVxuICAgICAgICAgICAgLmZpbmQoICcubWV0YS1mcm9tJyApLnRleHQoIGRhdGEuc291cmNlLm5hbWUgKS5lbmQoKVxuICAgICAgICAgICAgLmZpbmQoICcubWV0YS10aW1lYWdvJyApLnRleHQoIF9zZWxmLnBhcnNlVGltZWFnbyggZGF0YS50aW1lX25ld3MgKSApLmVuZCgpXG4gICAgICAgICAgICAuYXBwZW5kVG8oIGNvbnRleHQgKTtcbiAgICB9XG5cbiAgICBlbHNlIGlmICggbW9kZWxUeXBlID09PSAnc3Vic2NyaWJlZCcgKSB7XG5cbiAgICAgICAgJG1tXG4gICAgICAgICAgICAuY2xvbmUoKVxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdtYXJrdXAtbW9kZWwnKVxuICAgICAgICAgICAgLmZpbmQoICcuY2FyZC1pbWFnZSBpbWcnICkuYXR0ciggJ3NyYycsIGRhdGEuaW1hZ2UgKS5lbmQoKVxuICAgICAgICAgICAgLmZpbmQoICcuY2FyZC1jb250ZW50LXRpdGxlIGEnICkuYXR0ciggJ2hyZWYnLCBkYXRhLmNvbnRlbnRfdXJsICkudGV4dCggZGF0YS50aXRsZSApLmVuZCgpXG4gICAgICAgICAgICAuZmluZCggJy5tZXRhLWZyb20nICkudGV4dCggZGF0YS5zb3VyY2UubmFtZSApLmVuZCgpXG4gICAgICAgICAgICAuZmluZCggJy5tZXRhLXRpbWVhZ28nICkudGV4dCggX3NlbGYucGFyc2VUaW1lYWdvKCBkYXRhLnRpbWVfbmV3cyApICkuZW5kKClcbiAgICAgICAgICAgIC5maW5kKCAnLmNhcmQtY29udGVudC1zdW1tYXJ5JyApLmh0bWwoIGRhdGEuc3VtbWFyeSApLmVuZCgpXG4gICAgICAgICAgICAuYXBwZW5kVG8oIGNvbnRleHQgKTtcblxuICAgICAgICAgICAgJCggJy5jYXJkLWltYWdlIGltZycgKS5lYWNoKFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCBpICkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoICQoIHRoaXMgKS5hdHRyKCAnc3JjJyApID09PSAnJyApICQoIHRoaXMgKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgIH1cblxufVxuXG5mdW5jdGlvbiBwYXJzZVRpbWVhZ28oIG0gKSB7XG4gICAgcmV0dXJuIG1vbWVudCggbSwgJ1lZWVktTU0tREQgSEg6bW06c3MnICkuZnJvbU5vdygpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEltcHVsc29yOyIsInZhciBNZWRpYUZpbHRlciA9IHtcbiAgICBpbml0TWVkaWFMaXN0OiBpbml0TWVkaWFMaXN0LFxuICAgIGluaXRDb250cnlGaWx0ZXI6IGluaXRDb250cnlGaWx0ZXIsXG4gICAgaW5pdEluaXRpYWxTY3JvbGw6IGluaXRJbml0aWFsU2Nyb2xsLFxuICAgIGluaXRPdmVybGF5VG9nZ2xlcjogaW5pdE92ZXJsYXlUb2dnbGVyLFxuICAgIGluaXRTZWxlY3RNZWRpYUJ5TGFuZzogaW5pdFNlbGVjdE1lZGlhQnlMYW5nXG59O1xuXG5mdW5jdGlvbiBpbml0T3ZlcmxheVRvZ2dsZXIoKSB7XG4gICAgaWYgKCAhJCgnLmZpbHRlci1uYXYtb3V0ZXIgI2ZpbHRlclRvZ2dsZXInKS5sZW5ndGggJiZcbiAgICAgICAgICEkKCcuZmlsdGVyLW91dGVyJykubGVuZ3RoXG4gICAgKSByZXR1cm47XG5cbiAgICB2YXIgJHRvZ2dsZXJJbiA9ICQoJyNmaWx0ZXJUb2dnbGVyJylcbiAgICAsICAgJHRvZ2dsZXJPdXQgPSAkKCcuZmlsdGVyLXN1Ym1pdC1idG4sIC5maWx0ZXItb3V0ZXItb3ZlcmxheScpXG4gICAgLCAgICR0b2dnbGVyUGFyZW50ID0gJCgnLmZpbHRlci1uYXYtaW5uZXInKVxuICAgICwgICAkZWwgPSAkKCcuZmlsdGVyLW91dGVyJylcbiAgICA7XG5cbiAgICAkdG9nZ2xlckluLm9uKCAnY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICR0b2dnbGVyUGFyZW50LnJlbW92ZUNsYXNzKCAnYWN0aXZlJyApO1xuXG4gICAgICAgIGlmICggISRlbC5oYXNDbGFzcygnYWN0aXZlJykgKVxuICAgICAgICAgICAgJGVsLmFkZENsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgICAkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ25vLXNjcm9sbCcpO1xuICAgIH0pO1xuXG4gICAgJHRvZ2dsZXJPdXQub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBpZiAoICRlbC5oYXNDbGFzcygnYWN0aXZlJykgKVxuICAgICAgICAgICAgJGVsLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgICAkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ25vLXNjcm9sbCcpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBpbml0TWVkaWFMaXN0KCkge1xuICAgIGlmICggISQoJy5tZWRpYS10b2dnbGVyLWxpbmsnKS5sZW5ndGggKSByZXR1cm47XG5cbiAgICB2YXIgJGVsID0gJCgnLm1lZGlhLXRvZ2dsZXItbGluaycpO1xuXG4gICAgJGVsLmVhY2goXG4gICAgICAgIGZ1bmN0aW9uKGkpIHtcblxuICAgICAgICAgICAgdmFyICRpY29uID0gJCh0aGlzKS5maW5kKCcuaWNvbicpO1xuXG4gICAgICAgICAgICAkKHRoaXMpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICAkaWNvbi50b2dnbGVDbGFzcygnZmEtY2hlY2snKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICApO1xufVxuXG5mdW5jdGlvbiBpbml0Q29udHJ5RmlsdGVyKCkge1xuICAgIGlmICggISQoJy5maWx0ZXItc2VsJykubGVuZ3RoICkgcmV0dXJuO1xuXG4gICAgJCgnI2ZpbHRlckJ5Q291bnRyeScpXG4gICAgICAgIC5kcm9wZG93bih7XG4gICAgICAgICAgICBtb2JpbGU6IHRydWUsXG4gICAgICAgICAgICBsYWJlbDogJ1NlbGVjdCBDb3VudHJ5J1xuICAgICAgICB9KTtcblxuICAgICQoJyNmaWx0ZXJCeUxhbmcnKVxuICAgICAgICAuZHJvcGRvd24oe1xuICAgICAgICAgICAgbW9iaWxlOiB0cnVlLFxuICAgICAgICAgICAgbGFiZWw6ICdTZWxlY3QgTGFuZ3VhZ2UnXG4gICAgICAgIH0pO1xufVxuXG5mdW5jdGlvbiBpbml0SW5pdGlhbFNjcm9sbCgpIHtcbiAgICBpZiAoICEkKCcuZmlsdGVyLWluaXRpYWwtb3V0ZXIgLmZpbHRlci1pbml0aWFsLWxpbmsnKS5sZW5ndGggJiZcbiAgICAgICAgICEkKCcuZmlsdGVyLW1lZGlhLW91dGVyIC5tZWRpYS1ncm91cCcpLmxlbmd0aFxuICAgICkgcmV0dXJuO1xuXG4gICAgdmFyICR0YXJnZXRzID0gJCgnLmZpbHRlci1tZWRpYS1vdXRlci5zZWxlY3RlZCAubWVkaWEtZ3JvdXAnKVxuICAgICwgICAkaW5pdGlhbHMgPSAkKCcuZmlsdGVyLWluaXRpYWwtb3V0ZXIgLmZpbHRlci1pbml0aWFsLWxpbmsnKVxuICAgIDtcblxuICAgICRpbml0aWFscy5lYWNoKCBmdW5jdGlvbihpKSB7XG4gICAgICAgIHZhciAkZWwgPSAkKHRoaXMpXG4gICAgICAgICwgICBfaW5pdGlhbCA9ICRlbC5kYXRhKCdpbml0aWFsLWxpbmsnKVxuICAgICAgICAsICAgVGFyZ2V0ID0ge31cbiAgICAgICAgO1xuXG4gICAgICAgICRlbC5vbiggJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAvLyBTZXQgdGhlIGVsZW1lbnRcbiAgICAgICAgICAgIFRhcmdldC4kZWwgPSAkdGFyZ2V0cy5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCBpICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICQodGhpcykuYXR0cignZGF0YS1pbml0aWFsJykgPT09IF9pbml0aWFsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgLy8gR2V0IGl0cyBvZmZzZXQgdG9wXG4gICAgICAgICAgICBUYXJnZXQudG9wID0gVGFyZ2V0LiRlbC5vZmZzZXQoKS50b3A7XG5cbiAgICAgICAgICAgIC8vIEdldCB0aGUgc2Nyb2xsVG9wIG9mZnNldFxuICAgICAgICAgICAgVGFyZ2V0Lm9mZnNldCA9ICQoJy5maWx0ZXItbWVkaWEtb3V0ZXInKS5vZmZzZXQoKS50b3AgfHwgMDtcblxuICAgICAgICAgICAgc2Nyb2xsT3V0ZXIoIFRhcmdldCApO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIHNjcm9sbE91dGVyKCBkYXRhICkge1xuXG4gICAgICAgIGRhdGEgPSBkYXRhIHx8IHt9O1xuICAgICAgICBkYXRhLm9mZnNldCA9IGRhdGEub2Zmc2V0IHx8IDA7XG4gICAgICAgIGRhdGEudG9wID0gZGF0YS50b3AgfHwgMDtcblxuICAgICAgICB2YXIgdmFsID0gZGF0YS50b3AgLSBkYXRhLm9mZnNldFxuICAgICAgICAsICAgJG91dGVyID0gJCgnLmZpbHRlci1tZWRpYS1vdXRlcicpO1xuXG4gICAgICAgICRvdXRlci5hbmltYXRlKFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogJys9JyArIHZhbCArICcnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ3Nsb3cnXG4gICAgICAgICk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBpbml0U2VsZWN0TWVkaWFCeUxhbmcoKSB7XG4gICAgaWYgKCAhJCgnLmZpbHRlci1zZWxlY3Qtb3V0ZXIgI2ZpbHRlckJ5TGFuZycpLmxlbmd0aCAmJlxuICAgICAgICAgISQoJy5maWx0ZXItbWVkaWEtb3V0ZXInKS5sZW5ndGhcbiAgICApIHJldHVybjtcblxuICAgIHZhciAkc2VsID0gJCgnI2ZpbHRlckJ5TGFuZycpXG4gICAgLCAgICR0YXJnZXQgPSAkKCcuZmlsdGVyLW1lZGlhLW91dGVyJylcbiAgICA7XG5cbiAgICAkc2VsLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgdmFyIF92YWwgPSAkKHRoaXMpLnZhbCgpXG5cbiAgICAgICAgLCAgJF90YXJnZXQgPSAkKCcuZmlsdGVyLW1lZGlhLW91dGVyJykuZmlsdGVyKFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCBpICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJCh0aGlzKS5hdHRyKCdkYXRhLWxhbmcnKSA9PT0gX3ZhbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApXG4gICAgICAgIDtcblxuICAgICAgICAvLyBjb25zb2xlLmxvZygkX3RhcmdldCk7XG5cbiAgICAgICAgJCgnLmZpbHRlci1tZWRpYS1vdXRlcicpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuICAgICAgICAkX3RhcmdldC5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNZWRpYUZpbHRlcjsiLCJ2YXIgTmF2ID0ge1xuICAgIGluaXQ6IGluaXRcbn07XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG5cbiAgICBmdW5jdGlvbiB0b2dnbGVGaWx0ZXJOYXYoKSB7XG4gICAgICAgIHZhciAkZWwgPSAkKCcuZmlsdGVyLW5hdi1pbm5lcicpO1xuXG4gICAgICAgIGlmICggJGVsLmhhc0NsYXNzKCdhY3RpdmUnKSApIHtcbiAgICAgICAgICAgICRlbC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAkKCcuZmlsdGVyLW5hdi10b2dnbGVyJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgJGVsLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICQoJy5maWx0ZXItbmF2LXRvZ2dsZXInKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAkKCcuZmlsdGVyLW5hdi10b2dnbGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXG4gICAgICAgIGNvbnNvbGUubG9nKCAkKHRoaXMpICk7XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0b2dnbGVGaWx0ZXJOYXYoKTtcbiAgICB9KTtcblxuICAgICQoJy5pcy1oZWFkcm9vbSAubmF2YmFyLWZpeGVkIC5tYWluLW5hdi1vdXRlcicpXG4gICAgICAgIC5oZWFkcm9vbSh7XG4gICAgICAgICAgICBcIm9mZnNldFwiOiA4MCxcbiAgICAgICAgICAgIFwidG9sZXJhbmNlXCI6IDMsXG4gICAgICAgICAgICBcImNsYXNzZXNcIjoge1xuICAgICAgICAgICAgICAgIFwiaW5pdGlhbFwiOiBcIm5hdmJhci1hbmltYXRlZFwiLFxuICAgICAgICAgICAgICAgIFwicGlubmVkXCI6IFwibmF2YmFyLXNsaWRlLWRvd25cIixcbiAgICAgICAgICAgICAgICBcInVucGlubmVkXCI6IFwibmF2YmFyLXNsaWRlLXVwXCIsXG4gICAgICAgICAgICAgICAgXCJ0b3BcIjogXCJuYXZiYXItb24tdG9wXCIsXG4gICAgICAgICAgICAgICAgXCJub3RUb3BcIjogXCJuYXZiYXItbm90LXRvcFwiXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBcIm9uVW5waW5cIjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJCgnLmZpbHRlci1uYXYtaW5uZXInKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgJCgnLmZpbHRlci1uYXYtdG9nZ2xlcicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTmF2OyIsInZhciBTZWFyY2hGaWx0ZXIgPSB7XG4gICAgaW5pdE92ZXJsYXlUb2dnbGVyOiBpbml0T3ZlcmxheVRvZ2dsZXJcbn07XG5cbmZ1bmN0aW9uIGluaXRPdmVybGF5VG9nZ2xlcigpIHtcbiAgICBpZiAoICEkKCcuZmlsdGVyLW5hdi1vdXRlciAjc2VhcmNoVG9nZ2xlcicpLmxlbmd0aCAmJlxuICAgICAgICAgISQoJy5zZWFyY2gtb3V0ZXInKS5sZW5ndGhcbiAgICApIHJldHVybjtcblxuICAgIHZhciAkdG9nZ2xlckluID0gJCgnI3NlYXJjaFRvZ2dsZXInKVxuICAgICwgICAkdG9nZ2xlck91dCA9ICQoJy5zZWFyY2gtc3VibWl0LWJ0biwgLnNlYXJjaC1vdXRlci1vdmVybGF5JylcbiAgICAsICAgJHRvZ2dsZXJQYXJlbnQgPSAkKCcuZmlsdGVyLW5hdi1pbm5lcicpXG4gICAgLCAgICRlbCA9ICQoJy5zZWFyY2gtb3V0ZXInKVxuICAgIDtcblxuICAgICR0b2dnbGVySW4ub24oICdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgJHRvZ2dsZXJQYXJlbnQucmVtb3ZlQ2xhc3MoICdhY3RpdmUnICk7XG5cbiAgICAgICAgaWYgKCAhJGVsLmhhc0NsYXNzKCdhY3RpdmUnKSApXG4gICAgICAgICAgICAkZWwuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICQoJ2JvZHknKS50b2dnbGVDbGFzcygnbm8tc2Nyb2xsJyk7XG4gICAgfSk7XG5cbiAgICAkdG9nZ2xlck91dC5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgY29uc29sZS5sb2codGhpcyk7XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGlmICggJGVsLmhhc0NsYXNzKCdhY3RpdmUnKSApXG4gICAgICAgICAgICAkZWwucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICQoJ2JvZHknKS50b2dnbGVDbGFzcygnbm8tc2Nyb2xsJyk7XG4gICAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2VhcmNoRmlsdGVyOyIsInZhciBTdWJzY3JpYmVGaWx0ZXIgPSB7XG4gICAgaW5pdDogaW5pdFxufTtcblxuZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBpZiAoICEkKCcjc2ZTZWxlY3RlZCcpLmxlbmd0aCApIHJldHVybjtcblxuICAgIHZhciAkc2ZTZWxlY3RlZCA9ICQoJyNzZlNlbGVjdGVkJylcbiAgICAsICAgJHNmVG9nZ2xlciAgPSAkKCcuc2YtdG9nZ2xlcicpXG4gICAgLCAgICRzZklucHV0T3V0ZXIgPSAkKCcuc2YtaW5wdXQtb3V0ZXInKVxuICAgICwgICAkc2ZJbnB1dFJvd091dGVycyA9ICQoJy5zZi1pbnB1dC1yb3ctb3V0ZXInKVxuICAgIDtcblxuICAgICRzZlNlbGVjdGVkXG4gICAgICAgIC5kcm9wZG93bih7XG4gICAgICAgICAgICBtb2JpbGU6IHRydWUsXG4gICAgICAgICAgICBsYWJlbDogJ0FkZCBrZXl3b3JkKHMpJ1xuICAgICAgICB9KTtcblxuICAgICRzZlRvZ2dsZXIub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICRzZklucHV0T3V0ZXIudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgIH0pO1xuXG4gICAgdmFyIHJvd04gPSAkc2ZJbnB1dFJvd091dGVycy5sZW5ndGg7XG5cbiAgICAkc2ZJbnB1dFJvd091dGVycy5lYWNoKCBmdW5jdGlvbihpKSB7XG4gICAgICAgIHZhciAkcm93ID0gJCh0aGlzKTtcblxuICAgICAgICAkKHRoaXMpXG4gICAgICAgICAgICAuZmluZCgnLnNmLWlucHV0LXRvZ2dsZXInKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICB2YXIgJHRoaXNSb3cgPSAkKHRoaXMpLnBhcmVudCgpLmNsb3Nlc3QoJy5zZi1pbnB1dC1yb3ctb3V0ZXInKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkdGhpc1Jvdy5hdHRyKCdkYXRhLWNsb25lJykpO1xuXG4gICAgICAgICAgICAgICAgLy8gaWYgKCAkdGhpc1Jvdy52YWwoKSAhPT0gJycgKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgIHZhciBfaW5wdXRWYWwgPSAkKHRoaXMpLnByZXYoJy5zZi1pbnB1dCcpLnZhbCgpO1xuICAgICAgICAgICAgICAgIC8vICAgICB2YXIgJG5ld1JvdyA9ICR0aGlzUm93LmNsb25lKHRydWUpLmFwcGVuZFRvKCAkc2ZJbnB1dE91dGVyICk7XG4gICAgICAgICAgICAgICAgLy8gICAgICRuZXdSb3cuZmluZCgnLnNmLWlucHV0JykudmFsKCcnKTtcbiAgICAgICAgICAgICAgICAvLyAgICAgJHRoaXNSb3cuYXR0cignZGF0YS1jbG9uZScsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vICAgICAkdGhpc1Jvdy5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICB9KVxuICAgIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFN1YnNjcmliZUZpbHRlcjsiXX0=
