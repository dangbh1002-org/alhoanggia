/**
 * Created by Brian Dhang on 21-Jun-17.
 */

angular.module('footer').service('$svgDraw', function () {

    //svg draw
    this.draw =  function($newItem,$color,$hover) {
        var newItem = eval('$("'+$newItem+' path")');

        var pathLength = document.querySelector($newItem+' path').getTotalLength();
        var itemHeight = $($newItem).height();
        var windowHeight = $(window).height();
        var offsetTop = newItem.offset().top;

        newItem.css({
            'stroke': $color,
            'stroke-width': '1px',
            'stroke-dasharray': pathLength+'px',
            'stroke-dashoffset': '-'+pathLength+'px',
            'fill': 'transparent'
        });

        setTimeout(
            function()
            {
                if(windowHeight > offsetTop + itemHeight){
                    newItem.css({
                        'fill': $color,
                        'stroke-dashoffset': '0px',
                        'transition': 'stroke-dashoffset 0.5s linear 0.2s, fill 0.4s linear 0.7s'
                    }).hover(function(){
                        $(this).css({'fill': $hover,'stroke': $hover});
                    },function(){
                        $(this).css({'fill': $color,'stroke': $color});
                    });
                }
            }, 0);


        $(window).on('scroll',function(){

            var scrollTop = $(window).scrollTop();

            // phải thêm offsetTop ở đây để lấy offset chuẩn sau khi repeat
            var offsetTop = newItem.offset().top;

            if(scrollTop + windowHeight > offsetTop + itemHeight){

                newItem.css({
                    'fill': $color,
                    'stroke-dashoffset': '0px',
                    'transition': 'stroke-dashoffset 0.5s linear 0.2s, fill 0.4s linear 0.7s'

                }).hover(function(){
                    $(this).css({
                        'fill': $hover,
                        'stroke': $hover,
                        'transition': 'fill 0s, stroke 0s'
                    });
                },function(){
                    $(this).css({
                        'fill': $color,
                        'stroke': $color,
                        'transition': 'fill 0s, stroke 0s'
                    });
                });

            }
            if(scrollTop + windowHeight < offsetTop) {
                newItem.css({
                    'fill': 'transparent',
                    'stroke-dashoffset': '-'+pathLength+'px',
                    'transition': 'stroke-dashoffset 0s linear 0s, fill 0s linear'
                });

            }

        });

    };

});