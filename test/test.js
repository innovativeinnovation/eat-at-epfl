/*
 * (c) William Belle, 2019-2020.
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
    nextCliOption = ['--date=10/11/2020'];
  });

  it('should match "Cafétéria BC" with -d 10/11/2020', () => {
    response.should.match(/Cafétéria BC/);
    nextCliOption = ['-e', '--date=10/11/2020'];
  });

  it('should match "Sushizen" with -d 10/11/2020 -e', () => {
    response.should.match(/Sushizen/);
    nextCliOption = ['-e', '--language=fr', '--date=10/11/2020'];
  });

  it('should match "sauce teriyaki" with -d 10/11/2020 -e -l fr', () => {
    response.should.match(/sauce teriyaki/);
    nextCliOption = ['--tags=Viande', '--date=11/11/2020'];
  });

  it('should match "beef steak" with -d 11/11/2020 -t Viande', () => {
    response.should.match(/beef steak/);
    nextCliOption = ['--restoId=18', '--date=12/11/2020'];
  });

  it('should match "Cafétéria BC" with -r 18 --date=12/11/2020', () => {
    response.should.match(/Cafétéria BC/);
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
