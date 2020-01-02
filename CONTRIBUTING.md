Contributing
============

Welcome, so you are thinking about contributing?
Awesome, this a great place to start.

Setup
-----

```bash
git clone git@github.com:innovativeinnovation/eat-at-epfl.git
cd eat-at-epfl
npm i
```

Test
----

Cli tests:

```bash
npm t
```

Run
---

```bash
./src/cli.js
```

Release
-------

1. Bump the correct version (`npm version [<newversion> | major | minor | patch]`)
1. Update the file [CHANGELOG.md](CHANGELOG.md)
1. Create the tag (`git tag -a v<version> -m "Tagging the v<version> release"`)
1. Publish with `npm publish`

License
-------

Apache License 2.0

(c) William Belle, 2019-2020.

See the [LICENSE](LICENSE) file for more details.
