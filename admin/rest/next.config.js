const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');
const { i18n } = require('./next-i18next.config');

module.exports = withPWA({
  i18n,
  pwa: {
    disable: process.env.NODE_ENV === 'development',
    dest: 'public',
    runtimeCaching,
  },

  images: {
    domains: [
      'via.placeholder.com',
      'res.cloudinary.com',
      's3.amazonaws.com',
      '18.141.64.26',
      '127.0.0.1',
      'localhost',
      'picsum.photos',
      'pickbazar-sail.test',
      'pickbazarlaravel.s3.ap-southeast-1.amazonaws.com',
      'chawkbazarlaravel.s3.ap-southeast-1.amazonaws.com',
      'lh3.googleusercontent.com',
      '137.184.22.131',
      'a65c-201-220-127-222.sa.ngrok.io',
      'b3a1-201-220-127-222.sa.ngrok.io',
      'ed5b-201-220-127-222.sa.ngrok.io',
      '2787-201-220-127-222.sa.ngrok.io',
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
});
