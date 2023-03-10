var StarRatings = (function(window, document, $, undefined){
    'use strict';

    var app = { $stars : {}, $currRating : null };

    app.init = function() {
        $( '.stars-ratings' )
            .each( app.handleRatingForSection )
            .find( '.stars' )
            .on( 'mouseover', app.handleHover )
            .on( 'mouseleave', app.handleOffHover )
            .on( 'click', app.handleClickRating );
    };

    app.handleRatingForSection = function() {
        app.$currRating = $(this);
        var id = app.$currRating.attr( 'id' );

        // Loop through and cache our stars lookups
        app.$stars[ id ] = {};
        for ( var j = 5; j >= 0; j-- ) {
            app.$stars[ id ][ j ] = app.$currRating.find( '[data-stars="'+ j +'"]' );
        }

        var rating = app.$currRating.data( 'rating' );
        var userRating = app.$currRating.data( 'userrating' );

        if ( userRating ) {
            app.$currRating.addClass( 'has-user-rating' );
        }
        // Handle the rating styling
        app.handleRating( userRating ? userRating : rating, id, userRating );
    };

    app.handleRating = function( rating, id, isUserrating ) {
        var ceil = Math.ceil( rating );
        var floor = Math.floor( rating );
        var percent = rating - floor;

        // Remove previous css block for handling percentage stars
        $( '.stars', '#'+ id ).removeClass( 'current-rating user-current-rating' ).find( '.percent' ).removeClass( 'percent' );
        $( document.getElementById( id +'-star-percent-style' ) ).remove();

        // Add current rating
        for (var i = floor; i >= 0; i--) {
            app.$stars[ id ][i].addClass( isUserrating ? 'user-current-rating' : 'current-rating' );
        }

        if ( percent ) {
            // Get star which needs percentage shown
            var $percent_star = app.$stars[ id ][ ceil ].find( '.star-'+ ceil ).addClass( 'percent' );
            // Set width of before attribute to percentage of star
            app.$currRating.append('<style id="'+ id +'-star-percent-style">#'+ id +' .percent:before { width: '+ (percent * 100) +'%;}</style>');
        }
    };

    app.handleHover = function( evt ) {
        var $this = $(this);
        var rating = $this.data( 'stars' );
        var id = $this.parents( '.stars-ratings' ).attr( 'id' );

        for (var i = rating; i >= 0; i--) {
            app.$stars[id][i].addClass( 'active' );
        }
    };

    app.handleOffHover = function( evt ) {
        $(this).parents( '.stars-ratings' ).find( '.stars' ).removeClass( 'active' );
    };

    app.handleClickRating = function( evt ) {
        var $this = $(this);
        var userRating = $this.data( 'stars' );
        app.$currRating = $this.parents( '.stars-ratings' );
        var id = app.$currRating.attr( 'id' );

        // If successful ajax...

        var rating = app.$currRating.data( 'rating' );
        app.$currRating.data( 'userrating', userRating ).addClass( 'has-user-rating' );

        // Handle the rating styling
        app.handleRating( userRating, id, true );

        $this.trigger( 'mouseleave' );
        console.log( id+ ' ajax-set-rating', userRating );
        alert( 'You gave a '+ userRating + ' star rating for '+ id +'!' );
    };

    $(document).ready( app.init );

    return app;

})(window, document, jQuery);