var chai = require('chai');
global.chai = chai;
global.expect = chai.expect;
global.sinon = require('sinon');
var sinonChai = require('sinon-chai');
global.chai.use(sinonChai);
