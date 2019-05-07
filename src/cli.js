#!/usr/bin/env node

/*
 * (c) William Belle, 2019.
 * See the LICENSE file for more details.
 */

const epflMenuApi = require('epfl-menu-api');
const moment = require('moment');
const chalk = require('chalk');
const yargs = require('yargs')

  // Date
  .option('d', {
    alias: 'date',
    describe: 'A date. Example: 18/04/2019',
    requiresArg: true,
    type: 'string'
  })

  // Evening
  .option('e', {
    alias: 'evening',
    describe: 'Evening menus'
  })

  // Language
  .option('l', {
    alias: 'language',
    describe: 'Show menus in "en" or "fr"',
    requiresArg: true,
    type: 'string'
  })

  // Resto ID
  .option('r', {
    alias: 'restoId',
    describe: 'Restaurant ID',
    requiresArg: true,
    type: 'number'
  })

  // Tags
  .option('t', {
    alias: 'tags',
    describe: 'A comma separated list of menu types',
    requiresArg: true,
    type: 'string'
  })

  // Version
  .alias('v', 'version')

  // Help
  .help('h')
  .alias('h', 'help')
  .usage('Usage: $0 [options]')
  .example('$0')
  .example('$0 -e')
  .example('$0 -l fr -t Pizza,Poisson')
  .example('$0 --date=04/05/2019');

let argv = yargs.argv;
let opts = {};
opts.language = 'en';
if (argv.e) {
  opts.partOfDay = 'soir';
}
if (argv.l && argv.l === 'fr') {
  opts.language = 'fr';
}
if (isNaN(argv.r) && argv.r !== undefined) {
  yargs.showHelp();
  process.exit(0);
} else {
  if (argv.r !== undefined) {
    opts.restoId = argv.r;
  }
}
if (argv.t) {
  opts.tags = argv.t;
}
if (argv.d) {
  if (moment(argv.d, 'DD/MM/YYYY', true).isValid()) {
    opts.date = argv.d;
  } else {
    yargs.showHelp();
    process.exit(0);
  }
}

var jsonRestos = epflMenuApi.findResto();
var jsonMenus = epflMenuApi.findMenu(opts);

Promise.all([jsonRestos, jsonMenus]).then(values => {
  let listRestoWithPlan = buildListRestoWithPlan(values[0]);
  let listRestoWithListMenu = buildListRestoWithListMenu(values[1]);
  put(listRestoWithPlan, listRestoWithListMenu);
}).catch(function (err) {
  console.log(err);
});

let buildListRestoWithPlan = (jsonRestos) => {
  let listRestoWithPlan = [];
  for (let i = 0; i < jsonRestos.length; i++) {
    let restoName = jsonRestos[i].restoName;
    listRestoWithPlan[restoName] = jsonRestos[i].plan;
  }
  return listRestoWithPlan;
};

let buildListRestoWithListMenu = (jsonMenus) => {
  let listRestoWithListMenu = [];
  for (let i = 0; i < jsonMenus.length; i++) {
    let restoName = jsonMenus[i].restoName;
    if (Array.isArray(listRestoWithListMenu[restoName])) {
      listRestoWithListMenu[restoName].push(jsonMenus[i]);
    } else {
      listRestoWithListMenu[restoName] = [];
      listRestoWithListMenu[restoName].push(jsonMenus[i]);
    }
  }
  return listRestoWithListMenu;
};

let put = (listResto, listMenu) => {
  for (let key in listMenu) {
    try {
      if (listResto[key] !== '') {
        console.log(chalk.blue(key + ' (' + listResto[key] + ')'));
      } else {
        console.log(chalk.blue(key));
      }
    } catch (err) {
      console.log(key);
    }
    for (let j = 0; j < listMenu[key].length; j++) {
      try {
        if (listMenu[key][j].platPrincipal !== '') {
          console.log(
            '    🍽  ' + chalk.green(listMenu[key][j].platPrincipal)
          );
        }
        if (listMenu[key][j].accompLegumes !== '') {
          console.log(
            '       ' + chalk.green(listMenu[key][j].accompLegumes)
          );
        }
        if (listMenu[key][j].accompFeculents !== '') {
          console.log(
            '       ' + chalk.green(listMenu[key][j].accompFeculents)
          );
        }
        if (listMenu[key][j].menuTags !== '') {
          console.log(
            '       ' + chalk.yellow('[Tags: ' +
            listMenu[key][j].menuTags + ']')
          );
        }
      } catch (err) {
        console.log('    ' + listMenu[key][j].platPrincipal);
        console.log('    ' + listMenu[key][j].accompLegumes);
        console.log('    ' + listMenu[key][j].accompFeculents);
        console.log('    [Tags: ' + listMenu[key][j].menuTags + ']');
      }
      console.log('');
    }
  }
};
