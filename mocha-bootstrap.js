var chai = require('chai');
chai.config.includeStack = true;
global.chai = chai;
global.expect = chai.expect;
global.sinon = require('sinon');
var sinonChai = require('sinon-chai');
global.chai.use(sinonChai);
