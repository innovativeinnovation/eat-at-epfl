#!/usr/bin/env node

/*
 * (c) William Belle, 2019-2021.
 * See the LICENSE file for more details.
 */

const epflMenuApi = require('epfl-menu-api');
const moment = require('moment');
const chalk = require('chalk');
const yargs = require('yargs')

  // List resto
  .option('a', {
    alias: 'all',
    describe: 'List all restaurants'
  })

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

  .option('p', {
    alias: 'pick-random-menu',
    describe: 'Pick a random menu'
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
  .example('$0 -e -l fr')
  .example('$0 -t Pizza,Fish')
  .example('$0 -d 04/05/2019');

const argv = yargs.argv;
const opts = {};

if (argv.a) {
  epflMenuApi.findResto().then(listRestos => {
    listRestos.sort(sortRestoByName);
    putListResto(listRestos);
  });
} else {
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

  const jsonRestos = epflMenuApi.findResto();
  const jsonMenus = epflMenuApi.findMenu(opts);

  Promise.all([jsonRestos, jsonMenus]).then(values => {
    let menuList = values[1];
    if (argv.p && menuList.length > 0) {
      menuList = getRamdomMenu(values[1]);
    }
    const listRestoWithPlan = buildListRestoWithPlan(values[0]);
    const listRestoWithListMenu = buildListRestoWithListMenu(menuList);
    put(listRestoWithPlan, listRestoWithListMenu);
  }).catch(function (err) {
    console.log(err);
  });
}

const getRamdomMenu = (list) => {
  const menu = list[Math.floor(Math.random() * list.length)];
  return [menu];
};

const putListResto = (listResto) => {
  for (let i = 0; i < listResto.length; i++) {
    console.log(chalk.blue(buildRestoLine(
      listResto[i].restoName,
      listResto[i].plan,
      listResto[i].restoID
    )));
  }
};

const sortRestoByName = (a, b) => {
  const nameA = a.restoName.toUpperCase();
  const nameB = b.restoName.toUpperCase();
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
};

const buildListRestoWithPlan = (jsonRestos) => {
  const listRestoWithPlan = [];
  for (let i = 0; i < jsonRestos.length; i++) {
    const restoName = jsonRestos[i].restoName;
    listRestoWithPlan[restoName] = {
      location: jsonRestos[i].plan,
      id: jsonRestos[i].restoID
    };
  }
  return listRestoWithPlan;
};

const buildListRestoWithListMenu = (jsonMenus) => {
  const listRestoWithListMenu = [];
  for (let i = 0; i < jsonMenus.length; i++) {
    const restoName = jsonMenus[i].restoName;
    if (Array.isArray(listRestoWithListMenu[restoName])) {
      listRestoWithListMenu[restoName].push(jsonMenus[i]);
    } else {
      listRestoWithListMenu[restoName] = [];
      listRestoWithListMenu[restoName].push(jsonMenus[i]);
    }
  }
  return listRestoWithListMenu;
};

const buildRestoLine = (name, location, id) => {
  let line = id + '. ' + name;
  if (location !== '') {
    line += ' (' + location + ')';
  }
  return line;
};

const BuildMenuLines = (name, pos, listMenu) => {
  let line = '';
  const menuPart = ['platPrincipal', 'accompFeculents', 'accompLegumes'];
  for (let k = 0; k < menuPart.length; k++) {
    if (listMenu[name][pos][menuPart[k]] !== '') {
      if (menuPart[k] === 'platPrincipal') {
        line += '    🍽  ';
      } else {
        line += '       ';
      }
      line += listMenu[name][pos][menuPart[k]] + '\n';
    }
  }
  return line;
};

const BuildTagsLine = (name, pos, listMenu) => {
  let line = '';
  if (listMenu[name][pos].menuTags !== '') {
    let tags = listMenu[name][pos].menuTags;
    if (argv.l !== 'fr') {
      tags = epflMenuApi.translateTags(tags);
    }
    line += '      [Tags: ' + tags + ']\n';
  }
  return line;
};

const put = (listResto, listMenu) => {
  for (const key in listMenu) {
    console.log(chalk.blue(buildRestoLine(
      key, listResto[key].location, listResto[key].id
    )));
    for (let j = 0; j < listMenu[key].length; j++) {
      console.log(
        chalk.green(BuildMenuLines(key, j, listMenu)),
        chalk.yellow(BuildTagsLine(key, j, listMenu))
      );
    }
  }
};
