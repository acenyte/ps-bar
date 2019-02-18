Drupal.behaviors.myBehavior = {
    attach: function (context, settings) {

        var ajaxBase = settings.ajaxBase;

        jQuery('.v-star', context).once('.v-star').click(function(){
            jQuery(this).toggleClass("active");
            var set = jQuery(this).attr('data-set');
            set = set == 1 ? 0 : 1; 
            jQuery(this).attr('data-set', set);

            jQuery.ajax({
                url: ajaxBase + "/admin/valentines/ajax/status",
                method: "POST",
                data: {
                    id   : jQuery(this).attr('data-id'),
                    mode : jQuery(this).attr('data-mode'),
                    set  : set,
                },
            }).done(function() {
            });
        });

        jQuery('.v-cross', context).once('.v-cross').click(function(){
            jQuery(this).toggleClass("active");
            var set = jQuery(this).attr('data-set');
            set = set == 1 ? 0 : 1; 
            jQuery(this).attr('data-set', set);

            jQuery.ajax({
                url: ajaxBase + "/admin/valentines/ajax/status",
                method: "POST",
                data: {
                    id   : jQuery(this).attr('data-id'),
                    mode : jQuery(this).attr('data-mode'),
                    set  : set,
                },
            }).done(function() {
            });
        });

    }
};