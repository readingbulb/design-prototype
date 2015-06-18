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
        // var el = document.getElementById("browser-limit");
        // el.classList.add("active");
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
    parseTimeago: parseTimeago,
    truncateBodycopy: truncateBodycopy
};

function truncateBodycopy( $el ) {
    if ( typeof $().dotdotdot() !== 'object' ) return;

    $el.dotdotdot({
        ellipsis: ' ... '
    });
}

function createMarkup( modelType, context, data ) {

    if( !$('.markup-model').length ) return;

    context = context || $('#feeds-outer');

    var _self = this;

    var $mm = $('.card.markup-model');

    if ( modelType === 'featured' ) {

        var $newMm = $mm.clone()
            .removeClass('markup-model')
            .find( '.card-image img' ).attr( 'src', data.image ).end()
            .find( '.card-content-title a' ).attr( 'href', data.content_url ).text( data.title ).end()
            .find( '.meta-source img' ).attr( 'src', data.source.icon_url ).end()
            .find( '.meta-from' ).text( data.source.name ).end()
            .find( '.meta-timeago' ).text( _self.parseTimeago( data.time_news ) ).end()
            .find( '.card-content-summary span' ).html( data.summary ).end()
            .appendTo( context );
    }

    else if ( modelType === 'latest' ) {

        var $newMm = $mm.clone()
            .clone()
            .removeClass('markup-model')
            .find( '.card-content-title a' ).attr( 'href', data.content_url ).text( data.title ).end()
            .find( '.meta-source img' ).attr( 'src', data.source.icon_url ).end()
            .find( '.meta-from' ).text( data.source.name ).end()
            .find( '.meta-timeago' ).text( _self.parseTimeago( data.time_news ) ).end()
            .appendTo( context );
    }

    else if ( modelType === 'subscribed' ) {

        var $newMm = $mm.clone()
            .clone()
            .removeClass('markup-model')
            .find( '.card-image img' ).attr( 'src', data.image ).end()
            .find( '.card-content-title a' ).attr( 'href', data.content_url ).text( data.title ).end()
            .find( '.meta-source img' ).attr( 'src', data.source.icon_url ).end()
            .find( '.meta-from' ).text( data.source.name ).end()
            .find( '.meta-timeago' ).text( _self.parseTimeago( data.time_news ) ).end()
            .find( '.card-content-summary p' ).html( data.summary ).end()
            .appendTo( context );

            $( '.card-image img' ).each(
                function( i ) {
                    if ( $( this ).attr( 'src' ) === '' ) $( this ).remove();
                }
            );
    }

    // Truncations
    var $tobeTruncated = $newMm.find( '.card-content-summary span' );
    if ( $tobeTruncated.height() > 96 ) _self.truncateBodycopy( $tobeTruncated.closest( '.card-content-summary' ) );
    else $tobeTruncated.find( '.readmore' ).remove();

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

    var _onUnpinMainNav = function() {
            $('.filter-nav-inner').removeClass('active');
            $('.filter-nav-toggler').removeClass('active');
        }
    ,   _onUnpinTopbar = function() {
            console.log( 'Unpin', $('.subscribe-filter-outer') );
            $('.subscribe-filter-outer').removeClass('headroom-unpin');
        }
    ,   _onPinTopbar = function() {
            console.log( 'Pin', $('.subscribe-filter-outer') );
            $('.subscribe-filter-outer').addClass('headroom-unpin');
        }

    ,   _headroomOptMainNav = {
            "offset": 80,
            "tolerance": 3,
            "classes": {
                "initial": "navbar-animated",
                "pinned": "navbar-slide-down",
                "unpinned": "navbar-slide-up",
                "top": "navbar-on-top",
                "notTop": "navbar-not-top"
            },
            "onUnpin": _onUnpinMainNav
        },

        _headroomOptTopbar = {
            "offset": 80,
            "tolerance": 3,
            "classes": {
                "initial": "topbar-animated",
                "pinned": "topbar-slide-up",
                "unpinned": "topbar-slide-down",
                "top": "topbar-on-top",
                "notTop": "topbar-not-top"
            },
            "onPin": _onUnpinTopbar,
            "onUnpin": _onPinTopbar
        };

    $('.is-headroom .navbar-fixed')
        .find('.main-nav-outer')
        .headroom( _headroomOptMainNav ).end()
        .find('.topbar-outer')
        .headroom( _headroomOptTopbar ).end()
        ;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0L3JiLXByb3RvLmpzIiwic3JjL3NjcmlwdC9wcm90by9BZ2dyZXNzb3IvaW5kZXguanMiLCJzcmMvc2NyaXB0L3Byb3RvL0Jyb3dzZXJMaW1pdC9pbmRleC5qcyIsInNyYy9zY3JpcHQvcHJvdG8vQ29udGVudC9pbmRleC5qcyIsInNyYy9zY3JpcHQvcHJvdG8vSW1wdWxzb3IvaW5kZXguanMiLCJzcmMvc2NyaXB0L3Byb3RvL01lZGlhRmlsdGVyL2luZGV4LmpzIiwic3JjL3NjcmlwdC9wcm90by9OYXYvaW5kZXguanMiLCJzcmMvc2NyaXB0L3Byb3RvL1NlYXJjaEZpbHRlci9pbmRleC5qcyIsInNyYy9zY3JpcHQvcHJvdG8vU3Vic2NyaWJlRmlsdGVyL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9JQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqKlxuICogICAgICAgICAgIF9fICAgIF9fICAgICAgIF9fXyAgICAgICBfXyAgIF9fICAgICAgICAgICAgICAgXG4gKiAgICAgICAgICB8ICB8ICB8ICB8ICAgICAvICAgXFwgICAgIHwgIHwgfCAgfCAgICAgICAgICAgICAgXG4gKiAgICAgICAgICB8ICB8X198ICB8ICAgIC8gIF4gIFxcICAgIHwgIHwgfCAgfCAgICAgICAgICAgICAgXG4gKiAgICAgICAgICB8ICAgX18gICB8ICAgLyAgL19cXCAgXFwgICB8ICB8IHwgIHwgICAgICAgICAgICAgIFxuICogICAgICAgICAgfCAgfCAgfCAgfCAgLyAgX19fX18gIFxcICB8ICB8IHwgIGAtLS0tLiAgICAgICAgIFxuICogICAgICAgICAgfF9ffCAgfF9ffCAvX18vICAgICBcXF9fXFwgfF9ffCB8X19fX19fX3wgICAgICAgICBcbiAqICAgICAgICAgX19fX19fXy4gX18gIC5fX19fX18gICAgIC5fXyAgIF9fLiAgICAgIF9fXyAgICAgIFxuICogICAgICAgIC8gICAgICAgfHwgIHwgfCAgIF8gIFxcICAgIHwgIFxcIHwgIHwgICAgIC8gICBcXCAgICAgXG4gKiAgICAgICB8ICAgKC0tLS1gfCAgfCB8ICB8XykgIHwgICB8ICAgXFx8ICB8ICAgIC8gIF4gIFxcICAgIFxuICogICAgICAgIFxcICAgXFwgICAgfCAgfCB8ICAgICAgLyAgICB8ICAuIGAgIHwgICAvICAvX1xcICBcXCAgIFxuICogICAgLi0tLS0pICAgfCAgIHwgIHwgfCAgfFxcICBcXC0tLS18ICB8XFwgICB8ICAvICBfX19fXyAgXFwgIFxuICogICAgfF9fX19fX18vICAgIHxfX3wgfCBffCBgLl9fX19ffF9ffCBcXF9ffCAvX18vICAgICBcXF9fXFwgXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAqL1xuXG4gdmFyIEJyb3dzZXJMaW1pdCA9IHJlcXVpcmUoJy4vcHJvdG8vQnJvd3NlckxpbWl0JylcbiAsICAgTmF2ID0gcmVxdWlyZSgnLi9wcm90by9OYXYnKVxuICwgICBDb250ZW50ID0gcmVxdWlyZSgnLi9wcm90by9Db250ZW50JylcbiAsICAgTWVkaWFGaWx0ZXIgPSByZXF1aXJlKCcuL3Byb3RvL01lZGlhRmlsdGVyJylcbiAsICAgU2VhcmNoRmlsdGVyID0gcmVxdWlyZSgnLi9wcm90by9TZWFyY2hGaWx0ZXInKVxuICwgICBTdWJzY3JpYmVGaWx0ZXIgPSByZXF1aXJlKCcuL3Byb3RvL1N1YnNjcmliZUZpbHRlcicpXG5cbiAsICAgQWdncmVzc29yID0gcmVxdWlyZSggJy4vcHJvdG8vQWdncmVzc29yJyApXG4gO1xuXG4gQnJvd3NlckxpbWl0LmluaXQoKTtcblxuKGZ1bmN0aW9uKCAkICkge1xuICAgIFxuICAgIC8vICQoIGZ1bmN0aW9uKCkge1xuICAgIC8vICAgICB3aW5kb3cubXlTd2lwZSA9ICQoJyNzd2lwZVdyYXBwZXInKS5Td2lwZSgpLmRhdGEoJ1N3aXBlJyk7XG4gICAgLy8gfSk7XG4gICAgXG4gICAgJChmdW5jdGlvbigpIHtcblxuICAgICAgICBOYXYuaW5pdCgpO1xuICAgICAgICBcbiAgICAgICAgQ29udGVudC5pbml0Q292ZXJVSSgpO1xuICAgICAgICBcbiAgICAgICAgTWVkaWFGaWx0ZXIuaW5pdE1lZGlhTGlzdCgpO1xuICAgICAgICBNZWRpYUZpbHRlci5pbml0Q29udHJ5RmlsdGVyKCk7XG4gICAgICAgIE1lZGlhRmlsdGVyLmluaXRJbml0aWFsU2Nyb2xsKCk7XG4gICAgICAgIE1lZGlhRmlsdGVyLmluaXRPdmVybGF5VG9nZ2xlcigpO1xuICAgICAgICBNZWRpYUZpbHRlci5pbml0U2VsZWN0TWVkaWFCeUxhbmcoKTtcbiAgICAgICAgU2VhcmNoRmlsdGVyLmluaXRPdmVybGF5VG9nZ2xlcigpO1xuICAgICAgICBTdWJzY3JpYmVGaWx0ZXIuaW5pdCgpO1xuXG4gICAgICAgIGlmICgkKCAnI21haW4nICkuaGFzQ2xhc3MoICdsYXRlc3QtbWFpbicgKSkgQWdncmVzc29yLmdldEZlZWQoICdsYXRlc3QnICk7XG4gICAgICAgIGVsc2UgaWYgKCQoICcjbWFpbicgKS5oYXNDbGFzcyggJ2ZlYXR1cmVkLW1haW4nICkpIEFnZ3Jlc3Nvci5nZXRGZWVkKCAnZmVhdHVyZWQnICk7XG4gICAgICAgIGVsc2UgaWYgKCQoICcjbWFpbicgKS5oYXNDbGFzcyggJ3N1YnNjcmliZWQtbWFpbicgKSkgQWdncmVzc29yLmdldEZlZWQoICdzdWJzY3JpYmVkJyApO1xuXG4gICAgICAgIC8vICQoJy5zaWRlLW5hdi10b2dnbGVyJykuc2lkZU5hdigpO1xuICAgIH0pO1xuXG59KShqUXVlcnkpOyIsInZhciBJbXB1bHNvciA9IHJlcXVpcmUoICcuLi9JbXB1bHNvcicgKTtcblxudmFyIEFnZ3Jlc3NvciA9IHtcbiAgICBpbml0RmlsdGVyOiBpbml0RmlsdGVyLFxuICAgIGdldEZlZWQ6IGdldEZlZWQsXG4gICAgc2V0U3Vic2NyaWJlOiBzZXRTdWJzY3JpYmUsXG4gICAgc2V0RmlsdGVyQnlTb3VyY2U6IHNldEZpbHRlckJ5U291cmNlLFxuICAgIHNldEZpbHRlckJ5TGFuZzogc2V0RmlsdGVyQnlMYW5nLFxuICAgIHJlbmRlckRhdGE6IHJlbmRlckRhdGEsXG4gICAgaGFuZGxlRXJyb3I6IGhhbmRsZUVycm9yLFxuICAgIHJ1bkxvZzogcnVuTG9nXG59O1xuXG5mdW5jdGlvbiBnZXRGZWVkKCBmZWVkVHlwZSwgdmFsICkge1xuICAgIFxuICAgIGZlZWRUeXBlID0gZmVlZFR5cGUgfHwgJ2xhdGVzdCc7XG5cbiAgICB2YXIgX3NlbGYgPSB0aGlzXG4gICAgLCAgIF9wYXJhbXMgPSB7XG4gICAgICAgICAgICBrOiB2YWxcbiAgICAgICAgfVxuICAgIDtcblxuICAgICQuYWpheCh7XG4gICAgICAgIHR5cGU6IFwiR0VUXCIsXG4gICAgICAgIHVybDogZmVlZFR5cGUgKyBcIi5qc29uXCIsXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKCBkYXRhICkge1xuXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyggZGF0YVswXSApO1xuXG4gICAgICAgICAgICAkKCcjbWFpbi1wcmVsb2FkZXInKS50b2dnbGVDbGFzcyggJ2hpZGRlbicgKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZm9yICggdmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkgKysgKSB7XG4gICAgICAgICAgICAgICAgX3NlbGYucmVuZGVyRGF0YSggZmVlZFR5cGUsIGRhdGFbaV0gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBlcnJvcjogZnVuY3Rpb24oIGpxeGhyLCB0ZXh0U3RhdHVzLCBlcnJvciApIHtcbiAgICAgICAgICAgIF9zZWxmLmhhbmRsZUVycm9yKCBqcXhociwgdGV4dFN0YXR1cywgZXJyb3IgKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBzZXRTdWJzY3JpYmUoIHZhbCApIHtcblxuICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6ICdodHRwOi8vcmVhZGluZ2J1bGIuY29tL2FwaS9zZXRfc3Vic2NyaWJlJyxcbiAgICAgICAgZGF0YTogeyBrOiB2YWwgfSxcbiAgICAgICAgdHlwZTogJ0dFVCcsXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbnAnLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyggZGF0YSApO1xuICAgICAgICAgICAgaWYgKGRhdGEuc3RhdHVzPT1cImFkZGVkXCIpIF9zZWxmLmdldEZlZWQoICdzdWJzY3JpYmUnLCB2YWwgKTtcbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCBqcXhociwgdGV4dFN0YXR1cywgZXJyb3IgKSB7XG4gICAgICAgICAgICBfc2VsZi5oYW5kbGVFcnJvcigganF4aHIsIHRleHRTdGF0dXMsIGVycm9yICk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gaW5pdEZpbHRlcigpIHtcbiAgICBpZiAoISQoICcubWVkaWEtdG9nZ2xlci1saW5rJyApLmxlbmd0aCApIHJldHVybjtcblxuICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICB2YXIgJGVsU291cmNlVG9nZ2xlciA9ICQoICcubWVkaWEtdG9nZ2xlci1saW5rJyApO1xuXG4gICAgLy8gJCgnI2ZpbHRlclRvZ2dsZXInKS5vbmUoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgIC8vICAgICBfc2VsZi5zZXRGaWx0ZXJCeUxhbmcoICcxJyApO1xuICAgIC8vIH0pO1xuXG4gICAgJGVsU291cmNlVG9nZ2xlci5lYWNoKFxuICAgICAgICBmdW5jdGlvbihpKSB7XG4gICAgICAgICAgICAkKHRoaXMpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBfc2VsZi5zZXRGaWx0ZXJCeVNvdXJjZSggJCh0aGlzKS5kYXRhKCd2YWwnKSApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICApO1xufVxuXG5mdW5jdGlvbiBzZXRGaWx0ZXJCeUxhbmcoIHZhbCApIHtcblxuICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICB2YXIgX3BhcmFtcyA9IHtcbiAgICAgICAgdHlwZTogJ2xhbmd1YWdlJyxcbiAgICAgICAgdmFsdWU6IHZhbCArICcnXG4gICAgfTtcblxuICAgICQuYWpheCh7XG4gICAgICAgIHR5cGU6IFwiR0VUXCIsXG4gICAgICAgIHVybDogXCJodHRwOi8vcmVhZGluZ2J1bGIuY29tL2FwaS9zZXRfZmlsdGVyP3R5cGU9bGFuZ3VhZ2UmdmFsdWU9MVwiLFxuICAgICAgICBkYXRhVHlwZTogJ2pzb25wJyxcbiAgICAgICAgZGF0YTogX3BhcmFtcyxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oIGRhdGEgKSB7XG4gICAgICAgICAgICBfc2VsZi5ydW5Mb2coZGF0YSk7XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yOiBmdW5jdGlvbigganF4aHIsIHRleHRTdGF0dXMsIGVycm9yICkge1xuICAgICAgICAgICAgX3NlbGYuaGFuZGxlRXJyb3IoIGpxeGhyLCB0ZXh0U3RhdHVzLCBlcnJvciApO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHNldEZpbHRlckJ5U291cmNlKCB2YWwgKSB7XG5cbiAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgdmFyIF9wYXJhbXMgPSB7XG4gICAgICAgIHR5cGU6ICdzb3VyY2UnLFxuICAgICAgICB2YWx1ZTogdmFsXG4gICAgfTtcblxuICAgICQuYWpheCh7XG4gICAgICAgIHR5cGU6IFwiR0VUXCIsXG4gICAgICAgIHVybDogXCJodHRwOi8vcmVhZGluZ2J1bGIuY29tL2FwaS9zZXRfZmlsdGVyP3R5cGU9c291cmNlJnZhbHVlPTE5OFwiLFxuICAgICAgICBkYXRhVHlwZTogJ2pzb25wJyxcbiAgICAgICAgZGF0YTogJycsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKCBkYXRhICkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coIGRhdGFbMF0gKTtcbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCBqcXhociwgdGV4dFN0YXR1cywgZXJyb3IgKSB7XG4gICAgICAgICAgICBfc2VsZi5oYW5kbGVFcnJvcigganF4aHIsIHRleHRTdGF0dXMsIGVycm9yICk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gcmVuZGVyRGF0YSggZmVlZFR5cGUsIGRhdGEgKSB7XG4gICAgSW1wdWxzb3IuY3JlYXRlTWFya3VwKCBmZWVkVHlwZSwgJCgnI2ZlZWRzLW91dGVyJyksIGRhdGEgKTtcbn1cblxuZnVuY3Rpb24gcnVuTG9nKCBkYXRhICkge1xuICAgIGNvbnNvbGUubG9nKCBkYXRhICk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUVycm9yKCBqcXhociwgdGV4dFN0YXR1cywgZXJyb3IgKSB7XG4gICAgY29uc29sZS5sb2coanF4aHIpO1xuICAgIGNvbnNvbGUubG9nKHRleHRTdGF0dXMpO1xuICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBZ2dyZXNzb3I7IiwidmFyIEJyb3dzZXJMaW1pdCA9IHtcbiAgICBpbml0OiBpbml0XG59O1xuXG5mdW5jdGlvbiBpbml0KCkge1xuXG4gICAgaWYgKCFNb2Rlcm5penIudG91Y2gpIHsgXG4gICAgICAgIC8vIHZhciBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnJvd3Nlci1saW1pdFwiKTtcbiAgICAgICAgLy8gZWwuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQnJvd3NlckxpbWl0OyIsInZhciBDb250ZW50ID0ge1xuICAgIGluaXRDb3ZlclVJOiBpbml0Q292ZXJVSVxufTtcblxuZnVuY3Rpb24gaW5pdENvdmVyVUkoKSB7XG4gICAgaWYgKCAhJCgnLmNvbnRlbnQtY292ZXItaW1hZ2UnKS5sZW5ndGggKSByZXR1cm47XG5cbiAgICB2YXIgJHRhcmdldCA9ICQoJy5jb250ZW50LWNvdmVyLWltYWdlJyk7XG5cbiAgICAkdGFyZ2V0LmVhY2goIGZ1bmN0aW9uKCBpICkge1xuXG4gICAgICAgIHZhciBfc3JjID0gJCggdGhpcyApLmRhdGEoJ3NyYycpO1xuXG4gICAgICAgICQoIHRoaXMgKS5iYWNrZ3JvdW5kKHtcbiAgICAgICAgICAgIHNvdXJjZTogX3NyY1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb250ZW50OyIsInZhciBJbXB1bHNvciA9IHtcbiAgICBjcmVhdGVNYXJrdXA6IGNyZWF0ZU1hcmt1cCxcbiAgICBwYXJzZVRpbWVhZ286IHBhcnNlVGltZWFnbyxcbiAgICB0cnVuY2F0ZUJvZHljb3B5OiB0cnVuY2F0ZUJvZHljb3B5XG59O1xuXG5mdW5jdGlvbiB0cnVuY2F0ZUJvZHljb3B5KCAkZWwgKSB7XG4gICAgaWYgKCB0eXBlb2YgJCgpLmRvdGRvdGRvdCgpICE9PSAnb2JqZWN0JyApIHJldHVybjtcblxuICAgICRlbC5kb3Rkb3Rkb3Qoe1xuICAgICAgICBlbGxpcHNpczogJyAuLi4gJ1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVNYXJrdXAoIG1vZGVsVHlwZSwgY29udGV4dCwgZGF0YSApIHtcblxuICAgIGlmKCAhJCgnLm1hcmt1cC1tb2RlbCcpLmxlbmd0aCApIHJldHVybjtcblxuICAgIGNvbnRleHQgPSBjb250ZXh0IHx8ICQoJyNmZWVkcy1vdXRlcicpO1xuXG4gICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgIHZhciAkbW0gPSAkKCcuY2FyZC5tYXJrdXAtbW9kZWwnKTtcblxuICAgIGlmICggbW9kZWxUeXBlID09PSAnZmVhdHVyZWQnICkge1xuXG4gICAgICAgIHZhciAkbmV3TW0gPSAkbW0uY2xvbmUoKVxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdtYXJrdXAtbW9kZWwnKVxuICAgICAgICAgICAgLmZpbmQoICcuY2FyZC1pbWFnZSBpbWcnICkuYXR0ciggJ3NyYycsIGRhdGEuaW1hZ2UgKS5lbmQoKVxuICAgICAgICAgICAgLmZpbmQoICcuY2FyZC1jb250ZW50LXRpdGxlIGEnICkuYXR0ciggJ2hyZWYnLCBkYXRhLmNvbnRlbnRfdXJsICkudGV4dCggZGF0YS50aXRsZSApLmVuZCgpXG4gICAgICAgICAgICAuZmluZCggJy5tZXRhLXNvdXJjZSBpbWcnICkuYXR0ciggJ3NyYycsIGRhdGEuc291cmNlLmljb25fdXJsICkuZW5kKClcbiAgICAgICAgICAgIC5maW5kKCAnLm1ldGEtZnJvbScgKS50ZXh0KCBkYXRhLnNvdXJjZS5uYW1lICkuZW5kKClcbiAgICAgICAgICAgIC5maW5kKCAnLm1ldGEtdGltZWFnbycgKS50ZXh0KCBfc2VsZi5wYXJzZVRpbWVhZ28oIGRhdGEudGltZV9uZXdzICkgKS5lbmQoKVxuICAgICAgICAgICAgLmZpbmQoICcuY2FyZC1jb250ZW50LXN1bW1hcnkgc3BhbicgKS5odG1sKCBkYXRhLnN1bW1hcnkgKS5lbmQoKVxuICAgICAgICAgICAgLmFwcGVuZFRvKCBjb250ZXh0ICk7XG4gICAgfVxuXG4gICAgZWxzZSBpZiAoIG1vZGVsVHlwZSA9PT0gJ2xhdGVzdCcgKSB7XG5cbiAgICAgICAgdmFyICRuZXdNbSA9ICRtbS5jbG9uZSgpXG4gICAgICAgICAgICAuY2xvbmUoKVxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdtYXJrdXAtbW9kZWwnKVxuICAgICAgICAgICAgLmZpbmQoICcuY2FyZC1jb250ZW50LXRpdGxlIGEnICkuYXR0ciggJ2hyZWYnLCBkYXRhLmNvbnRlbnRfdXJsICkudGV4dCggZGF0YS50aXRsZSApLmVuZCgpXG4gICAgICAgICAgICAuZmluZCggJy5tZXRhLXNvdXJjZSBpbWcnICkuYXR0ciggJ3NyYycsIGRhdGEuc291cmNlLmljb25fdXJsICkuZW5kKClcbiAgICAgICAgICAgIC5maW5kKCAnLm1ldGEtZnJvbScgKS50ZXh0KCBkYXRhLnNvdXJjZS5uYW1lICkuZW5kKClcbiAgICAgICAgICAgIC5maW5kKCAnLm1ldGEtdGltZWFnbycgKS50ZXh0KCBfc2VsZi5wYXJzZVRpbWVhZ28oIGRhdGEudGltZV9uZXdzICkgKS5lbmQoKVxuICAgICAgICAgICAgLmFwcGVuZFRvKCBjb250ZXh0ICk7XG4gICAgfVxuXG4gICAgZWxzZSBpZiAoIG1vZGVsVHlwZSA9PT0gJ3N1YnNjcmliZWQnICkge1xuXG4gICAgICAgIHZhciAkbmV3TW0gPSAkbW0uY2xvbmUoKVxuICAgICAgICAgICAgLmNsb25lKClcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnbWFya3VwLW1vZGVsJylcbiAgICAgICAgICAgIC5maW5kKCAnLmNhcmQtaW1hZ2UgaW1nJyApLmF0dHIoICdzcmMnLCBkYXRhLmltYWdlICkuZW5kKClcbiAgICAgICAgICAgIC5maW5kKCAnLmNhcmQtY29udGVudC10aXRsZSBhJyApLmF0dHIoICdocmVmJywgZGF0YS5jb250ZW50X3VybCApLnRleHQoIGRhdGEudGl0bGUgKS5lbmQoKVxuICAgICAgICAgICAgLmZpbmQoICcubWV0YS1zb3VyY2UgaW1nJyApLmF0dHIoICdzcmMnLCBkYXRhLnNvdXJjZS5pY29uX3VybCApLmVuZCgpXG4gICAgICAgICAgICAuZmluZCggJy5tZXRhLWZyb20nICkudGV4dCggZGF0YS5zb3VyY2UubmFtZSApLmVuZCgpXG4gICAgICAgICAgICAuZmluZCggJy5tZXRhLXRpbWVhZ28nICkudGV4dCggX3NlbGYucGFyc2VUaW1lYWdvKCBkYXRhLnRpbWVfbmV3cyApICkuZW5kKClcbiAgICAgICAgICAgIC5maW5kKCAnLmNhcmQtY29udGVudC1zdW1tYXJ5IHAnICkuaHRtbCggZGF0YS5zdW1tYXJ5ICkuZW5kKClcbiAgICAgICAgICAgIC5hcHBlbmRUbyggY29udGV4dCApO1xuXG4gICAgICAgICAgICAkKCAnLmNhcmQtaW1hZ2UgaW1nJyApLmVhY2goXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oIGkgKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICggJCggdGhpcyApLmF0dHIoICdzcmMnICkgPT09ICcnICkgJCggdGhpcyApLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gVHJ1bmNhdGlvbnNcbiAgICB2YXIgJHRvYmVUcnVuY2F0ZWQgPSAkbmV3TW0uZmluZCggJy5jYXJkLWNvbnRlbnQtc3VtbWFyeSBzcGFuJyApO1xuICAgIGlmICggJHRvYmVUcnVuY2F0ZWQuaGVpZ2h0KCkgPiA5NiApIF9zZWxmLnRydW5jYXRlQm9keWNvcHkoICR0b2JlVHJ1bmNhdGVkLmNsb3Nlc3QoICcuY2FyZC1jb250ZW50LXN1bW1hcnknICkgKTtcbiAgICBlbHNlICR0b2JlVHJ1bmNhdGVkLmZpbmQoICcucmVhZG1vcmUnICkucmVtb3ZlKCk7XG5cbn1cblxuZnVuY3Rpb24gcGFyc2VUaW1lYWdvKCBtICkge1xuICAgIHJldHVybiBtb21lbnQoIG0sICdZWVlZLU1NLUREIEhIOm1tOnNzJyApLmZyb21Ob3coKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBJbXB1bHNvcjsiLCJ2YXIgTWVkaWFGaWx0ZXIgPSB7XG4gICAgaW5pdE1lZGlhTGlzdDogaW5pdE1lZGlhTGlzdCxcbiAgICBpbml0Q29udHJ5RmlsdGVyOiBpbml0Q29udHJ5RmlsdGVyLFxuICAgIGluaXRJbml0aWFsU2Nyb2xsOiBpbml0SW5pdGlhbFNjcm9sbCxcbiAgICBpbml0T3ZlcmxheVRvZ2dsZXI6IGluaXRPdmVybGF5VG9nZ2xlcixcbiAgICBpbml0U2VsZWN0TWVkaWFCeUxhbmc6IGluaXRTZWxlY3RNZWRpYUJ5TGFuZ1xufTtcblxuZnVuY3Rpb24gaW5pdE92ZXJsYXlUb2dnbGVyKCkge1xuICAgIGlmICggISQoJy5maWx0ZXItbmF2LW91dGVyICNmaWx0ZXJUb2dnbGVyJykubGVuZ3RoICYmXG4gICAgICAgICAhJCgnLmZpbHRlci1vdXRlcicpLmxlbmd0aFxuICAgICkgcmV0dXJuO1xuXG4gICAgdmFyICR0b2dnbGVySW4gPSAkKCcjZmlsdGVyVG9nZ2xlcicpXG4gICAgLCAgICR0b2dnbGVyT3V0ID0gJCgnLmZpbHRlci1zdWJtaXQtYnRuLCAuZmlsdGVyLW91dGVyLW92ZXJsYXknKVxuICAgICwgICAkdG9nZ2xlclBhcmVudCA9ICQoJy5maWx0ZXItbmF2LWlubmVyJylcbiAgICAsICAgJGVsID0gJCgnLmZpbHRlci1vdXRlcicpXG4gICAgO1xuXG4gICAgJHRvZ2dsZXJJbi5vbiggJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAkdG9nZ2xlclBhcmVudC5yZW1vdmVDbGFzcyggJ2FjdGl2ZScgKTtcblxuICAgICAgICBpZiAoICEkZWwuaGFzQ2xhc3MoJ2FjdGl2ZScpIClcbiAgICAgICAgICAgICRlbC5hZGRDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgJCgnYm9keScpLnRvZ2dsZUNsYXNzKCduby1zY3JvbGwnKTtcbiAgICB9KTtcblxuICAgICR0b2dnbGVyT3V0Lm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgaWYgKCAkZWwuaGFzQ2xhc3MoJ2FjdGl2ZScpIClcbiAgICAgICAgICAgICRlbC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgJCgnYm9keScpLnRvZ2dsZUNsYXNzKCduby1zY3JvbGwnKTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gaW5pdE1lZGlhTGlzdCgpIHtcbiAgICBpZiAoICEkKCcubWVkaWEtdG9nZ2xlci1saW5rJykubGVuZ3RoICkgcmV0dXJuO1xuXG4gICAgdmFyICRlbCA9ICQoJy5tZWRpYS10b2dnbGVyLWxpbmsnKTtcblxuICAgICRlbC5lYWNoKFxuICAgICAgICBmdW5jdGlvbihpKSB7XG5cbiAgICAgICAgICAgIHZhciAkaWNvbiA9ICQodGhpcykuZmluZCgnLmljb24nKTtcblxuICAgICAgICAgICAgJCh0aGlzKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgJGljb24udG9nZ2xlQ2xhc3MoJ2ZhLWNoZWNrJyk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgKTtcbn1cblxuZnVuY3Rpb24gaW5pdENvbnRyeUZpbHRlcigpIHtcbiAgICBpZiAoICEkKCcuZmlsdGVyLXNlbCcpLmxlbmd0aCApIHJldHVybjtcblxuICAgICQoJyNmaWx0ZXJCeUNvdW50cnknKVxuICAgICAgICAuZHJvcGRvd24oe1xuICAgICAgICAgICAgbW9iaWxlOiB0cnVlLFxuICAgICAgICAgICAgbGFiZWw6ICdTZWxlY3QgQ291bnRyeSdcbiAgICAgICAgfSk7XG5cbiAgICAkKCcjZmlsdGVyQnlMYW5nJylcbiAgICAgICAgLmRyb3Bkb3duKHtcbiAgICAgICAgICAgIG1vYmlsZTogdHJ1ZSxcbiAgICAgICAgICAgIGxhYmVsOiAnU2VsZWN0IExhbmd1YWdlJ1xuICAgICAgICB9KTtcbn1cblxuZnVuY3Rpb24gaW5pdEluaXRpYWxTY3JvbGwoKSB7XG4gICAgaWYgKCAhJCgnLmZpbHRlci1pbml0aWFsLW91dGVyIC5maWx0ZXItaW5pdGlhbC1saW5rJykubGVuZ3RoICYmXG4gICAgICAgICAhJCgnLmZpbHRlci1tZWRpYS1vdXRlciAubWVkaWEtZ3JvdXAnKS5sZW5ndGhcbiAgICApIHJldHVybjtcblxuICAgIHZhciAkdGFyZ2V0cyA9ICQoJy5maWx0ZXItbWVkaWEtb3V0ZXIuc2VsZWN0ZWQgLm1lZGlhLWdyb3VwJylcbiAgICAsICAgJGluaXRpYWxzID0gJCgnLmZpbHRlci1pbml0aWFsLW91dGVyIC5maWx0ZXItaW5pdGlhbC1saW5rJylcbiAgICA7XG5cbiAgICAkaW5pdGlhbHMuZWFjaCggZnVuY3Rpb24oaSkge1xuICAgICAgICB2YXIgJGVsID0gJCh0aGlzKVxuICAgICAgICAsICAgX2luaXRpYWwgPSAkZWwuZGF0YSgnaW5pdGlhbC1saW5rJylcbiAgICAgICAgLCAgIFRhcmdldCA9IHt9XG4gICAgICAgIDtcblxuICAgICAgICAkZWwub24oICdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgLy8gU2V0IHRoZSBlbGVtZW50XG4gICAgICAgICAgICBUYXJnZXQuJGVsID0gJHRhcmdldHMuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiggaSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5pdGlhbCcpID09PSBfaW5pdGlhbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIC8vIEdldCBpdHMgb2Zmc2V0IHRvcFxuICAgICAgICAgICAgVGFyZ2V0LnRvcCA9IFRhcmdldC4kZWwub2Zmc2V0KCkudG9wO1xuXG4gICAgICAgICAgICAvLyBHZXQgdGhlIHNjcm9sbFRvcCBvZmZzZXRcbiAgICAgICAgICAgIFRhcmdldC5vZmZzZXQgPSAkKCcuZmlsdGVyLW1lZGlhLW91dGVyJykub2Zmc2V0KCkudG9wIHx8IDA7XG5cbiAgICAgICAgICAgIHNjcm9sbE91dGVyKCBUYXJnZXQgKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBzY3JvbGxPdXRlciggZGF0YSApIHtcblxuICAgICAgICBkYXRhID0gZGF0YSB8fCB7fTtcbiAgICAgICAgZGF0YS5vZmZzZXQgPSBkYXRhLm9mZnNldCB8fCAwO1xuICAgICAgICBkYXRhLnRvcCA9IGRhdGEudG9wIHx8IDA7XG5cbiAgICAgICAgdmFyIHZhbCA9IGRhdGEudG9wIC0gZGF0YS5vZmZzZXRcbiAgICAgICAgLCAgICRvdXRlciA9ICQoJy5maWx0ZXItbWVkaWEtb3V0ZXInKTtcblxuICAgICAgICAkb3V0ZXIuYW5pbWF0ZShcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzY3JvbGxUb3A6ICcrPScgKyB2YWwgKyAnJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdzbG93J1xuICAgICAgICApO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gaW5pdFNlbGVjdE1lZGlhQnlMYW5nKCkge1xuICAgIGlmICggISQoJy5maWx0ZXItc2VsZWN0LW91dGVyICNmaWx0ZXJCeUxhbmcnKS5sZW5ndGggJiZcbiAgICAgICAgICEkKCcuZmlsdGVyLW1lZGlhLW91dGVyJykubGVuZ3RoXG4gICAgKSByZXR1cm47XG5cbiAgICB2YXIgJHNlbCA9ICQoJyNmaWx0ZXJCeUxhbmcnKVxuICAgICwgICAkdGFyZ2V0ID0gJCgnLmZpbHRlci1tZWRpYS1vdXRlcicpXG4gICAgO1xuXG4gICAgJHNlbC5vbignY2hhbmdlJywgZnVuY3Rpb24oZSkge1xuXG4gICAgICAgIHZhciBfdmFsID0gJCh0aGlzKS52YWwoKVxuXG4gICAgICAgICwgICRfdGFyZ2V0ID0gJCgnLmZpbHRlci1tZWRpYS1vdXRlcicpLmZpbHRlcihcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiggaSApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICQodGhpcykuYXR0cignZGF0YS1sYW5nJykgPT09IF92YWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKVxuICAgICAgICA7XG5cbiAgICAgICAgLy8gY29uc29sZS5sb2coJF90YXJnZXQpO1xuXG4gICAgICAgICQoJy5maWx0ZXItbWVkaWEtb3V0ZXInKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICAgICAgJF90YXJnZXQuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWVkaWFGaWx0ZXI7IiwidmFyIE5hdiA9IHtcbiAgICBpbml0OiBpbml0XG59O1xuXG5mdW5jdGlvbiBpbml0KCkge1xuXG4gICAgZnVuY3Rpb24gdG9nZ2xlRmlsdGVyTmF2KCkge1xuICAgICAgICB2YXIgJGVsID0gJCgnLmZpbHRlci1uYXYtaW5uZXInKTtcblxuICAgICAgICBpZiAoICRlbC5oYXNDbGFzcygnYWN0aXZlJykgKSB7XG4gICAgICAgICAgICAkZWwucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgJCgnLmZpbHRlci1uYXYtdG9nZ2xlcicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICRlbC5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAkKCcuZmlsdGVyLW5hdi10b2dnbGVyJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJCgnLmZpbHRlci1uYXYtdG9nZ2xlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICBjb25zb2xlLmxvZyggJCh0aGlzKSApO1xuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdG9nZ2xlRmlsdGVyTmF2KCk7XG4gICAgfSk7XG5cbiAgICB2YXIgX29uVW5waW5NYWluTmF2ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKCcuZmlsdGVyLW5hdi1pbm5lcicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICQoJy5maWx0ZXItbmF2LXRvZ2dsZXInKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIH1cbiAgICAsICAgX29uVW5waW5Ub3BiYXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnVW5waW4nLCAkKCcuc3Vic2NyaWJlLWZpbHRlci1vdXRlcicpICk7XG4gICAgICAgICAgICAkKCcuc3Vic2NyaWJlLWZpbHRlci1vdXRlcicpLnJlbW92ZUNsYXNzKCdoZWFkcm9vbS11bnBpbicpO1xuICAgICAgICB9XG4gICAgLCAgIF9vblBpblRvcGJhciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coICdQaW4nLCAkKCcuc3Vic2NyaWJlLWZpbHRlci1vdXRlcicpICk7XG4gICAgICAgICAgICAkKCcuc3Vic2NyaWJlLWZpbHRlci1vdXRlcicpLmFkZENsYXNzKCdoZWFkcm9vbS11bnBpbicpO1xuICAgICAgICB9XG5cbiAgICAsICAgX2hlYWRyb29tT3B0TWFpbk5hdiA9IHtcbiAgICAgICAgICAgIFwib2Zmc2V0XCI6IDgwLFxuICAgICAgICAgICAgXCJ0b2xlcmFuY2VcIjogMyxcbiAgICAgICAgICAgIFwiY2xhc3Nlc1wiOiB7XG4gICAgICAgICAgICAgICAgXCJpbml0aWFsXCI6IFwibmF2YmFyLWFuaW1hdGVkXCIsXG4gICAgICAgICAgICAgICAgXCJwaW5uZWRcIjogXCJuYXZiYXItc2xpZGUtZG93blwiLFxuICAgICAgICAgICAgICAgIFwidW5waW5uZWRcIjogXCJuYXZiYXItc2xpZGUtdXBcIixcbiAgICAgICAgICAgICAgICBcInRvcFwiOiBcIm5hdmJhci1vbi10b3BcIixcbiAgICAgICAgICAgICAgICBcIm5vdFRvcFwiOiBcIm5hdmJhci1ub3QtdG9wXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIm9uVW5waW5cIjogX29uVW5waW5NYWluTmF2XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2hlYWRyb29tT3B0VG9wYmFyID0ge1xuICAgICAgICAgICAgXCJvZmZzZXRcIjogODAsXG4gICAgICAgICAgICBcInRvbGVyYW5jZVwiOiAzLFxuICAgICAgICAgICAgXCJjbGFzc2VzXCI6IHtcbiAgICAgICAgICAgICAgICBcImluaXRpYWxcIjogXCJ0b3BiYXItYW5pbWF0ZWRcIixcbiAgICAgICAgICAgICAgICBcInBpbm5lZFwiOiBcInRvcGJhci1zbGlkZS11cFwiLFxuICAgICAgICAgICAgICAgIFwidW5waW5uZWRcIjogXCJ0b3BiYXItc2xpZGUtZG93blwiLFxuICAgICAgICAgICAgICAgIFwidG9wXCI6IFwidG9wYmFyLW9uLXRvcFwiLFxuICAgICAgICAgICAgICAgIFwibm90VG9wXCI6IFwidG9wYmFyLW5vdC10b3BcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwib25QaW5cIjogX29uVW5waW5Ub3BiYXIsXG4gICAgICAgICAgICBcIm9uVW5waW5cIjogX29uUGluVG9wYmFyXG4gICAgICAgIH07XG5cbiAgICAkKCcuaXMtaGVhZHJvb20gLm5hdmJhci1maXhlZCcpXG4gICAgICAgIC5maW5kKCcubWFpbi1uYXYtb3V0ZXInKVxuICAgICAgICAuaGVhZHJvb20oIF9oZWFkcm9vbU9wdE1haW5OYXYgKS5lbmQoKVxuICAgICAgICAuZmluZCgnLnRvcGJhci1vdXRlcicpXG4gICAgICAgIC5oZWFkcm9vbSggX2hlYWRyb29tT3B0VG9wYmFyICkuZW5kKClcbiAgICAgICAgO1xuICAgIDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBOYXY7IiwidmFyIFNlYXJjaEZpbHRlciA9IHtcbiAgICBpbml0T3ZlcmxheVRvZ2dsZXI6IGluaXRPdmVybGF5VG9nZ2xlclxufTtcblxuZnVuY3Rpb24gaW5pdE92ZXJsYXlUb2dnbGVyKCkge1xuICAgIGlmICggISQoJy5maWx0ZXItbmF2LW91dGVyICNzZWFyY2hUb2dnbGVyJykubGVuZ3RoICYmXG4gICAgICAgICAhJCgnLnNlYXJjaC1vdXRlcicpLmxlbmd0aFxuICAgICkgcmV0dXJuO1xuXG4gICAgdmFyICR0b2dnbGVySW4gPSAkKCcjc2VhcmNoVG9nZ2xlcicpXG4gICAgLCAgICR0b2dnbGVyT3V0ID0gJCgnLnNlYXJjaC1zdWJtaXQtYnRuLCAuc2VhcmNoLW91dGVyLW92ZXJsYXknKVxuICAgICwgICAkdG9nZ2xlclBhcmVudCA9ICQoJy5maWx0ZXItbmF2LWlubmVyJylcbiAgICAsICAgJGVsID0gJCgnLnNlYXJjaC1vdXRlcicpXG4gICAgO1xuXG4gICAgJHRvZ2dsZXJJbi5vbiggJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAkdG9nZ2xlclBhcmVudC5yZW1vdmVDbGFzcyggJ2FjdGl2ZScgKTtcblxuICAgICAgICBpZiAoICEkZWwuaGFzQ2xhc3MoJ2FjdGl2ZScpIClcbiAgICAgICAgICAgICRlbC5hZGRDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgJCgnYm9keScpLnRvZ2dsZUNsYXNzKCduby1zY3JvbGwnKTtcbiAgICB9KTtcblxuICAgICR0b2dnbGVyT3V0Lm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzKTtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgaWYgKCAkZWwuaGFzQ2xhc3MoJ2FjdGl2ZScpIClcbiAgICAgICAgICAgICRlbC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgJCgnYm9keScpLnRvZ2dsZUNsYXNzKCduby1zY3JvbGwnKTtcbiAgICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZWFyY2hGaWx0ZXI7IiwidmFyIFN1YnNjcmliZUZpbHRlciA9IHtcbiAgICBpbml0OiBpbml0XG59O1xuXG5mdW5jdGlvbiBpbml0KCkge1xuICAgIGlmICggISQoJyNzZlNlbGVjdGVkJykubGVuZ3RoICkgcmV0dXJuO1xuXG4gICAgdmFyICRzZlNlbGVjdGVkID0gJCgnI3NmU2VsZWN0ZWQnKVxuICAgICwgICAkc2ZUb2dnbGVyICA9ICQoJy5zZi10b2dnbGVyJylcbiAgICAsICAgJHNmSW5wdXRPdXRlciA9ICQoJy5zZi1pbnB1dC1vdXRlcicpXG4gICAgLCAgICRzZklucHV0Um93T3V0ZXJzID0gJCgnLnNmLWlucHV0LXJvdy1vdXRlcicpXG4gICAgO1xuXG4gICAgJHNmU2VsZWN0ZWRcbiAgICAgICAgLmRyb3Bkb3duKHtcbiAgICAgICAgICAgIG1vYmlsZTogdHJ1ZSxcbiAgICAgICAgICAgIGxhYmVsOiAnQWRkIGtleXdvcmQocyknXG4gICAgICAgIH0pO1xuXG4gICAgJHNmVG9nZ2xlci5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgJHNmSW5wdXRPdXRlci50b2dnbGVDbGFzcygnYWN0aXZlJyk7XG4gICAgfSk7XG5cbiAgICB2YXIgcm93TiA9ICRzZklucHV0Um93T3V0ZXJzLmxlbmd0aDtcblxuICAgICRzZklucHV0Um93T3V0ZXJzLmVhY2goIGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgdmFyICRyb3cgPSAkKHRoaXMpO1xuXG4gICAgICAgICQodGhpcylcbiAgICAgICAgICAgIC5maW5kKCcuc2YtaW5wdXQtdG9nZ2xlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgIHZhciAkdGhpc1JvdyA9ICQodGhpcykucGFyZW50KCkuY2xvc2VzdCgnLnNmLWlucHV0LXJvdy1vdXRlcicpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCR0aGlzUm93LmF0dHIoJ2RhdGEtY2xvbmUnKSk7XG5cbiAgICAgICAgICAgICAgICAvLyBpZiAoICR0aGlzUm93LnZhbCgpICE9PSAnJyApIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgdmFyIF9pbnB1dFZhbCA9ICQodGhpcykucHJldignLnNmLWlucHV0JykudmFsKCk7XG4gICAgICAgICAgICAgICAgLy8gICAgIHZhciAkbmV3Um93ID0gJHRoaXNSb3cuY2xvbmUodHJ1ZSkuYXBwZW5kVG8oICRzZklucHV0T3V0ZXIgKTtcbiAgICAgICAgICAgICAgICAvLyAgICAgJG5ld1Jvdy5maW5kKCcuc2YtaW5wdXQnKS52YWwoJycpO1xuICAgICAgICAgICAgICAgIC8vICAgICAkdGhpc1Jvdy5hdHRyKCdkYXRhLWNsb25lJywgZmFsc2UpO1xuICAgICAgICAgICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gICAgICR0aGlzUm93LnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIH0pXG4gICAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU3Vic2NyaWJlRmlsdGVyOyJdfQ==
