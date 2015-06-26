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
    
    $(function() {

        // Nav.init();
        
        Content.initCoverUI();
        
        // MediaFilter.initMediaList();
        // MediaFilter.initContryFilter();
        // MediaFilter.initInitialScroll();
        // MediaFilter.initOverlayToggler();
        // MediaFilter.initSelectMediaByLang();
        // SearchFilter.initOverlayToggler();
        // SubscribeFilter.init();

        if ($( '#main' ).hasClass( 'latest-main' )) Aggressor.getFeed( 'latest' );
        else if ($( '#main' ).hasClass( 'featured-main' )) Aggressor.getFeed( 'featured' );
        else if ($( '#main' ).hasClass( 'subscribed-main' )) Aggressor.getFeed( 'subscribed' );
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
        if ( el ) el.classList.add("active");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0L3JiLXByb3RvLmpzIiwic3JjL3NjcmlwdC9wcm90by9BZ2dyZXNzb3IvaW5kZXguanMiLCJzcmMvc2NyaXB0L3Byb3RvL0Jyb3dzZXJMaW1pdC9pbmRleC5qcyIsInNyYy9zY3JpcHQvcHJvdG8vQ29udGVudC9pbmRleC5qcyIsInNyYy9zY3JpcHQvcHJvdG8vSW1wdWxzb3IvaW5kZXguanMiLCJzcmMvc2NyaXB0L3Byb3RvL01lZGlhRmlsdGVyL2luZGV4LmpzIiwic3JjL3NjcmlwdC9wcm90by9OYXYvaW5kZXguanMiLCJzcmMvc2NyaXB0L3Byb3RvL1NlYXJjaEZpbHRlci9pbmRleC5qcyIsInNyYy9zY3JpcHQvcHJvdG8vU3Vic2NyaWJlRmlsdGVyL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKioqXG4gKiAgICAgICAgICAgX18gICAgX18gICAgICAgX19fICAgICAgIF9fICAgX18gICAgICAgICAgICAgICBcbiAqICAgICAgICAgIHwgIHwgIHwgIHwgICAgIC8gICBcXCAgICAgfCAgfCB8ICB8ICAgICAgICAgICAgICBcbiAqICAgICAgICAgIHwgIHxfX3wgIHwgICAgLyAgXiAgXFwgICAgfCAgfCB8ICB8ICAgICAgICAgICAgICBcbiAqICAgICAgICAgIHwgICBfXyAgIHwgICAvICAvX1xcICBcXCAgIHwgIHwgfCAgfCAgICAgICAgICAgICAgXG4gKiAgICAgICAgICB8ICB8ICB8ICB8ICAvICBfX19fXyAgXFwgIHwgIHwgfCAgYC0tLS0uICAgICAgICAgXG4gKiAgICAgICAgICB8X198ICB8X198IC9fXy8gICAgIFxcX19cXCB8X198IHxfX19fX19ffCAgICAgICAgIFxuICogICAgICAgICBfX19fX19fLiBfXyAgLl9fX19fXyAgICAgLl9fICAgX18uICAgICAgX19fICAgICAgXG4gKiAgICAgICAgLyAgICAgICB8fCAgfCB8ICAgXyAgXFwgICAgfCAgXFwgfCAgfCAgICAgLyAgIFxcICAgICBcbiAqICAgICAgIHwgICAoLS0tLWB8ICB8IHwgIHxfKSAgfCAgIHwgICBcXHwgIHwgICAgLyAgXiAgXFwgICAgXG4gKiAgICAgICAgXFwgICBcXCAgICB8ICB8IHwgICAgICAvICAgIHwgIC4gYCAgfCAgIC8gIC9fXFwgIFxcICAgXG4gKiAgICAuLS0tLSkgICB8ICAgfCAgfCB8ICB8XFwgIFxcLS0tLXwgIHxcXCAgIHwgIC8gIF9fX19fICBcXCAgXG4gKiAgICB8X19fX19fXy8gICAgfF9ffCB8IF98IGAuX19fX198X198IFxcX198IC9fXy8gICAgIFxcX19cXCBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICovXG5cbiB2YXIgQnJvd3NlckxpbWl0ID0gcmVxdWlyZSgnLi9wcm90by9Ccm93c2VyTGltaXQnKVxuICwgICBOYXYgPSByZXF1aXJlKCcuL3Byb3RvL05hdicpXG4gLCAgIENvbnRlbnQgPSByZXF1aXJlKCcuL3Byb3RvL0NvbnRlbnQnKVxuICwgICBNZWRpYUZpbHRlciA9IHJlcXVpcmUoJy4vcHJvdG8vTWVkaWFGaWx0ZXInKVxuICwgICBTZWFyY2hGaWx0ZXIgPSByZXF1aXJlKCcuL3Byb3RvL1NlYXJjaEZpbHRlcicpXG4gLCAgIFN1YnNjcmliZUZpbHRlciA9IHJlcXVpcmUoJy4vcHJvdG8vU3Vic2NyaWJlRmlsdGVyJylcblxuICwgICBBZ2dyZXNzb3IgPSByZXF1aXJlKCAnLi9wcm90by9BZ2dyZXNzb3InIClcbiA7XG5cbiBCcm93c2VyTGltaXQuaW5pdCgpO1xuXG4oZnVuY3Rpb24oICQgKSB7XG4gICAgXG4gICAgJChmdW5jdGlvbigpIHtcblxuICAgICAgICAvLyBOYXYuaW5pdCgpO1xuICAgICAgICBcbiAgICAgICAgQ29udGVudC5pbml0Q292ZXJVSSgpO1xuICAgICAgICBcbiAgICAgICAgLy8gTWVkaWFGaWx0ZXIuaW5pdE1lZGlhTGlzdCgpO1xuICAgICAgICAvLyBNZWRpYUZpbHRlci5pbml0Q29udHJ5RmlsdGVyKCk7XG4gICAgICAgIC8vIE1lZGlhRmlsdGVyLmluaXRJbml0aWFsU2Nyb2xsKCk7XG4gICAgICAgIC8vIE1lZGlhRmlsdGVyLmluaXRPdmVybGF5VG9nZ2xlcigpO1xuICAgICAgICAvLyBNZWRpYUZpbHRlci5pbml0U2VsZWN0TWVkaWFCeUxhbmcoKTtcbiAgICAgICAgLy8gU2VhcmNoRmlsdGVyLmluaXRPdmVybGF5VG9nZ2xlcigpO1xuICAgICAgICAvLyBTdWJzY3JpYmVGaWx0ZXIuaW5pdCgpO1xuXG4gICAgICAgIGlmICgkKCAnI21haW4nICkuaGFzQ2xhc3MoICdsYXRlc3QtbWFpbicgKSkgQWdncmVzc29yLmdldEZlZWQoICdsYXRlc3QnICk7XG4gICAgICAgIGVsc2UgaWYgKCQoICcjbWFpbicgKS5oYXNDbGFzcyggJ2ZlYXR1cmVkLW1haW4nICkpIEFnZ3Jlc3Nvci5nZXRGZWVkKCAnZmVhdHVyZWQnICk7XG4gICAgICAgIGVsc2UgaWYgKCQoICcjbWFpbicgKS5oYXNDbGFzcyggJ3N1YnNjcmliZWQtbWFpbicgKSkgQWdncmVzc29yLmdldEZlZWQoICdzdWJzY3JpYmVkJyApO1xuICAgIH0pO1xuXG59KShqUXVlcnkpOyIsInZhciBJbXB1bHNvciA9IHJlcXVpcmUoICcuLi9JbXB1bHNvcicgKTtcblxudmFyIEFnZ3Jlc3NvciA9IHtcbiAgICBpbml0RmlsdGVyOiBpbml0RmlsdGVyLFxuICAgIGdldEZlZWQ6IGdldEZlZWQsXG4gICAgc2V0U3Vic2NyaWJlOiBzZXRTdWJzY3JpYmUsXG4gICAgc2V0RmlsdGVyQnlTb3VyY2U6IHNldEZpbHRlckJ5U291cmNlLFxuICAgIHNldEZpbHRlckJ5TGFuZzogc2V0RmlsdGVyQnlMYW5nLFxuICAgIHJlbmRlckRhdGE6IHJlbmRlckRhdGEsXG4gICAgaGFuZGxlRXJyb3I6IGhhbmRsZUVycm9yLFxuICAgIHJ1bkxvZzogcnVuTG9nXG59O1xuXG5mdW5jdGlvbiBnZXRGZWVkKCBmZWVkVHlwZSwgdmFsICkge1xuICAgIFxuICAgIGZlZWRUeXBlID0gZmVlZFR5cGUgfHwgJ2xhdGVzdCc7XG5cbiAgICB2YXIgX3NlbGYgPSB0aGlzXG4gICAgLCAgIF9wYXJhbXMgPSB7XG4gICAgICAgICAgICBrOiB2YWxcbiAgICAgICAgfVxuICAgIDtcblxuICAgICQuYWpheCh7XG4gICAgICAgIHR5cGU6IFwiR0VUXCIsXG4gICAgICAgIHVybDogZmVlZFR5cGUgKyBcIi5qc29uXCIsXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG5cbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oIGRhdGEgKSB7XG4gICAgICAgICAgICAkKCcjbWFpbi1wcmVsb2FkZXInKS50b2dnbGVDbGFzcyggJ2hpZGRlbicgKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZm9yICggdmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkgKysgKSB7XG4gICAgICAgICAgICAgICAgX3NlbGYucmVuZGVyRGF0YSggZmVlZFR5cGUsIGRhdGFbaV0gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBlcnJvcjogZnVuY3Rpb24oIGpxeGhyLCB0ZXh0U3RhdHVzLCBlcnJvciApIHtcbiAgICAgICAgICAgIF9zZWxmLmhhbmRsZUVycm9yKCBqcXhociwgdGV4dFN0YXR1cywgZXJyb3IgKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBzZXRTdWJzY3JpYmUoIHZhbCApIHtcblxuICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6ICdodHRwOi8vcmVhZGluZ2J1bGIuY29tL2FwaS9zZXRfc3Vic2NyaWJlJyxcbiAgICAgICAgZGF0YTogeyBrOiB2YWwgfSxcbiAgICAgICAgdHlwZTogJ0dFVCcsXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbnAnLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyggZGF0YSApO1xuICAgICAgICAgICAgaWYgKGRhdGEuc3RhdHVzPT1cImFkZGVkXCIpIF9zZWxmLmdldEZlZWQoICdzdWJzY3JpYmUnLCB2YWwgKTtcbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCBqcXhociwgdGV4dFN0YXR1cywgZXJyb3IgKSB7XG4gICAgICAgICAgICBfc2VsZi5oYW5kbGVFcnJvcigganF4aHIsIHRleHRTdGF0dXMsIGVycm9yICk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gaW5pdEZpbHRlcigpIHtcbiAgICBpZiAoISQoICcubWVkaWEtdG9nZ2xlci1saW5rJyApLmxlbmd0aCApIHJldHVybjtcblxuICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICB2YXIgJGVsU291cmNlVG9nZ2xlciA9ICQoICcubWVkaWEtdG9nZ2xlci1saW5rJyApO1xuXG4gICAgLy8gJCgnI2ZpbHRlclRvZ2dsZXInKS5vbmUoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgIC8vICAgICBfc2VsZi5zZXRGaWx0ZXJCeUxhbmcoICcxJyApO1xuICAgIC8vIH0pO1xuXG4gICAgJGVsU291cmNlVG9nZ2xlci5lYWNoKFxuICAgICAgICBmdW5jdGlvbihpKSB7XG4gICAgICAgICAgICAkKHRoaXMpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBfc2VsZi5zZXRGaWx0ZXJCeVNvdXJjZSggJCh0aGlzKS5kYXRhKCd2YWwnKSApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICApO1xufVxuXG5mdW5jdGlvbiBzZXRGaWx0ZXJCeUxhbmcoIHZhbCApIHtcblxuICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICB2YXIgX3BhcmFtcyA9IHtcbiAgICAgICAgdHlwZTogJ2xhbmd1YWdlJyxcbiAgICAgICAgdmFsdWU6IHZhbCArICcnXG4gICAgfTtcblxuICAgICQuYWpheCh7XG4gICAgICAgIHR5cGU6IFwiR0VUXCIsXG4gICAgICAgIHVybDogXCJodHRwOi8vcmVhZGluZ2J1bGIuY29tL2FwaS9zZXRfZmlsdGVyP3R5cGU9bGFuZ3VhZ2UmdmFsdWU9MVwiLFxuICAgICAgICBkYXRhVHlwZTogJ2pzb25wJyxcbiAgICAgICAgZGF0YTogX3BhcmFtcyxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oIGRhdGEgKSB7XG4gICAgICAgICAgICBfc2VsZi5ydW5Mb2coZGF0YSk7XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yOiBmdW5jdGlvbigganF4aHIsIHRleHRTdGF0dXMsIGVycm9yICkge1xuICAgICAgICAgICAgX3NlbGYuaGFuZGxlRXJyb3IoIGpxeGhyLCB0ZXh0U3RhdHVzLCBlcnJvciApO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHNldEZpbHRlckJ5U291cmNlKCB2YWwgKSB7XG5cbiAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgdmFyIF9wYXJhbXMgPSB7XG4gICAgICAgIHR5cGU6ICdzb3VyY2UnLFxuICAgICAgICB2YWx1ZTogdmFsXG4gICAgfTtcblxuICAgICQuYWpheCh7XG4gICAgICAgIHR5cGU6IFwiR0VUXCIsXG4gICAgICAgIHVybDogXCJodHRwOi8vcmVhZGluZ2J1bGIuY29tL2FwaS9zZXRfZmlsdGVyP3R5cGU9c291cmNlJnZhbHVlPTE5OFwiLFxuICAgICAgICBkYXRhVHlwZTogJ2pzb25wJyxcbiAgICAgICAgZGF0YTogJycsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKCBkYXRhICkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coIGRhdGFbMF0gKTtcbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCBqcXhociwgdGV4dFN0YXR1cywgZXJyb3IgKSB7XG4gICAgICAgICAgICBfc2VsZi5oYW5kbGVFcnJvcigganF4aHIsIHRleHRTdGF0dXMsIGVycm9yICk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gcmVuZGVyRGF0YSggZmVlZFR5cGUsIGRhdGEgKSB7XG4gICAgSW1wdWxzb3IuY3JlYXRlTWFya3VwKCBmZWVkVHlwZSwgJCgnI2ZlZWRzLW91dGVyJyksIGRhdGEgKTtcbn1cblxuZnVuY3Rpb24gcnVuTG9nKCBkYXRhICkge1xuICAgIGNvbnNvbGUubG9nKCBkYXRhICk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUVycm9yKCBqcXhociwgdGV4dFN0YXR1cywgZXJyb3IgKSB7XG4gICAgY29uc29sZS5sb2coanF4aHIpO1xuICAgIGNvbnNvbGUubG9nKHRleHRTdGF0dXMpO1xuICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBZ2dyZXNzb3I7IiwidmFyIEJyb3dzZXJMaW1pdCA9IHtcbiAgICBpbml0OiBpbml0XG59O1xuXG5mdW5jdGlvbiBpbml0KCkge1xuXG4gICAgaWYgKCFNb2Rlcm5penIudG91Y2gpIHsgXG4gICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnJvd3Nlci1saW1pdFwiKTtcbiAgICAgICAgaWYgKCBlbCApIGVsLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJyb3dzZXJMaW1pdDsiLCJ2YXIgQ29udGVudCA9IHtcbiAgICBpbml0Q292ZXJVSTogaW5pdENvdmVyVUlcbn07XG5cbmZ1bmN0aW9uIGluaXRDb3ZlclVJKCkge1xuICAgIGlmICggISQoJy5jb250ZW50LWNvdmVyLWltYWdlJykubGVuZ3RoICkgcmV0dXJuO1xuXG4gICAgdmFyICR0YXJnZXQgPSAkKCcuY29udGVudC1jb3Zlci1pbWFnZScpO1xuXG4gICAgJHRhcmdldC5lYWNoKCBmdW5jdGlvbiggaSApIHtcblxuICAgICAgICB2YXIgX3NyYyA9ICQoIHRoaXMgKS5kYXRhKCdzcmMnKTtcblxuICAgICAgICAkKCB0aGlzICkuYmFja2dyb3VuZCh7XG4gICAgICAgICAgICBzb3VyY2U6IF9zcmNcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29udGVudDsiLCJ2YXIgSW1wdWxzb3IgPSB7XG4gICAgY3JlYXRlTWFya3VwOiBjcmVhdGVNYXJrdXAsXG4gICAgcGFyc2VUaW1lYWdvOiBwYXJzZVRpbWVhZ28sXG4gICAgdHJ1bmNhdGVCb2R5Y29weTogdHJ1bmNhdGVCb2R5Y29weVxufTtcblxuZnVuY3Rpb24gdHJ1bmNhdGVCb2R5Y29weSggJGVsICkge1xuICAgIGlmICggdHlwZW9mICQoKS5kb3Rkb3Rkb3QoKSAhPT0gJ29iamVjdCcgKSByZXR1cm47XG5cbiAgICAkZWwuZG90ZG90ZG90KHtcbiAgICAgICAgZWxsaXBzaXM6ICcgLi4uICdcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTWFya3VwKCBtb2RlbFR5cGUsIGNvbnRleHQsIGRhdGEgKSB7XG5cbiAgICBpZiggISQoJy5tYXJrdXAtbW9kZWwnKS5sZW5ndGggKSByZXR1cm47XG5cbiAgICBjb250ZXh0ID0gY29udGV4dCB8fCAkKCcjZmVlZHMtb3V0ZXInKTtcblxuICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICB2YXIgJG1tID0gJCgnLmNhcmQubWFya3VwLW1vZGVsJyk7XG5cbiAgICBpZiAoIG1vZGVsVHlwZSA9PT0gJ2ZlYXR1cmVkJyApIHtcblxuICAgICAgICB2YXIgJG5ld01tID0gJG1tLmNsb25lKClcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnbWFya3VwLW1vZGVsJylcbiAgICAgICAgICAgIC5maW5kKCAnLmNhcmQtaW1hZ2UgaW1nJyApLmF0dHIoICdzcmMnLCBkYXRhLmltYWdlICkuZW5kKClcbiAgICAgICAgICAgIC5maW5kKCAnLmNhcmQtY29udGVudC10aXRsZSBhJyApLmF0dHIoICdocmVmJywgZGF0YS5jb250ZW50X3VybCApLnRleHQoIGRhdGEudGl0bGUgKS5lbmQoKVxuICAgICAgICAgICAgLmZpbmQoICcubWV0YS1zb3VyY2UgaW1nJyApLmF0dHIoICdzcmMnLCBkYXRhLnNvdXJjZS5pY29uX3VybCApLmVuZCgpXG4gICAgICAgICAgICAuZmluZCggJy5tZXRhLWZyb20nICkudGV4dCggZGF0YS5zb3VyY2UubmFtZSApLmVuZCgpXG4gICAgICAgICAgICAuZmluZCggJy5tZXRhLXRpbWVhZ28nICkudGV4dCggX3NlbGYucGFyc2VUaW1lYWdvKCBkYXRhLnRpbWVfbmV3cyApICkuZW5kKClcbiAgICAgICAgICAgIC5maW5kKCAnLmNhcmQtY29udGVudC1zdW1tYXJ5IHNwYW4nICkuaHRtbCggZGF0YS5zdW1tYXJ5ICkuZW5kKClcbiAgICAgICAgICAgIC5hcHBlbmRUbyggY29udGV4dCApO1xuICAgIH1cblxuICAgIGVsc2UgaWYgKCBtb2RlbFR5cGUgPT09ICdsYXRlc3QnICkge1xuXG4gICAgICAgIHZhciAkbmV3TW0gPSAkbW0uY2xvbmUoKVxuICAgICAgICAgICAgLmNsb25lKClcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnbWFya3VwLW1vZGVsJylcbiAgICAgICAgICAgIC5maW5kKCAnLmNhcmQtY29udGVudC10aXRsZSBhJyApLmF0dHIoICdocmVmJywgZGF0YS5jb250ZW50X3VybCApLnRleHQoIGRhdGEudGl0bGUgKS5lbmQoKVxuICAgICAgICAgICAgLmZpbmQoICcubWV0YS1zb3VyY2UgaW1nJyApLmF0dHIoICdzcmMnLCBkYXRhLnNvdXJjZS5pY29uX3VybCApLmVuZCgpXG4gICAgICAgICAgICAuZmluZCggJy5tZXRhLWZyb20nICkudGV4dCggZGF0YS5zb3VyY2UubmFtZSApLmVuZCgpXG4gICAgICAgICAgICAuZmluZCggJy5tZXRhLXRpbWVhZ28nICkudGV4dCggX3NlbGYucGFyc2VUaW1lYWdvKCBkYXRhLnRpbWVfbmV3cyApICkuZW5kKClcbiAgICAgICAgICAgIC5hcHBlbmRUbyggY29udGV4dCApO1xuICAgIH1cblxuICAgIGVsc2UgaWYgKCBtb2RlbFR5cGUgPT09ICdzdWJzY3JpYmVkJyApIHtcblxuICAgICAgICB2YXIgJG5ld01tID0gJG1tLmNsb25lKClcbiAgICAgICAgICAgIC5jbG9uZSgpXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ21hcmt1cC1tb2RlbCcpXG4gICAgICAgICAgICAuZmluZCggJy5jYXJkLWltYWdlIGltZycgKS5hdHRyKCAnc3JjJywgZGF0YS5pbWFnZSApLmVuZCgpXG4gICAgICAgICAgICAuZmluZCggJy5jYXJkLWNvbnRlbnQtdGl0bGUgYScgKS5hdHRyKCAnaHJlZicsIGRhdGEuY29udGVudF91cmwgKS50ZXh0KCBkYXRhLnRpdGxlICkuZW5kKClcbiAgICAgICAgICAgIC5maW5kKCAnLm1ldGEtc291cmNlIGltZycgKS5hdHRyKCAnc3JjJywgZGF0YS5zb3VyY2UuaWNvbl91cmwgKS5lbmQoKVxuICAgICAgICAgICAgLmZpbmQoICcubWV0YS1mcm9tJyApLnRleHQoIGRhdGEuc291cmNlLm5hbWUgKS5lbmQoKVxuICAgICAgICAgICAgLmZpbmQoICcubWV0YS10aW1lYWdvJyApLnRleHQoIF9zZWxmLnBhcnNlVGltZWFnbyggZGF0YS50aW1lX25ld3MgKSApLmVuZCgpXG4gICAgICAgICAgICAuZmluZCggJy5jYXJkLWNvbnRlbnQtc3VtbWFyeSBwJyApLmh0bWwoIGRhdGEuc3VtbWFyeSApLmVuZCgpXG4gICAgICAgICAgICAuYXBwZW5kVG8oIGNvbnRleHQgKTtcblxuICAgICAgICAgICAgJCggJy5jYXJkLWltYWdlIGltZycgKS5lYWNoKFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCBpICkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoICQoIHRoaXMgKS5hdHRyKCAnc3JjJyApID09PSAnJyApICQoIHRoaXMgKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgIH1cblxuICAgIC8vIFRydW5jYXRpb25zXG4gICAgdmFyICR0b2JlVHJ1bmNhdGVkID0gJG5ld01tLmZpbmQoICcuY2FyZC1jb250ZW50LXN1bW1hcnkgc3BhbicgKTtcbiAgICBpZiAoICR0b2JlVHJ1bmNhdGVkLmhlaWdodCgpID4gOTYgKSBfc2VsZi50cnVuY2F0ZUJvZHljb3B5KCAkdG9iZVRydW5jYXRlZC5jbG9zZXN0KCAnLmNhcmQtY29udGVudC1zdW1tYXJ5JyApICk7XG4gICAgZWxzZSAkdG9iZVRydW5jYXRlZC5maW5kKCAnLnJlYWRtb3JlJyApLnJlbW92ZSgpO1xuXG59XG5cbmZ1bmN0aW9uIHBhcnNlVGltZWFnbyggbSApIHtcbiAgICByZXR1cm4gbW9tZW50KCBtLCAnWVlZWS1NTS1ERCBISDptbTpzcycgKS5mcm9tTm93KCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gSW1wdWxzb3I7IiwidmFyIE1lZGlhRmlsdGVyID0ge1xuICAgIGluaXRNZWRpYUxpc3Q6IGluaXRNZWRpYUxpc3QsXG4gICAgaW5pdENvbnRyeUZpbHRlcjogaW5pdENvbnRyeUZpbHRlcixcbiAgICBpbml0SW5pdGlhbFNjcm9sbDogaW5pdEluaXRpYWxTY3JvbGwsXG4gICAgaW5pdE92ZXJsYXlUb2dnbGVyOiBpbml0T3ZlcmxheVRvZ2dsZXIsXG4gICAgaW5pdFNlbGVjdE1lZGlhQnlMYW5nOiBpbml0U2VsZWN0TWVkaWFCeUxhbmdcbn07XG5cbmZ1bmN0aW9uIGluaXRPdmVybGF5VG9nZ2xlcigpIHtcbiAgICBpZiAoICEkKCcuZmlsdGVyLW5hdi1vdXRlciAjZmlsdGVyVG9nZ2xlcicpLmxlbmd0aCAmJlxuICAgICAgICAgISQoJy5maWx0ZXItb3V0ZXInKS5sZW5ndGhcbiAgICApIHJldHVybjtcblxuICAgIHZhciAkdG9nZ2xlckluID0gJCgnI2ZpbHRlclRvZ2dsZXInKVxuICAgICwgICAkdG9nZ2xlck91dCA9ICQoJy5maWx0ZXItc3VibWl0LWJ0biwgLmZpbHRlci1vdXRlci1vdmVybGF5JylcbiAgICAsICAgJHRvZ2dsZXJQYXJlbnQgPSAkKCcuZmlsdGVyLW5hdi1pbm5lcicpXG4gICAgLCAgICRlbCA9ICQoJy5maWx0ZXItb3V0ZXInKVxuICAgIDtcblxuICAgICR0b2dnbGVySW4ub24oICdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgJHRvZ2dsZXJQYXJlbnQucmVtb3ZlQ2xhc3MoICdhY3RpdmUnICk7XG5cbiAgICAgICAgaWYgKCAhJGVsLmhhc0NsYXNzKCdhY3RpdmUnKSApXG4gICAgICAgICAgICAkZWwuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICQoJ2JvZHknKS50b2dnbGVDbGFzcygnbm8tc2Nyb2xsJyk7XG4gICAgfSk7XG5cbiAgICAkdG9nZ2xlck91dC5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGlmICggJGVsLmhhc0NsYXNzKCdhY3RpdmUnKSApXG4gICAgICAgICAgICAkZWwucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICQoJ2JvZHknKS50b2dnbGVDbGFzcygnbm8tc2Nyb2xsJyk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGluaXRNZWRpYUxpc3QoKSB7XG4gICAgaWYgKCAhJCgnLm1lZGlhLXRvZ2dsZXItbGluaycpLmxlbmd0aCApIHJldHVybjtcblxuICAgIHZhciAkZWwgPSAkKCcubWVkaWEtdG9nZ2xlci1saW5rJyk7XG5cbiAgICAkZWwuZWFjaChcbiAgICAgICAgZnVuY3Rpb24oaSkge1xuXG4gICAgICAgICAgICB2YXIgJGljb24gPSAkKHRoaXMpLmZpbmQoJy5pY29uJyk7XG5cbiAgICAgICAgICAgICQodGhpcykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgICRpY29uLnRvZ2dsZUNsYXNzKCdmYS1jaGVjaycpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICk7XG59XG5cbmZ1bmN0aW9uIGluaXRDb250cnlGaWx0ZXIoKSB7XG4gICAgaWYgKCAhJCgnLmZpbHRlci1zZWwnKS5sZW5ndGggKSByZXR1cm47XG5cbiAgICAkKCcjZmlsdGVyQnlDb3VudHJ5JylcbiAgICAgICAgLmRyb3Bkb3duKHtcbiAgICAgICAgICAgIG1vYmlsZTogdHJ1ZSxcbiAgICAgICAgICAgIGxhYmVsOiAnU2VsZWN0IENvdW50cnknXG4gICAgICAgIH0pO1xuXG4gICAgJCgnI2ZpbHRlckJ5TGFuZycpXG4gICAgICAgIC5kcm9wZG93bih7XG4gICAgICAgICAgICBtb2JpbGU6IHRydWUsXG4gICAgICAgICAgICBsYWJlbDogJ1NlbGVjdCBMYW5ndWFnZSdcbiAgICAgICAgfSk7XG59XG5cbmZ1bmN0aW9uIGluaXRJbml0aWFsU2Nyb2xsKCkge1xuICAgIGlmICggISQoJy5maWx0ZXItaW5pdGlhbC1vdXRlciAuZmlsdGVyLWluaXRpYWwtbGluaycpLmxlbmd0aCAmJlxuICAgICAgICAgISQoJy5maWx0ZXItbWVkaWEtb3V0ZXIgLm1lZGlhLWdyb3VwJykubGVuZ3RoXG4gICAgKSByZXR1cm47XG5cbiAgICB2YXIgJHRhcmdldHMgPSAkKCcuZmlsdGVyLW1lZGlhLW91dGVyLnNlbGVjdGVkIC5tZWRpYS1ncm91cCcpXG4gICAgLCAgICRpbml0aWFscyA9ICQoJy5maWx0ZXItaW5pdGlhbC1vdXRlciAuZmlsdGVyLWluaXRpYWwtbGluaycpXG4gICAgO1xuXG4gICAgJGluaXRpYWxzLmVhY2goIGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgdmFyICRlbCA9ICQodGhpcylcbiAgICAgICAgLCAgIF9pbml0aWFsID0gJGVsLmRhdGEoJ2luaXRpYWwtbGluaycpXG4gICAgICAgICwgICBUYXJnZXQgPSB7fVxuICAgICAgICA7XG5cbiAgICAgICAgJGVsLm9uKCAnY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIC8vIFNldCB0aGUgZWxlbWVudFxuICAgICAgICAgICAgVGFyZ2V0LiRlbCA9ICR0YXJnZXRzLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oIGkgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJCh0aGlzKS5hdHRyKCdkYXRhLWluaXRpYWwnKSA9PT0gX2luaXRpYWw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAvLyBHZXQgaXRzIG9mZnNldCB0b3BcbiAgICAgICAgICAgIFRhcmdldC50b3AgPSBUYXJnZXQuJGVsLm9mZnNldCgpLnRvcDtcblxuICAgICAgICAgICAgLy8gR2V0IHRoZSBzY3JvbGxUb3Agb2Zmc2V0XG4gICAgICAgICAgICBUYXJnZXQub2Zmc2V0ID0gJCgnLmZpbHRlci1tZWRpYS1vdXRlcicpLm9mZnNldCgpLnRvcCB8fCAwO1xuXG4gICAgICAgICAgICBzY3JvbGxPdXRlciggVGFyZ2V0ICk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gc2Nyb2xsT3V0ZXIoIGRhdGEgKSB7XG5cbiAgICAgICAgZGF0YSA9IGRhdGEgfHwge307XG4gICAgICAgIGRhdGEub2Zmc2V0ID0gZGF0YS5vZmZzZXQgfHwgMDtcbiAgICAgICAgZGF0YS50b3AgPSBkYXRhLnRvcCB8fCAwO1xuXG4gICAgICAgIHZhciB2YWwgPSBkYXRhLnRvcCAtIGRhdGEub2Zmc2V0XG4gICAgICAgICwgICAkb3V0ZXIgPSAkKCcuZmlsdGVyLW1lZGlhLW91dGVyJyk7XG5cbiAgICAgICAgJG91dGVyLmFuaW1hdGUoXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAnKz0nICsgdmFsICsgJydcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnc2xvdydcbiAgICAgICAgKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGluaXRTZWxlY3RNZWRpYUJ5TGFuZygpIHtcbiAgICBpZiAoICEkKCcuZmlsdGVyLXNlbGVjdC1vdXRlciAjZmlsdGVyQnlMYW5nJykubGVuZ3RoICYmXG4gICAgICAgICAhJCgnLmZpbHRlci1tZWRpYS1vdXRlcicpLmxlbmd0aFxuICAgICkgcmV0dXJuO1xuXG4gICAgdmFyICRzZWwgPSAkKCcjZmlsdGVyQnlMYW5nJylcbiAgICAsICAgJHRhcmdldCA9ICQoJy5maWx0ZXItbWVkaWEtb3V0ZXInKVxuICAgIDtcblxuICAgICRzZWwub24oJ2NoYW5nZScsIGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICB2YXIgX3ZhbCA9ICQodGhpcykudmFsKClcblxuICAgICAgICAsICAkX3RhcmdldCA9ICQoJy5maWx0ZXItbWVkaWEtb3V0ZXInKS5maWx0ZXIoXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oIGkgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkKHRoaXMpLmF0dHIoJ2RhdGEtbGFuZycpID09PSBfdmFsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIClcbiAgICAgICAgO1xuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCRfdGFyZ2V0KTtcblxuICAgICAgICAkKCcuZmlsdGVyLW1lZGlhLW91dGVyJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgICAgICRfdGFyZ2V0LmFkZENsYXNzKCdzZWxlY3RlZCcpO1xuICAgIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1lZGlhRmlsdGVyOyIsInZhciBOYXYgPSB7XG4gICAgaW5pdDogaW5pdFxufTtcblxuZnVuY3Rpb24gaW5pdCgpIHtcblxuICAgIGZ1bmN0aW9uIHRvZ2dsZUZpbHRlck5hdigpIHtcbiAgICAgICAgdmFyICRlbCA9ICQoJy5maWx0ZXItbmF2LWlubmVyJyk7XG5cbiAgICAgICAgaWYgKCAkZWwuaGFzQ2xhc3MoJ2FjdGl2ZScpICkge1xuICAgICAgICAgICAgJGVsLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICQoJy5maWx0ZXItbmF2LXRvZ2dsZXInKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAkZWwuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgJCgnLmZpbHRlci1uYXYtdG9nZ2xlcicpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICQoJy5maWx0ZXItbmF2LXRvZ2dsZXInKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgY29uc29sZS5sb2coICQodGhpcykgKTtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHRvZ2dsZUZpbHRlck5hdigpO1xuICAgIH0pO1xuXG4gICAgdmFyIF9vblVucGluTWFpbk5hdiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJCgnLmZpbHRlci1uYXYtaW5uZXInKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAkKCcuZmlsdGVyLW5hdi10b2dnbGVyJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICB9XG4gICAgLCAgIF9vblVucGluVG9wYmFyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJ1VucGluJywgJCgnLnN1YnNjcmliZS1maWx0ZXItb3V0ZXInKSApO1xuICAgICAgICAgICAgJCgnLnN1YnNjcmliZS1maWx0ZXItb3V0ZXInKS5yZW1vdmVDbGFzcygnaGVhZHJvb20tdW5waW4nKTtcbiAgICAgICAgfVxuICAgICwgICBfb25QaW5Ub3BiYXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnUGluJywgJCgnLnN1YnNjcmliZS1maWx0ZXItb3V0ZXInKSApO1xuICAgICAgICAgICAgJCgnLnN1YnNjcmliZS1maWx0ZXItb3V0ZXInKS5hZGRDbGFzcygnaGVhZHJvb20tdW5waW4nKTtcbiAgICAgICAgfVxuXG4gICAgLCAgIF9oZWFkcm9vbU9wdE1haW5OYXYgPSB7XG4gICAgICAgICAgICBcIm9mZnNldFwiOiA4MCxcbiAgICAgICAgICAgIFwidG9sZXJhbmNlXCI6IDMsXG4gICAgICAgICAgICBcImNsYXNzZXNcIjoge1xuICAgICAgICAgICAgICAgIFwiaW5pdGlhbFwiOiBcIm5hdmJhci1hbmltYXRlZFwiLFxuICAgICAgICAgICAgICAgIFwicGlubmVkXCI6IFwibmF2YmFyLXNsaWRlLWRvd25cIixcbiAgICAgICAgICAgICAgICBcInVucGlubmVkXCI6IFwibmF2YmFyLXNsaWRlLXVwXCIsXG4gICAgICAgICAgICAgICAgXCJ0b3BcIjogXCJuYXZiYXItb24tdG9wXCIsXG4gICAgICAgICAgICAgICAgXCJub3RUb3BcIjogXCJuYXZiYXItbm90LXRvcFwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJvblVucGluXCI6IF9vblVucGluTWFpbk5hdlxuICAgICAgICB9LFxuXG4gICAgICAgIF9oZWFkcm9vbU9wdFRvcGJhciA9IHtcbiAgICAgICAgICAgIFwib2Zmc2V0XCI6IDgwLFxuICAgICAgICAgICAgXCJ0b2xlcmFuY2VcIjogMyxcbiAgICAgICAgICAgIFwiY2xhc3Nlc1wiOiB7XG4gICAgICAgICAgICAgICAgXCJpbml0aWFsXCI6IFwidG9wYmFyLWFuaW1hdGVkXCIsXG4gICAgICAgICAgICAgICAgXCJwaW5uZWRcIjogXCJ0b3BiYXItc2xpZGUtdXBcIixcbiAgICAgICAgICAgICAgICBcInVucGlubmVkXCI6IFwidG9wYmFyLXNsaWRlLWRvd25cIixcbiAgICAgICAgICAgICAgICBcInRvcFwiOiBcInRvcGJhci1vbi10b3BcIixcbiAgICAgICAgICAgICAgICBcIm5vdFRvcFwiOiBcInRvcGJhci1ub3QtdG9wXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIm9uUGluXCI6IF9vblVucGluVG9wYmFyLFxuICAgICAgICAgICAgXCJvblVucGluXCI6IF9vblBpblRvcGJhclxuICAgICAgICB9O1xuXG4gICAgJCgnLmlzLWhlYWRyb29tIC5uYXZiYXItZml4ZWQnKVxuICAgICAgICAuZmluZCgnLm1haW4tbmF2LW91dGVyJylcbiAgICAgICAgLmhlYWRyb29tKCBfaGVhZHJvb21PcHRNYWluTmF2ICkuZW5kKClcbiAgICAgICAgLmZpbmQoJy50b3BiYXItb3V0ZXInKVxuICAgICAgICAuaGVhZHJvb20oIF9oZWFkcm9vbU9wdFRvcGJhciApLmVuZCgpXG4gICAgICAgIDtcbiAgICA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTmF2OyIsInZhciBTZWFyY2hGaWx0ZXIgPSB7XG4gICAgaW5pdE92ZXJsYXlUb2dnbGVyOiBpbml0T3ZlcmxheVRvZ2dsZXJcbn07XG5cbmZ1bmN0aW9uIGluaXRPdmVybGF5VG9nZ2xlcigpIHtcbiAgICBpZiAoICEkKCcuZmlsdGVyLW5hdi1vdXRlciAjc2VhcmNoVG9nZ2xlcicpLmxlbmd0aCAmJlxuICAgICAgICAgISQoJy5zZWFyY2gtb3V0ZXInKS5sZW5ndGhcbiAgICApIHJldHVybjtcblxuICAgIHZhciAkdG9nZ2xlckluID0gJCgnI3NlYXJjaFRvZ2dsZXInKVxuICAgICwgICAkdG9nZ2xlck91dCA9ICQoJy5zZWFyY2gtc3VibWl0LWJ0biwgLnNlYXJjaC1vdXRlci1vdmVybGF5JylcbiAgICAsICAgJHRvZ2dsZXJQYXJlbnQgPSAkKCcuZmlsdGVyLW5hdi1pbm5lcicpXG4gICAgLCAgICRlbCA9ICQoJy5zZWFyY2gtb3V0ZXInKVxuICAgIDtcblxuICAgICR0b2dnbGVySW4ub24oICdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgJHRvZ2dsZXJQYXJlbnQucmVtb3ZlQ2xhc3MoICdhY3RpdmUnICk7XG5cbiAgICAgICAgaWYgKCAhJGVsLmhhc0NsYXNzKCdhY3RpdmUnKSApXG4gICAgICAgICAgICAkZWwuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICQoJ2JvZHknKS50b2dnbGVDbGFzcygnbm8tc2Nyb2xsJyk7XG4gICAgfSk7XG5cbiAgICAkdG9nZ2xlck91dC5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgY29uc29sZS5sb2codGhpcyk7XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGlmICggJGVsLmhhc0NsYXNzKCdhY3RpdmUnKSApXG4gICAgICAgICAgICAkZWwucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICQoJ2JvZHknKS50b2dnbGVDbGFzcygnbm8tc2Nyb2xsJyk7XG4gICAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2VhcmNoRmlsdGVyOyIsInZhciBTdWJzY3JpYmVGaWx0ZXIgPSB7XG4gICAgaW5pdDogaW5pdFxufTtcblxuZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBpZiAoICEkKCcjc2ZTZWxlY3RlZCcpLmxlbmd0aCApIHJldHVybjtcblxuICAgIHZhciAkc2ZTZWxlY3RlZCA9ICQoJyNzZlNlbGVjdGVkJylcbiAgICAsICAgJHNmVG9nZ2xlciAgPSAkKCcuc2YtdG9nZ2xlcicpXG4gICAgLCAgICRzZklucHV0T3V0ZXIgPSAkKCcuc2YtaW5wdXQtb3V0ZXInKVxuICAgICwgICAkc2ZJbnB1dFJvd091dGVycyA9ICQoJy5zZi1pbnB1dC1yb3ctb3V0ZXInKVxuICAgIDtcblxuICAgICRzZlNlbGVjdGVkXG4gICAgICAgIC5kcm9wZG93bih7XG4gICAgICAgICAgICBtb2JpbGU6IHRydWUsXG4gICAgICAgICAgICBsYWJlbDogJ0FkZCBrZXl3b3JkKHMpJ1xuICAgICAgICB9KTtcblxuICAgICRzZlRvZ2dsZXIub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICRzZklucHV0T3V0ZXIudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgIH0pO1xuXG4gICAgdmFyIHJvd04gPSAkc2ZJbnB1dFJvd091dGVycy5sZW5ndGg7XG5cbiAgICAkc2ZJbnB1dFJvd091dGVycy5lYWNoKCBmdW5jdGlvbihpKSB7XG4gICAgICAgIHZhciAkcm93ID0gJCh0aGlzKTtcblxuICAgICAgICAkKHRoaXMpXG4gICAgICAgICAgICAuZmluZCgnLnNmLWlucHV0LXRvZ2dsZXInKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICB2YXIgJHRoaXNSb3cgPSAkKHRoaXMpLnBhcmVudCgpLmNsb3Nlc3QoJy5zZi1pbnB1dC1yb3ctb3V0ZXInKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkdGhpc1Jvdy5hdHRyKCdkYXRhLWNsb25lJykpO1xuXG4gICAgICAgICAgICAgICAgLy8gaWYgKCAkdGhpc1Jvdy52YWwoKSAhPT0gJycgKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgIHZhciBfaW5wdXRWYWwgPSAkKHRoaXMpLnByZXYoJy5zZi1pbnB1dCcpLnZhbCgpO1xuICAgICAgICAgICAgICAgIC8vICAgICB2YXIgJG5ld1JvdyA9ICR0aGlzUm93LmNsb25lKHRydWUpLmFwcGVuZFRvKCAkc2ZJbnB1dE91dGVyICk7XG4gICAgICAgICAgICAgICAgLy8gICAgICRuZXdSb3cuZmluZCgnLnNmLWlucHV0JykudmFsKCcnKTtcbiAgICAgICAgICAgICAgICAvLyAgICAgJHRoaXNSb3cuYXR0cignZGF0YS1jbG9uZScsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vICAgICAkdGhpc1Jvdy5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICB9KVxuICAgIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFN1YnNjcmliZUZpbHRlcjsiXX0=
