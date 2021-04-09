/*
 * (c) William Belle, 2019-2021.
 * See the LICENSE file for more details.
 */

require('chai').should();
const version = require('../package').version;

describe('eat-at-epfl cli', function () {
  this.timeout(15000);
  let nextCliOption = ['-v'];
  let response;

  beforeEach((done) => {
    const execFile = require('child_process').execFile;
    execFile('./src/cli.js', nextCliOption, (error, stdout, stderr) => {
      if (error) {
        throw error;
      }
      response = stdout || stderr;
      done();
    });
  });

  it('should match version with option -v', () => {
    response.should.equal(version + '\n');
    nextCliOption = ['--date=30/02/2019'];
  });

  it('should match "Usage:" with option --date=30/02/2019', () => {
    response.should.match(/Usage:/);
    nextCliOption = ['--date=08/04/2021'];
  });

  it('should match "L\'Arcadie" with -d 08/04/2021', () => {
    response.should.match(/L'Arcadie/);
    nextCliOption = ['-e', '--date=08/04/2021'];
  });

  it('should match "Sushizen" with -d 08/04/2021 -e', () => {
    response.should.match(/Sushizen/);
    nextCliOption = ['-e', '--language=fr', '--date=08/04/2021'];
  });

  it('should match "Chirashi" with -d 08/04/2021 -e -l fr', () => {
    response.should.match(/Chirashi/);
    nextCliOption = ['--tags=Viande', '--date=08/04/2021'];
  });

  it('should match "Lamb chawarma" with -d 08/04/2021 -t Viande', () => {
    response.should.match(/Lamb chawarma/);
    nextCliOption = ['--restoId=14', '--date=08/04/2021'];
  });

  it('should match "Hong Thaï Rung" with -r 14 --date=08/04/2021', () => {
    response.should.match(/Hong Thaï Rung/);
    nextCliOption = ['--restoId=bo', '--date=18/04/2019'];
  });

  it('should match "Usage:" with option --date=18/04/2019 -r bo', () => {
    response.should.match(/Usage:/);
    nextCliOption = ['-a'];
  });

  it('should match "32. L\'Esplanade (CO160)" with option -a', () => {
    response.should.match(/32. L'Esplanade \(CO160\)/);
  });
});
