$(document).ready(function() {
    $('a[data-lightbox]').lightbox();
    
    $.extend($.fn.lightbox, {
        resize: true,
        fadeDuration: 300,
        slideDuration: 300
    });
    
    $(document).on('lightbox:open', function() {
        console.log('Lightbox opened');
    });
    
    $(document).on('lightbox:close', function() {
        console.log('Lightbox closed');
    });
});

$(window).on('load', function() {
    if ($('a[data-lightbox]').length > 0) {
        $('a[data-lightbox]').lightbox();
    }
});