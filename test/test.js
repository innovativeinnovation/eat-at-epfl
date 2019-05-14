/*
 * (c) William Belle, 2019.
 * See the LICENSE file for more details.
 */

require('chai').should();
const version = require('../package').version;

describe('eat-at-epfl cli', function () {
  this.timeout(15000);
  let nextCliOption = ['-v'];
  let response;

  beforeEach((done) => {
    let execFile = require('child_process').execFile;
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
    nextCliOption = ['--date=18/04/2019'];
  });

  it('should match "Cafétéria BC" with -d 18/04/2019', () => {
    response.should.match(/Cafétéria BC/);
    nextCliOption = ['-e', '--date=18/04/2019'];
  });

  it('should match "Shangri-La" with -d 18/04/2019 -e', () => {
    response.should.match(/Shangri-La/);
    nextCliOption = ['-e', '--language=fr', '--date=18/04/2019'];
  });

  it('should match "Poulet au citron" with -d 18/04/2019 -e -l fr', () => {
    response.should.match(/Poulet au citron/);
    nextCliOption = ['--tags=Viande', '--date=18/04/2019'];
  });

  it('should match "Beef burger" with -d 18/04/2019 -t Viande', () => {
    response.should.match(/Beef burger/);
    nextCliOption = ['--restoId=22', '--date=18/04/2019'];
  });

  it('should match "Le Corbusier" with -r 22 --date=18/04/2019', () => {
    response.should.match(/Le Corbusier/);
    nextCliOption = ['--restoId=bo', '--date=18/04/2019'];
  });

  it('should match "Usage:" with option --date=30/02/2019 -r bo', () => {
    response.should.match(/Usage:/);
  });
});
