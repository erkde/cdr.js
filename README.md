# cdr.js

Query organisations exposing datasets under Australia's Consumer Data Right
(CDR).

This package is in early development. The first release will focus on public,
unauthenticated product reference data.

## Development

Requires Node.js 22 or newer.

```sh
npm install
npm run build
npm test
node ./bin/cdr.js --help
```

The library is written in TypeScript and compiled to ESM JavaScript with
bundled declaration files for package consumers. It has no runtime
dependencies.

## Command line

List the CDR data-holder brands published by the public CDR Register:

```sh
cdr holders
cdr holders --sector banking
cdr holders --industry banking
cdr holders --search macquarie
cdr holders --json
```

Run `cdr holders --help` for all available options.

## JavaScript API

```js
import { listDataHolders } from "cdr.js";

const holders = await listDataHolders({ industry: "banking" });
```

`listDataHolders()` returns the public brand summaries defined by the
[CDR Register standard][register-standard]. No accreditation or consumer
consent is required for this endpoint.

[register-standard]: https://consumerdatastandardsaustralia.github.io/standards/#get-data-holder-brands-summary

## Disclaimer

This project is not affiliated with or endorsed by the Australian Government.

## License

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE).
