var mock = require('mock-require');

mock(require.resolve('sibling'), require('./mock-sibling'));
