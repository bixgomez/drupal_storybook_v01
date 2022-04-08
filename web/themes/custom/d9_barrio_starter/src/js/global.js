(($, Drupal) => {
    Drupal.behaviors.global = {

        // shorthand syntax
        attach(context, settings) {
            var mood = 'so-so';

            const world = 'world';

            let destroy;
            destroy = 'create';

            console.log(this);
            console.log(mood, world, destroy);
            console.log('settings: ', settings);

        }

        // don't do - 'this' scopes to window
        // attach: () => {
        //
        // }

        // this is ok
        // attach: function() {
        //
        // }

    }
})(jQuery, Drupal);