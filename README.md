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

List the current products published by a banking data holder:

```sh
cdr banking products --holder Alex.Bank
cdr banking products --holder Alex.Bank --category term-deposits
cdr banking products --holder Alex.Bank --effective all
cdr banking products --holder Alex.Bank --search deposit --json
```

`--holder` accepts a Register brand name or identifier, as well as an
unambiguous part of either. It is required because the Register currently
contains many banking product endpoints and querying all of them would make a
large number of network requests. Run `cdr banking products --help` for all
available filters.

## JavaScript API

```js
import { listDataHolders } from "cdr.js";

const holders = await listDataHolders({ industry: "banking" });
```

`listDataHolders()` returns the public brand summaries defined by the
[CDR Register standard][register-standard]. No accreditation or consumer
consent is required for this endpoint.

Query a holder's public banking product API using its `productBaseUri` from the
Register:

```js
import { listBankingProducts } from "cdr.js";

const products = await listBankingProducts(
  "https://public.cdr.alex.com.au",
  { productCategory: "TERM_DEPOSITS" },
);
```

`listBankingProducts()` follows standard pagination and returns a single array
of product summaries. The endpoint is public and does not require consumer
consent. See the [CDR Get Products standard][products-standard] for the fields
and available filters.

[register-standard]: https://consumerdatastandardsaustralia.github.io/standards/#get-data-holder-brands-summary
[products-standard]: https://consumerdatastandardsaustralia.github.io/standards/#get-products

## Disclaimer

This project is not affiliated with or endorsed by the Australian Government.

## License

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE).
