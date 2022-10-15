const { i18n } = require('./next-i18next.config');
const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');
module.exports = withPWA({
  pwa: {
    disable: process.env.NODE_ENV !== 'production',
    dest: 'public',
    runtimeCaching,
  },
  i18n,
  images: {
    domains: [
      'veychi.com',
      '127.0.0.1',
      'localhost',
      'googleusercontent.com',
      'maps.googleapis.com',
      'chawkbazarapi.redq.io',
      'graph.facebook.com',
      'res.cloudinary.com',
      's3.amazonaws.com',
      '18.141.64.26',
      'via.placeholder.com',
      'pickbazarlaravel.s3.ap-southeast-1.amazonaws.com',
      'chawkbazarlaravel.s3.ap-southeast-1.amazonaws.com',
      'picsum.photos',
      'cdninstagram.com',
      'scontent.cdninstagram.com',
      '137.184.22.131',
      'a65c-201-220-127-222.sa.ngrok.io',
      '2787-201-220-127-222.sa.ngrok.io',
      '0830-201-220-127-222.sa.ngrok.io',
    ],
  },

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
});
