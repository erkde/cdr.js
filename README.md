# cdr.js

Query organisations exposing datasets under Australia's Consumer Data Right
(CDR).

This package is in early development. The first release will focus on public,
unauthenticated product reference data.

## Development

Requires Node.js 22 or newer.

```sh
npm install
npm test
node ./bin/cdr.js --help
```

## Direction

The initial command-line interface is expected to grow around commands such as:

```text
cdr holders
cdr banking products
cdr banking rates
cdr energy plans
```

The same underlying clients will be available through the JavaScript API.

## Disclaimer

This project is not affiliated with or endorsed by the Australian Government.

## License

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE).
