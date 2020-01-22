let mix = require('laravel-mix');

mix.js('src/app.js', 'public/build/')
   .babel([
      'src/libs/hammer.min.js',
      'src/libs/cannon.js',
      'src/libs/babylon.max.js',
      'src/libs/babylon.gui.js',
      'src/libs/babylon.addons.js',
   ], 'public/build/vendor.js')
   .setPublicPath('public/build');