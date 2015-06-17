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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0L3JiLXByb3RvLmpzIiwic3JjL3NjcmlwdC9wcm90by9BZ2dyZXNzb3IvaW5kZXguanMiLCJzcmMvc2NyaXB0L3Byb3RvL0Jyb3dzZXJMaW1pdC9pbmRleC5qcyIsInNyYy9zY3JpcHQvcHJvdG8vQ29udGVudC9pbmRleC5qcyIsInNyYy9zY3JpcHQvcHJvdG8vSW1wdWxzb3IvaW5kZXguanMiLCJzcmMvc2NyaXB0L3Byb3RvL01lZGlhRmlsdGVyL2luZGV4LmpzIiwic3JjL3NjcmlwdC9wcm90by9OYXYvaW5kZXguanMiLCJzcmMvc2NyaXB0L3Byb3RvL1NlYXJjaEZpbHRlci9pbmRleC5qcyIsInNyYy9zY3JpcHQvcHJvdG8vU3Vic2NyaWJlRmlsdGVyL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9JQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKioqXG4gKiAgICAgICAgICAgX18gICAgX18gICAgICAgX19fICAgICAgIF9fICAgX18gICAgICAgICAgICAgICBcbiAqICAgICAgICAgIHwgIHwgIHwgIHwgICAgIC8gICBcXCAgICAgfCAgfCB8ICB8ICAgICAgICAgICAgICBcbiAqICAgICAgICAgIHwgIHxfX3wgIHwgICAgLyAgXiAgXFwgICAgfCAgfCB8ICB8ICAgICAgICAgICAgICBcbiAqICAgICAgICAgIHwgICBfXyAgIHwgICAvICAvX1xcICBcXCAgIHwgIHwgfCAgfCAgICAgICAgICAgICAgXG4gKiAgICAgICAgICB8ICB8ICB8ICB8ICAvICBfX19fXyAgXFwgIHwgIHwgfCAgYC0tLS0uICAgICAgICAgXG4gKiAgICAgICAgICB8X198ICB8X198IC9fXy8gICAgIFxcX19cXCB8X198IHxfX19fX19ffCAgICAgICAgIFxuICogICAgICAgICBfX19fX19fLiBfXyAgLl9fX19fXyAgICAgLl9fICAgX18uICAgICAgX19fICAgICAgXG4gKiAgICAgICAgLyAgICAgICB8fCAgfCB8ICAgXyAgXFwgICAgfCAgXFwgfCAgfCAgICAgLyAgIFxcICAgICBcbiAqICAgICAgIHwgICAoLS0tLWB8ICB8IHwgIHxfKSAgfCAgIHwgICBcXHwgIHwgICAgLyAgXiAgXFwgICAgXG4gKiAgICAgICAgXFwgICBcXCAgICB8ICB8IHwgICAgICAvICAgIHwgIC4gYCAgfCAgIC8gIC9fXFwgIFxcICAgXG4gKiAgICAuLS0tLSkgICB8ICAgfCAgfCB8ICB8XFwgIFxcLS0tLXwgIHxcXCAgIHwgIC8gIF9fX19fICBcXCAgXG4gKiAgICB8X19fX19fXy8gICAgfF9ffCB8IF98IGAuX19fX198X198IFxcX198IC9fXy8gICAgIFxcX19cXCBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICovXG5cbiB2YXIgQnJvd3NlckxpbWl0ID0gcmVxdWlyZSgnLi9wcm90by9Ccm93c2VyTGltaXQnKVxuICwgICBOYXYgPSByZXF1aXJlKCcuL3Byb3RvL05hdicpXG4gLCAgIENvbnRlbnQgPSByZXF1aXJlKCcuL3Byb3RvL0NvbnRlbnQnKVxuICwgICBNZWRpYUZpbHRlciA9IHJlcXVpcmUoJy4vcHJvdG8vTWVkaWFGaWx0ZXInKVxuICwgICBTZWFyY2hGaWx0ZXIgPSByZXF1aXJlKCcuL3Byb3RvL1NlYXJjaEZpbHRlcicpXG4gLCAgIFN1YnNjcmliZUZpbHRlciA9IHJlcXVpcmUoJy4vcHJvdG8vU3Vic2NyaWJlRmlsdGVyJylcblxuICwgICBBZ2dyZXNzb3IgPSByZXF1aXJlKCAnLi9wcm90by9BZ2dyZXNzb3InIClcbiA7XG5cbiBCcm93c2VyTGltaXQuaW5pdCgpO1xuXG4oZnVuY3Rpb24oICQgKSB7XG4gICAgXG4gICAgLy8gJCggZnVuY3Rpb24oKSB7XG4gICAgLy8gICAgIHdpbmRvdy5teVN3aXBlID0gJCgnI3N3aXBlV3JhcHBlcicpLlN3aXBlKCkuZGF0YSgnU3dpcGUnKTtcbiAgICAvLyB9KTtcbiAgICBcbiAgICAkKGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIE5hdi5pbml0KCk7XG4gICAgICAgIFxuICAgICAgICBDb250ZW50LmluaXRDb3ZlclVJKCk7XG4gICAgICAgIFxuICAgICAgICBNZWRpYUZpbHRlci5pbml0TWVkaWFMaXN0KCk7XG4gICAgICAgIE1lZGlhRmlsdGVyLmluaXRDb250cnlGaWx0ZXIoKTtcbiAgICAgICAgTWVkaWFGaWx0ZXIuaW5pdEluaXRpYWxTY3JvbGwoKTtcbiAgICAgICAgTWVkaWFGaWx0ZXIuaW5pdE92ZXJsYXlUb2dnbGVyKCk7XG4gICAgICAgIE1lZGlhRmlsdGVyLmluaXRTZWxlY3RNZWRpYUJ5TGFuZygpO1xuICAgICAgICBTZWFyY2hGaWx0ZXIuaW5pdE92ZXJsYXlUb2dnbGVyKCk7XG4gICAgICAgIFN1YnNjcmliZUZpbHRlci5pbml0KCk7XG5cbiAgICAgICAgaWYgKCQoICcjbWFpbicgKS5oYXNDbGFzcyggJ2xhdGVzdC1tYWluJyApKSBBZ2dyZXNzb3IuZ2V0RmVlZCggJ2xhdGVzdCcgKTtcbiAgICAgICAgZWxzZSBpZiAoJCggJyNtYWluJyApLmhhc0NsYXNzKCAnZmVhdHVyZWQtbWFpbicgKSkgQWdncmVzc29yLmdldEZlZWQoICdmZWF0dXJlZCcgKTtcbiAgICAgICAgZWxzZSBpZiAoJCggJyNtYWluJyApLmhhc0NsYXNzKCAnc3Vic2NyaWJlZC1tYWluJyApKSBBZ2dyZXNzb3IuZ2V0RmVlZCggJ3N1YnNjcmliZWQnICk7XG5cbiAgICAgICAgLy8gJCgnLnNpZGUtbmF2LXRvZ2dsZXInKS5zaWRlTmF2KCk7XG4gICAgfSk7XG5cbn0pKGpRdWVyeSk7IiwidmFyIEltcHVsc29yID0gcmVxdWlyZSggJy4uL0ltcHVsc29yJyApO1xuXG52YXIgQWdncmVzc29yID0ge1xuICAgIGluaXRGaWx0ZXI6IGluaXRGaWx0ZXIsXG4gICAgZ2V0RmVlZDogZ2V0RmVlZCxcbiAgICBzZXRTdWJzY3JpYmU6IHNldFN1YnNjcmliZSxcbiAgICBzZXRGaWx0ZXJCeVNvdXJjZTogc2V0RmlsdGVyQnlTb3VyY2UsXG4gICAgc2V0RmlsdGVyQnlMYW5nOiBzZXRGaWx0ZXJCeUxhbmcsXG4gICAgcmVuZGVyRGF0YTogcmVuZGVyRGF0YSxcbiAgICBoYW5kbGVFcnJvcjogaGFuZGxlRXJyb3IsXG4gICAgcnVuTG9nOiBydW5Mb2dcbn07XG5cbmZ1bmN0aW9uIGdldEZlZWQoIGZlZWRUeXBlLCB2YWwgKSB7XG4gICAgXG4gICAgZmVlZFR5cGUgPSBmZWVkVHlwZSB8fCAnbGF0ZXN0JztcblxuICAgIHZhciBfc2VsZiA9IHRoaXNcbiAgICAsICAgX3BhcmFtcyA9IHtcbiAgICAgICAgICAgIGs6IHZhbFxuICAgICAgICB9XG4gICAgO1xuXG4gICAgJC5hamF4KHtcbiAgICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgICAgdXJsOiBmZWVkVHlwZSArIFwiLmpzb25cIixcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oIGRhdGEgKSB7XG5cbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCBkYXRhWzBdICk7XG5cbiAgICAgICAgICAgICQoJyNtYWluLXByZWxvYWRlcicpLnRvZ2dsZUNsYXNzKCAnaGlkZGVuJyApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSArKyApIHtcbiAgICAgICAgICAgICAgICBfc2VsZi5yZW5kZXJEYXRhKCBmZWVkVHlwZSwgZGF0YVtpXSApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGVycm9yOiBmdW5jdGlvbigganF4aHIsIHRleHRTdGF0dXMsIGVycm9yICkge1xuICAgICAgICAgICAgX3NlbGYuaGFuZGxlRXJyb3IoIGpxeGhyLCB0ZXh0U3RhdHVzLCBlcnJvciApO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHNldFN1YnNjcmliZSggdmFsICkge1xuXG4gICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICQuYWpheCh7XG4gICAgICAgIHVybDogJ2h0dHA6Ly9yZWFkaW5nYnVsYi5jb20vYXBpL3NldF9zdWJzY3JpYmUnLFxuICAgICAgICBkYXRhOiB7IGs6IHZhbCB9LFxuICAgICAgICB0eXBlOiAnR0VUJyxcbiAgICAgICAgZGF0YVR5cGU6ICdqc29ucCcsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCBkYXRhICk7XG4gICAgICAgICAgICBpZiAoZGF0YS5zdGF0dXM9PVwiYWRkZWRcIikgX3NlbGYuZ2V0RmVlZCggJ3N1YnNjcmliZScsIHZhbCApO1xuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24oIGpxeGhyLCB0ZXh0U3RhdHVzLCBlcnJvciApIHtcbiAgICAgICAgICAgIF9zZWxmLmhhbmRsZUVycm9yKCBqcXhociwgdGV4dFN0YXR1cywgZXJyb3IgKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBpbml0RmlsdGVyKCkge1xuICAgIGlmICghJCggJy5tZWRpYS10b2dnbGVyLWxpbmsnICkubGVuZ3RoICkgcmV0dXJuO1xuXG4gICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgIHZhciAkZWxTb3VyY2VUb2dnbGVyID0gJCggJy5tZWRpYS10b2dnbGVyLWxpbmsnICk7XG5cbiAgICAvLyAkKCcjZmlsdGVyVG9nZ2xlcicpLm9uZSgnY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgLy8gICAgIF9zZWxmLnNldEZpbHRlckJ5TGFuZyggJzEnICk7XG4gICAgLy8gfSk7XG5cbiAgICAkZWxTb3VyY2VUb2dnbGVyLmVhY2goXG4gICAgICAgIGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICAgICQodGhpcykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIF9zZWxmLnNldEZpbHRlckJ5U291cmNlKCAkKHRoaXMpLmRhdGEoJ3ZhbCcpICk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICk7XG59XG5cbmZ1bmN0aW9uIHNldEZpbHRlckJ5TGFuZyggdmFsICkge1xuXG4gICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgIHZhciBfcGFyYW1zID0ge1xuICAgICAgICB0eXBlOiAnbGFuZ3VhZ2UnLFxuICAgICAgICB2YWx1ZTogdmFsICsgJydcbiAgICB9O1xuXG4gICAgJC5hamF4KHtcbiAgICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgICAgdXJsOiBcImh0dHA6Ly9yZWFkaW5nYnVsYi5jb20vYXBpL3NldF9maWx0ZXI/dHlwZT1sYW5ndWFnZSZ2YWx1ZT0xXCIsXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbnAnLFxuICAgICAgICBkYXRhOiBfcGFyYW1zLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiggZGF0YSApIHtcbiAgICAgICAgICAgIF9zZWxmLnJ1bkxvZyhkYXRhKTtcbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCBqcXhociwgdGV4dFN0YXR1cywgZXJyb3IgKSB7XG4gICAgICAgICAgICBfc2VsZi5oYW5kbGVFcnJvcigganF4aHIsIHRleHRTdGF0dXMsIGVycm9yICk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gc2V0RmlsdGVyQnlTb3VyY2UoIHZhbCApIHtcblxuICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICB2YXIgX3BhcmFtcyA9IHtcbiAgICAgICAgdHlwZTogJ3NvdXJjZScsXG4gICAgICAgIHZhbHVlOiB2YWxcbiAgICB9O1xuXG4gICAgJC5hamF4KHtcbiAgICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgICAgdXJsOiBcImh0dHA6Ly9yZWFkaW5nYnVsYi5jb20vYXBpL3NldF9maWx0ZXI/dHlwZT1zb3VyY2UmdmFsdWU9MTk4XCIsXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbnAnLFxuICAgICAgICBkYXRhOiAnJyxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oIGRhdGEgKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyggZGF0YVswXSApO1xuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24oIGpxeGhyLCB0ZXh0U3RhdHVzLCBlcnJvciApIHtcbiAgICAgICAgICAgIF9zZWxmLmhhbmRsZUVycm9yKCBqcXhociwgdGV4dFN0YXR1cywgZXJyb3IgKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiByZW5kZXJEYXRhKCBmZWVkVHlwZSwgZGF0YSApIHtcbiAgICBJbXB1bHNvci5jcmVhdGVNYXJrdXAoIGZlZWRUeXBlLCAkKCcjZmVlZHMtb3V0ZXInKSwgZGF0YSApO1xufVxuXG5mdW5jdGlvbiBydW5Mb2coIGRhdGEgKSB7XG4gICAgY29uc29sZS5sb2coIGRhdGEgKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlRXJyb3IoIGpxeGhyLCB0ZXh0U3RhdHVzLCBlcnJvciApIHtcbiAgICBjb25zb2xlLmxvZyhqcXhocik7XG4gICAgY29uc29sZS5sb2codGV4dFN0YXR1cyk7XG4gICAgY29uc29sZS5sb2coZXJyb3IpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEFnZ3Jlc3NvcjsiLCJ2YXIgQnJvd3NlckxpbWl0ID0ge1xuICAgIGluaXQ6IGluaXRcbn07XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG5cbiAgICBpZiAoIU1vZGVybml6ci50b3VjaCkgeyBcbiAgICAgICAgLy8gdmFyIGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJicm93c2VyLWxpbWl0XCIpO1xuICAgICAgICAvLyBlbC5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCcm93c2VyTGltaXQ7IiwidmFyIENvbnRlbnQgPSB7XG4gICAgaW5pdENvdmVyVUk6IGluaXRDb3ZlclVJXG59O1xuXG5mdW5jdGlvbiBpbml0Q292ZXJVSSgpIHtcbiAgICBpZiAoICEkKCcuY29udGVudC1jb3Zlci1pbWFnZScpLmxlbmd0aCApIHJldHVybjtcblxuICAgIHZhciAkdGFyZ2V0ID0gJCgnLmNvbnRlbnQtY292ZXItaW1hZ2UnKTtcblxuICAgICR0YXJnZXQuZWFjaCggZnVuY3Rpb24oIGkgKSB7XG5cbiAgICAgICAgdmFyIF9zcmMgPSAkKCB0aGlzICkuZGF0YSgnc3JjJyk7XG5cbiAgICAgICAgJCggdGhpcyApLmJhY2tncm91bmQoe1xuICAgICAgICAgICAgc291cmNlOiBfc3JjXG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbnRlbnQ7IiwidmFyIEltcHVsc29yID0ge1xuICAgIGNyZWF0ZU1hcmt1cDogY3JlYXRlTWFya3VwLFxuICAgIHBhcnNlVGltZWFnbzogcGFyc2VUaW1lYWdvLFxuICAgIHRydW5jYXRlQm9keWNvcHk6IHRydW5jYXRlQm9keWNvcHlcbn07XG5cbmZ1bmN0aW9uIHRydW5jYXRlQm9keWNvcHkoICRlbCApIHtcbiAgICBpZiAoIHR5cGVvZiAkKCkuZG90ZG90ZG90KCkgIT09ICdvYmplY3QnICkgcmV0dXJuO1xuXG4gICAgJGVsLmRvdGRvdGRvdCh7XG4gICAgICAgIGVsbGlwc2lzOiAnIC4uLiAnXG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZU1hcmt1cCggbW9kZWxUeXBlLCBjb250ZXh0LCBkYXRhICkge1xuXG4gICAgaWYoICEkKCcubWFya3VwLW1vZGVsJykubGVuZ3RoICkgcmV0dXJuO1xuXG4gICAgY29udGV4dCA9IGNvbnRleHQgfHwgJCgnI2ZlZWRzLW91dGVyJyk7XG5cbiAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgdmFyICRtbSA9ICQoJy5jYXJkLm1hcmt1cC1tb2RlbCcpO1xuXG4gICAgaWYgKCBtb2RlbFR5cGUgPT09ICdmZWF0dXJlZCcgKSB7XG5cbiAgICAgICAgdmFyICRuZXdNbSA9ICRtbS5jbG9uZSgpXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ21hcmt1cC1tb2RlbCcpXG4gICAgICAgICAgICAuZmluZCggJy5jYXJkLWltYWdlIGltZycgKS5hdHRyKCAnc3JjJywgZGF0YS5pbWFnZSApLmVuZCgpXG4gICAgICAgICAgICAuZmluZCggJy5jYXJkLWNvbnRlbnQtdGl0bGUgYScgKS5hdHRyKCAnaHJlZicsIGRhdGEuY29udGVudF91cmwgKS50ZXh0KCBkYXRhLnRpdGxlICkuZW5kKClcbiAgICAgICAgICAgIC5maW5kKCAnLm1ldGEtc291cmNlIGltZycgKS5hdHRyKCAnc3JjJywgZGF0YS5zb3VyY2UuaWNvbl91cmwgKS5lbmQoKVxuICAgICAgICAgICAgLmZpbmQoICcubWV0YS1mcm9tJyApLnRleHQoIGRhdGEuc291cmNlLm5hbWUgKS5lbmQoKVxuICAgICAgICAgICAgLmZpbmQoICcubWV0YS10aW1lYWdvJyApLnRleHQoIF9zZWxmLnBhcnNlVGltZWFnbyggZGF0YS50aW1lX25ld3MgKSApLmVuZCgpXG4gICAgICAgICAgICAuZmluZCggJy5jYXJkLWNvbnRlbnQtc3VtbWFyeSBzcGFuJyApLmh0bWwoIGRhdGEuc3VtbWFyeSApLmVuZCgpXG4gICAgICAgICAgICAuYXBwZW5kVG8oIGNvbnRleHQgKTtcbiAgICB9XG5cbiAgICBlbHNlIGlmICggbW9kZWxUeXBlID09PSAnbGF0ZXN0JyApIHtcblxuICAgICAgICB2YXIgJG5ld01tID0gJG1tLmNsb25lKClcbiAgICAgICAgICAgIC5jbG9uZSgpXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ21hcmt1cC1tb2RlbCcpXG4gICAgICAgICAgICAuZmluZCggJy5jYXJkLWNvbnRlbnQtdGl0bGUgYScgKS5hdHRyKCAnaHJlZicsIGRhdGEuY29udGVudF91cmwgKS50ZXh0KCBkYXRhLnRpdGxlICkuZW5kKClcbiAgICAgICAgICAgIC5maW5kKCAnLm1ldGEtc291cmNlIGltZycgKS5hdHRyKCAnc3JjJywgZGF0YS5zb3VyY2UuaWNvbl91cmwgKS5lbmQoKVxuICAgICAgICAgICAgLmZpbmQoICcubWV0YS1mcm9tJyApLnRleHQoIGRhdGEuc291cmNlLm5hbWUgKS5lbmQoKVxuICAgICAgICAgICAgLmZpbmQoICcubWV0YS10aW1lYWdvJyApLnRleHQoIF9zZWxmLnBhcnNlVGltZWFnbyggZGF0YS50aW1lX25ld3MgKSApLmVuZCgpXG4gICAgICAgICAgICAuYXBwZW5kVG8oIGNvbnRleHQgKTtcbiAgICB9XG5cbiAgICBlbHNlIGlmICggbW9kZWxUeXBlID09PSAnc3Vic2NyaWJlZCcgKSB7XG5cbiAgICAgICAgdmFyICRuZXdNbSA9ICRtbS5jbG9uZSgpXG4gICAgICAgICAgICAuY2xvbmUoKVxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdtYXJrdXAtbW9kZWwnKVxuICAgICAgICAgICAgLmZpbmQoICcuY2FyZC1pbWFnZSBpbWcnICkuYXR0ciggJ3NyYycsIGRhdGEuaW1hZ2UgKS5lbmQoKVxuICAgICAgICAgICAgLmZpbmQoICcuY2FyZC1jb250ZW50LXRpdGxlIGEnICkuYXR0ciggJ2hyZWYnLCBkYXRhLmNvbnRlbnRfdXJsICkudGV4dCggZGF0YS50aXRsZSApLmVuZCgpXG4gICAgICAgICAgICAuZmluZCggJy5tZXRhLXNvdXJjZSBpbWcnICkuYXR0ciggJ3NyYycsIGRhdGEuc291cmNlLmljb25fdXJsICkuZW5kKClcbiAgICAgICAgICAgIC5maW5kKCAnLm1ldGEtZnJvbScgKS50ZXh0KCBkYXRhLnNvdXJjZS5uYW1lICkuZW5kKClcbiAgICAgICAgICAgIC5maW5kKCAnLm1ldGEtdGltZWFnbycgKS50ZXh0KCBfc2VsZi5wYXJzZVRpbWVhZ28oIGRhdGEudGltZV9uZXdzICkgKS5lbmQoKVxuICAgICAgICAgICAgLmZpbmQoICcuY2FyZC1jb250ZW50LXN1bW1hcnkgcCcgKS5odG1sKCBkYXRhLnN1bW1hcnkgKS5lbmQoKVxuICAgICAgICAgICAgLmFwcGVuZFRvKCBjb250ZXh0ICk7XG5cbiAgICAgICAgICAgICQoICcuY2FyZC1pbWFnZSBpbWcnICkuZWFjaChcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiggaSApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAkKCB0aGlzICkuYXR0ciggJ3NyYycgKSA9PT0gJycgKSAkKCB0aGlzICkucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBUcnVuY2F0aW9uc1xuICAgIHZhciAkdG9iZVRydW5jYXRlZCA9ICRuZXdNbS5maW5kKCAnLmNhcmQtY29udGVudC1zdW1tYXJ5IHNwYW4nICk7XG4gICAgaWYgKCAkdG9iZVRydW5jYXRlZC5oZWlnaHQoKSA+IDk2ICkgX3NlbGYudHJ1bmNhdGVCb2R5Y29weSggJHRvYmVUcnVuY2F0ZWQuY2xvc2VzdCggJy5jYXJkLWNvbnRlbnQtc3VtbWFyeScgKSApO1xuICAgIGVsc2UgJHRvYmVUcnVuY2F0ZWQuZmluZCggJy5yZWFkbW9yZScgKS5yZW1vdmUoKTtcblxufVxuXG5mdW5jdGlvbiBwYXJzZVRpbWVhZ28oIG0gKSB7XG4gICAgcmV0dXJuIG1vbWVudCggbSwgJ1lZWVktTU0tREQgSEg6bW06c3MnICkuZnJvbU5vdygpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEltcHVsc29yOyIsInZhciBNZWRpYUZpbHRlciA9IHtcbiAgICBpbml0TWVkaWFMaXN0OiBpbml0TWVkaWFMaXN0LFxuICAgIGluaXRDb250cnlGaWx0ZXI6IGluaXRDb250cnlGaWx0ZXIsXG4gICAgaW5pdEluaXRpYWxTY3JvbGw6IGluaXRJbml0aWFsU2Nyb2xsLFxuICAgIGluaXRPdmVybGF5VG9nZ2xlcjogaW5pdE92ZXJsYXlUb2dnbGVyLFxuICAgIGluaXRTZWxlY3RNZWRpYUJ5TGFuZzogaW5pdFNlbGVjdE1lZGlhQnlMYW5nXG59O1xuXG5mdW5jdGlvbiBpbml0T3ZlcmxheVRvZ2dsZXIoKSB7XG4gICAgaWYgKCAhJCgnLmZpbHRlci1uYXYtb3V0ZXIgI2ZpbHRlclRvZ2dsZXInKS5sZW5ndGggJiZcbiAgICAgICAgICEkKCcuZmlsdGVyLW91dGVyJykubGVuZ3RoXG4gICAgKSByZXR1cm47XG5cbiAgICB2YXIgJHRvZ2dsZXJJbiA9ICQoJyNmaWx0ZXJUb2dnbGVyJylcbiAgICAsICAgJHRvZ2dsZXJPdXQgPSAkKCcuZmlsdGVyLXN1Ym1pdC1idG4sIC5maWx0ZXItb3V0ZXItb3ZlcmxheScpXG4gICAgLCAgICR0b2dnbGVyUGFyZW50ID0gJCgnLmZpbHRlci1uYXYtaW5uZXInKVxuICAgICwgICAkZWwgPSAkKCcuZmlsdGVyLW91dGVyJylcbiAgICA7XG5cbiAgICAkdG9nZ2xlckluLm9uKCAnY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICR0b2dnbGVyUGFyZW50LnJlbW92ZUNsYXNzKCAnYWN0aXZlJyApO1xuXG4gICAgICAgIGlmICggISRlbC5oYXNDbGFzcygnYWN0aXZlJykgKVxuICAgICAgICAgICAgJGVsLmFkZENsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgICAkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ25vLXNjcm9sbCcpO1xuICAgIH0pO1xuXG4gICAgJHRvZ2dsZXJPdXQub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBpZiAoICRlbC5oYXNDbGFzcygnYWN0aXZlJykgKVxuICAgICAgICAgICAgJGVsLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgICAkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ25vLXNjcm9sbCcpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBpbml0TWVkaWFMaXN0KCkge1xuICAgIGlmICggISQoJy5tZWRpYS10b2dnbGVyLWxpbmsnKS5sZW5ndGggKSByZXR1cm47XG5cbiAgICB2YXIgJGVsID0gJCgnLm1lZGlhLXRvZ2dsZXItbGluaycpO1xuXG4gICAgJGVsLmVhY2goXG4gICAgICAgIGZ1bmN0aW9uKGkpIHtcblxuICAgICAgICAgICAgdmFyICRpY29uID0gJCh0aGlzKS5maW5kKCcuaWNvbicpO1xuXG4gICAgICAgICAgICAkKHRoaXMpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICAkaWNvbi50b2dnbGVDbGFzcygnZmEtY2hlY2snKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICApO1xufVxuXG5mdW5jdGlvbiBpbml0Q29udHJ5RmlsdGVyKCkge1xuICAgIGlmICggISQoJy5maWx0ZXItc2VsJykubGVuZ3RoICkgcmV0dXJuO1xuXG4gICAgJCgnI2ZpbHRlckJ5Q291bnRyeScpXG4gICAgICAgIC5kcm9wZG93bih7XG4gICAgICAgICAgICBtb2JpbGU6IHRydWUsXG4gICAgICAgICAgICBsYWJlbDogJ1NlbGVjdCBDb3VudHJ5J1xuICAgICAgICB9KTtcblxuICAgICQoJyNmaWx0ZXJCeUxhbmcnKVxuICAgICAgICAuZHJvcGRvd24oe1xuICAgICAgICAgICAgbW9iaWxlOiB0cnVlLFxuICAgICAgICAgICAgbGFiZWw6ICdTZWxlY3QgTGFuZ3VhZ2UnXG4gICAgICAgIH0pO1xufVxuXG5mdW5jdGlvbiBpbml0SW5pdGlhbFNjcm9sbCgpIHtcbiAgICBpZiAoICEkKCcuZmlsdGVyLWluaXRpYWwtb3V0ZXIgLmZpbHRlci1pbml0aWFsLWxpbmsnKS5sZW5ndGggJiZcbiAgICAgICAgICEkKCcuZmlsdGVyLW1lZGlhLW91dGVyIC5tZWRpYS1ncm91cCcpLmxlbmd0aFxuICAgICkgcmV0dXJuO1xuXG4gICAgdmFyICR0YXJnZXRzID0gJCgnLmZpbHRlci1tZWRpYS1vdXRlci5zZWxlY3RlZCAubWVkaWEtZ3JvdXAnKVxuICAgICwgICAkaW5pdGlhbHMgPSAkKCcuZmlsdGVyLWluaXRpYWwtb3V0ZXIgLmZpbHRlci1pbml0aWFsLWxpbmsnKVxuICAgIDtcblxuICAgICRpbml0aWFscy5lYWNoKCBmdW5jdGlvbihpKSB7XG4gICAgICAgIHZhciAkZWwgPSAkKHRoaXMpXG4gICAgICAgICwgICBfaW5pdGlhbCA9ICRlbC5kYXRhKCdpbml0aWFsLWxpbmsnKVxuICAgICAgICAsICAgVGFyZ2V0ID0ge31cbiAgICAgICAgO1xuXG4gICAgICAgICRlbC5vbiggJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAvLyBTZXQgdGhlIGVsZW1lbnRcbiAgICAgICAgICAgIFRhcmdldC4kZWwgPSAkdGFyZ2V0cy5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCBpICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICQodGhpcykuYXR0cignZGF0YS1pbml0aWFsJykgPT09IF9pbml0aWFsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgLy8gR2V0IGl0cyBvZmZzZXQgdG9wXG4gICAgICAgICAgICBUYXJnZXQudG9wID0gVGFyZ2V0LiRlbC5vZmZzZXQoKS50b3A7XG5cbiAgICAgICAgICAgIC8vIEdldCB0aGUgc2Nyb2xsVG9wIG9mZnNldFxuICAgICAgICAgICAgVGFyZ2V0Lm9mZnNldCA9ICQoJy5maWx0ZXItbWVkaWEtb3V0ZXInKS5vZmZzZXQoKS50b3AgfHwgMDtcblxuICAgICAgICAgICAgc2Nyb2xsT3V0ZXIoIFRhcmdldCApO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIHNjcm9sbE91dGVyKCBkYXRhICkge1xuXG4gICAgICAgIGRhdGEgPSBkYXRhIHx8IHt9O1xuICAgICAgICBkYXRhLm9mZnNldCA9IGRhdGEub2Zmc2V0IHx8IDA7XG4gICAgICAgIGRhdGEudG9wID0gZGF0YS50b3AgfHwgMDtcblxuICAgICAgICB2YXIgdmFsID0gZGF0YS50b3AgLSBkYXRhLm9mZnNldFxuICAgICAgICAsICAgJG91dGVyID0gJCgnLmZpbHRlci1tZWRpYS1vdXRlcicpO1xuXG4gICAgICAgICRvdXRlci5hbmltYXRlKFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogJys9JyArIHZhbCArICcnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ3Nsb3cnXG4gICAgICAgICk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBpbml0U2VsZWN0TWVkaWFCeUxhbmcoKSB7XG4gICAgaWYgKCAhJCgnLmZpbHRlci1zZWxlY3Qtb3V0ZXIgI2ZpbHRlckJ5TGFuZycpLmxlbmd0aCAmJlxuICAgICAgICAgISQoJy5maWx0ZXItbWVkaWEtb3V0ZXInKS5sZW5ndGhcbiAgICApIHJldHVybjtcblxuICAgIHZhciAkc2VsID0gJCgnI2ZpbHRlckJ5TGFuZycpXG4gICAgLCAgICR0YXJnZXQgPSAkKCcuZmlsdGVyLW1lZGlhLW91dGVyJylcbiAgICA7XG5cbiAgICAkc2VsLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgdmFyIF92YWwgPSAkKHRoaXMpLnZhbCgpXG5cbiAgICAgICAgLCAgJF90YXJnZXQgPSAkKCcuZmlsdGVyLW1lZGlhLW91dGVyJykuZmlsdGVyKFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCBpICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJCh0aGlzKS5hdHRyKCdkYXRhLWxhbmcnKSA9PT0gX3ZhbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApXG4gICAgICAgIDtcblxuICAgICAgICAvLyBjb25zb2xlLmxvZygkX3RhcmdldCk7XG5cbiAgICAgICAgJCgnLmZpbHRlci1tZWRpYS1vdXRlcicpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuICAgICAgICAkX3RhcmdldC5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNZWRpYUZpbHRlcjsiLCJ2YXIgTmF2ID0ge1xuICAgIGluaXQ6IGluaXRcbn07XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG5cbiAgICBmdW5jdGlvbiB0b2dnbGVGaWx0ZXJOYXYoKSB7XG4gICAgICAgIHZhciAkZWwgPSAkKCcuZmlsdGVyLW5hdi1pbm5lcicpO1xuXG4gICAgICAgIGlmICggJGVsLmhhc0NsYXNzKCdhY3RpdmUnKSApIHtcbiAgICAgICAgICAgICRlbC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAkKCcuZmlsdGVyLW5hdi10b2dnbGVyJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgJGVsLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICQoJy5maWx0ZXItbmF2LXRvZ2dsZXInKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAkKCcuZmlsdGVyLW5hdi10b2dnbGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXG4gICAgICAgIGNvbnNvbGUubG9nKCAkKHRoaXMpICk7XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0b2dnbGVGaWx0ZXJOYXYoKTtcbiAgICB9KTtcblxuICAgICQoJy5pcy1oZWFkcm9vbSAubmF2YmFyLWZpeGVkIC5tYWluLW5hdi1vdXRlcicpXG4gICAgICAgIC5oZWFkcm9vbSh7XG4gICAgICAgICAgICBcIm9mZnNldFwiOiA4MCxcbiAgICAgICAgICAgIFwidG9sZXJhbmNlXCI6IDMsXG4gICAgICAgICAgICBcImNsYXNzZXNcIjoge1xuICAgICAgICAgICAgICAgIFwiaW5pdGlhbFwiOiBcIm5hdmJhci1hbmltYXRlZFwiLFxuICAgICAgICAgICAgICAgIFwicGlubmVkXCI6IFwibmF2YmFyLXNsaWRlLWRvd25cIixcbiAgICAgICAgICAgICAgICBcInVucGlubmVkXCI6IFwibmF2YmFyLXNsaWRlLXVwXCIsXG4gICAgICAgICAgICAgICAgXCJ0b3BcIjogXCJuYXZiYXItb24tdG9wXCIsXG4gICAgICAgICAgICAgICAgXCJub3RUb3BcIjogXCJuYXZiYXItbm90LXRvcFwiXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBcIm9uVW5waW5cIjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJCgnLmZpbHRlci1uYXYtaW5uZXInKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgJCgnLmZpbHRlci1uYXYtdG9nZ2xlcicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTmF2OyIsInZhciBTZWFyY2hGaWx0ZXIgPSB7XG4gICAgaW5pdE92ZXJsYXlUb2dnbGVyOiBpbml0T3ZlcmxheVRvZ2dsZXJcbn07XG5cbmZ1bmN0aW9uIGluaXRPdmVybGF5VG9nZ2xlcigpIHtcbiAgICBpZiAoICEkKCcuZmlsdGVyLW5hdi1vdXRlciAjc2VhcmNoVG9nZ2xlcicpLmxlbmd0aCAmJlxuICAgICAgICAgISQoJy5zZWFyY2gtb3V0ZXInKS5sZW5ndGhcbiAgICApIHJldHVybjtcblxuICAgIHZhciAkdG9nZ2xlckluID0gJCgnI3NlYXJjaFRvZ2dsZXInKVxuICAgICwgICAkdG9nZ2xlck91dCA9ICQoJy5zZWFyY2gtc3VibWl0LWJ0biwgLnNlYXJjaC1vdXRlci1vdmVybGF5JylcbiAgICAsICAgJHRvZ2dsZXJQYXJlbnQgPSAkKCcuZmlsdGVyLW5hdi1pbm5lcicpXG4gICAgLCAgICRlbCA9ICQoJy5zZWFyY2gtb3V0ZXInKVxuICAgIDtcblxuICAgICR0b2dnbGVySW4ub24oICdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgJHRvZ2dsZXJQYXJlbnQucmVtb3ZlQ2xhc3MoICdhY3RpdmUnICk7XG5cbiAgICAgICAgaWYgKCAhJGVsLmhhc0NsYXNzKCdhY3RpdmUnKSApXG4gICAgICAgICAgICAkZWwuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICQoJ2JvZHknKS50b2dnbGVDbGFzcygnbm8tc2Nyb2xsJyk7XG4gICAgfSk7XG5cbiAgICAkdG9nZ2xlck91dC5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgY29uc29sZS5sb2codGhpcyk7XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGlmICggJGVsLmhhc0NsYXNzKCdhY3RpdmUnKSApXG4gICAgICAgICAgICAkZWwucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICQoJ2JvZHknKS50b2dnbGVDbGFzcygnbm8tc2Nyb2xsJyk7XG4gICAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2VhcmNoRmlsdGVyOyIsInZhciBTdWJzY3JpYmVGaWx0ZXIgPSB7XG4gICAgaW5pdDogaW5pdFxufTtcblxuZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBpZiAoICEkKCcjc2ZTZWxlY3RlZCcpLmxlbmd0aCApIHJldHVybjtcblxuICAgIHZhciAkc2ZTZWxlY3RlZCA9ICQoJyNzZlNlbGVjdGVkJylcbiAgICAsICAgJHNmVG9nZ2xlciAgPSAkKCcuc2YtdG9nZ2xlcicpXG4gICAgLCAgICRzZklucHV0T3V0ZXIgPSAkKCcuc2YtaW5wdXQtb3V0ZXInKVxuICAgICwgICAkc2ZJbnB1dFJvd091dGVycyA9ICQoJy5zZi1pbnB1dC1yb3ctb3V0ZXInKVxuICAgIDtcblxuICAgICRzZlNlbGVjdGVkXG4gICAgICAgIC5kcm9wZG93bih7XG4gICAgICAgICAgICBtb2JpbGU6IHRydWUsXG4gICAgICAgICAgICBsYWJlbDogJ0FkZCBrZXl3b3JkKHMpJ1xuICAgICAgICB9KTtcblxuICAgICRzZlRvZ2dsZXIub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICRzZklucHV0T3V0ZXIudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgIH0pO1xuXG4gICAgdmFyIHJvd04gPSAkc2ZJbnB1dFJvd091dGVycy5sZW5ndGg7XG5cbiAgICAkc2ZJbnB1dFJvd091dGVycy5lYWNoKCBmdW5jdGlvbihpKSB7XG4gICAgICAgIHZhciAkcm93ID0gJCh0aGlzKTtcblxuICAgICAgICAkKHRoaXMpXG4gICAgICAgICAgICAuZmluZCgnLnNmLWlucHV0LXRvZ2dsZXInKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICB2YXIgJHRoaXNSb3cgPSAkKHRoaXMpLnBhcmVudCgpLmNsb3Nlc3QoJy5zZi1pbnB1dC1yb3ctb3V0ZXInKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkdGhpc1Jvdy5hdHRyKCdkYXRhLWNsb25lJykpO1xuXG4gICAgICAgICAgICAgICAgLy8gaWYgKCAkdGhpc1Jvdy52YWwoKSAhPT0gJycgKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgIHZhciBfaW5wdXRWYWwgPSAkKHRoaXMpLnByZXYoJy5zZi1pbnB1dCcpLnZhbCgpO1xuICAgICAgICAgICAgICAgIC8vICAgICB2YXIgJG5ld1JvdyA9ICR0aGlzUm93LmNsb25lKHRydWUpLmFwcGVuZFRvKCAkc2ZJbnB1dE91dGVyICk7XG4gICAgICAgICAgICAgICAgLy8gICAgICRuZXdSb3cuZmluZCgnLnNmLWlucHV0JykudmFsKCcnKTtcbiAgICAgICAgICAgICAgICAvLyAgICAgJHRoaXNSb3cuYXR0cignZGF0YS1jbG9uZScsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vICAgICAkdGhpc1Jvdy5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICB9KVxuICAgIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFN1YnNjcmliZUZpbHRlcjsiXX0=
