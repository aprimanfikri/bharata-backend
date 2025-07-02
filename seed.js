if (process.env.NODE_ENV === 'production') {
  require('./dist/lib/seed.js');
} else {
  require('ts-node').register();
  require('./src/lib/seed.ts');
}
