<p align="center">
  <img alt="Eat at EPFL" src="https://raw.githubusercontent.com/innovativeinnovation/eat-at-epfl/master/docs/readme/readme-logo.png">
</p>

<p align="center">
  What to eat at EPFL.
</p>

<p align="center">
  <a href="https://travis-ci.org/innovativeinnovation/eat-at-epfl">
    <img alt="Travis Status" src="https://travis-ci.org/innovativeinnovation/eat-at-epfl.svg?branch=master">
  </a>
  <a href="https://david-dm.org/innovativeinnovation/eat-at-epfl">
    <img alt="Dependencies Status" src="https://david-dm.org/innovativeinnovation/eat-at-epfl/status.svg"/>
  </a>
  <a href="https://raw.githubusercontent.com/innovativeinnovation/eat-at-epfl/master/LICENSE">
    <img alt="Apache License 2.0" src="https://img.shields.io/badge/license-Apache%202.0-blue.svg">
  </a>
  <a href='https://www.npmjs.com/package/eat-at-epfl'>
    <img alt="NPM Version" src="https://img.shields.io/npm/v/eat-at-epfl.svg" />
  </a>
</p>

---

Install
-------

Install this globally and you'll have access to the `eat-at-epfl` command
anywhere on your system.

```bash
npm i eat-at-epfl -g
```

Usage
-----

```console
eat-at-epfl -h
Usage: eat-at-epfl [options]

Options:
  -a, --all       List all restaurants
  -d, --date      A date. Example: 18/04/2019             [string]
  -e, --evening   Evening menus
  -l, --language  Show menus in "en" or "fr"              [string]
  -r, --restoId   Restaurant ID                           [number]
  -t, --tags      A comma separated list of menu types    [string]
  -h, --help      Show help                              [boolean]
  -v, --version   Show version number                    [boolean]

Examples:
  eat-at-epfl
  eat-at-epfl -e -l fr
  eat-at-epfl -t Pizza,Fish
  eat-at-epfl -d 04/05/2019
```

Screenshot
----------

![command line screenshot](https://raw.githubusercontent.com/innovativeinnovation/eat-at-epfl/master/docs/readme/screenshot.png)

See also
--------

* [epfl-menu-api](https://github.com/innovativeinnovation/epfl-menu-api)
* [epfl-menu](https://github.com/gcmalloc/epfl-menu)

Contributing
------------

Contributions are always welcome.

See [Contributing](CONTRIBUTING.md).

Developer
---------

  * [William Belle](https://github.com/williambelle)

License
-------

Apache License 2.0

(c) William Belle, 2019-2020.

See the [LICENSE](LICENSE) file for more details.
