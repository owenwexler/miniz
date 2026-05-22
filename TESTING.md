Please write a comprehensive suite of integration tests using "bun:test" for Mini-Z, a minimal single-file schema validation library.

Mini-Z is to support validation for the following schema types:
- number (options: min (minimum numerical value), max (maximum numerical value)
- string (options: minLength (minimum length), maxLength (maximum length), regex (a regex to match to), startsWith (string must start with these characters), endsWith (string must end with these characters), mustInclude (string must include these characters))
- boolean (no options)
- undefined
- null
- enum (string array)
- symbol
- e-mail (options: pattern (custom regex pattern to validate to))
- url (options: protocol (the protocol to be used, hostname: the hostname that must be used in the URL))
- emoji
- base264
- base264 URL
- hex
- nanoid
- uuid (options: version: UUID version)
- ulid
- cuid
- cuid2
- guid
- hash (options: hashType: 'md5' | 'sha256')
- jwt
- e164 phone numbers
- dates
- timestamps
- IPV4
- IPV6
- IP ranges with CIDR notation
- MAC addresses
- ISO datetime
- ISO date
- ISO time

Refer to README.md and CLAUDE.md for a better idea of what Mini-Z is.

The main file is mz.js, which exports an object called mz.
The tests should import the object as follows.

mz.js is not finished yet.  We want to make development of mz.js test-driven.  All tests should fail on first run and we will make them pass as we develop the library.

Include happy path and sad path tests.  Test valid and invalid inputs for each schema type.  Test valid and invalid inputs for each option field.  Add any options you believe the given schema type   Test a mixed schema with both valid and invalid inputs.  Test a mixed schema with all valid inputs.  Test a mixed schema with all invalid inputs.  All options fields are optional - test all combinations of options and no options.

Write the tests in JavaScript - Mini-Z is written in JavaScript instead of TypeScript for compatibility reasons.

This is an example of the usage syntax that we desire for Mini-Z:

```
import { mz } from 'mz';

const schema = mz.schema({
  id: mz.uuid({ version: 'v4' }), 
  name: mz.string({ minLength: 1, maxLength: 20 }),
  email: mz.email(),
  rank: mz.number({ min: 1, max: 3}),
  createdAt: mz.datetime({ format: 'ISO', precision: -2 })
});

const obj = {
  id: 'c9f7a3da-5825-41d1-89fc-f543ee634e98',
  name: 'Owen Wexler',
  email: 'owenwexler@miniz.dev',
  rank: 1,
  createdAt: '2026-05-22T18:29:00+00:00'
}

const result = mz.parse(obj, schema);
// mz.parse returns either the schema if validation is successful or an { error: ErrorType } object if not successful.  The mz object contains an attached dictionary of returned errors in mz.errors using the documented ErrorType type definition.

```

Please write all tests using the above syntax and test whether the schema or the error object is returned.
