var chai = require('chai');
var sinonChai = require('sinon-chai');

chai.config.includeStack = true;
global.chai = chai;
global.expect = chai.expect;
global.sinon = require('sinon');
global.chai.use(sinonChai);
