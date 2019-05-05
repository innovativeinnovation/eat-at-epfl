#!/usr/bin/env node

/*
 * (c) William Belle, 2019.
 * See the LICENSE file for more details.
 */

const epflMenuApi = require('epfl-menu-api');
const chalk = require('chalk');
const yargs = require('yargs')

  // Evening
  .option('e', {
    alias: 'evening',
    describe: 'Evening menus'
  })

  // Version
  .alias('v', 'version')

  // Help
  .help('h')
  .alias('h', 'help')
  .usage('Usage: $0 [options]')
  .example('$0')
  .example('$0 -e');

let argv = yargs.argv;
let opts = {};
if (argv.e) {
  opts.partOfDay = 'soir';
}

epflMenuApi.findMenu(opts).then(function (menus) {
  put(menus);
}).catch(function (err) {
  console.log(err);
});

let put = (menus) => {
  let list = [];
  for (let i = 0; i < menus.length; i++) {
    let resto = menus[i].restoName;
    if (Array.isArray(list[resto])) {
      list[resto].push(menus[i]);
    } else {
      list[resto] = [];
      list[resto].push(menus[i]);
    }
  }

  for (let key in list) {
    try {
      console.log(chalk.blue(key));
    } catch (err) {
      console.log(key);
    }
    for (let j = 0; j < list[key].length; j++) {
      try {
        if (list[key][j].platPrincipal !== '') {
          console.log(
            '    🍽  ' + chalk.green(list[key][j].platPrincipal)
          );
        }
        if (list[key][j].accompLegumes !== '') {
          console.log(
            '       ' + chalk.green(list[key][j].accompLegumes)
          );
        }
        if (list[key][j].accompFeculents !== '') {
          console.log(
            '       ' + chalk.green(list[key][j].accompFeculents)
          );
        }
        if (list[key][j].menuTags !== '') {
          console.log(
            '       ' + chalk.yellow('[Tags: ' +
            list[key][j].menuTags + ']')
          );
        }
      } catch (err) {
        console.log('    ' + list[key][j].platPrincipal);
        console.log('    ' + list[key][j].accompLegumes);
        console.log('    ' + list[key][j].accompFeculents);
        console.log('    [Tags: ' + list[key][j].menuTags + ']');
      }
      console.log('');
    }
  }
};
