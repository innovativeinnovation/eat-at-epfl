/*
 * (c) William Belle, 2019.
 * See the LICENSE file for more details.
 */

require('chai').should();
const version = require('../package').version;

describe('who-is-sciper cli', function () {
  this.timeout(15000);
  let cliOption = '-v';
  let response;

  beforeEach((done) => {
    let execFile = require('child_process').execFile;
    execFile('./src/cli.js', [cliOption], (error, stdout) => {
      if (error) {
        throw error;
      }
      response = stdout;
      done();
    });
  });

  it('should match version with option -v', () => {
    response.should.equal(version + '\n');
  });
});
