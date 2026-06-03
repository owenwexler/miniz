# What is Mini-Z?
Mini-Z is a lightweight single-file minimal schema-validation library designed for use in AlpineJS and other such frameworks that do not have a build step or package management.

Mini-Z uses Bun for testing.  This is the only thing Mini-Z uses Bun for as the point of Mini-Z's existence is to be single-file and dependency-free.  The Bun test runner is as minimal of a testing framework as it gets in the JavaScript/TypeScript ecosystem.

# Why not just use Zod or Yup?
Zod and Yup are packages and require package managers and a build step to install.  Mini-Z provides schema validation at the JavaScript level for most use cases in a single-file package that does not need a build step.  Just copy a single file into your project and import it into your Alpine scripts.

Mini-Z is heavily modeled after Zod but is not an exact copy of Zod.  Think of it as the Preact to Zod's React.

# Stack
LANGUAGE: JavaScript
RUNTIME: Bun (for testing only)
TEST RUNNER: Bun::Test

# Why Mini-Z Uses JavaScript Instead Of TypeScript
Mini-Z is designed to validate schemas at the JS business logic-level for stacks centered around AlpineJS, Datastar, and other libraries that do not have a build step or package management where TypeScript may not be supported at the level where this library is used, so Mini-Z stays written in JavaScript for compatibility reasons.  Nonetheless, the type definitions are extensively documented through comments and JSDocs and the whole point of the package is to validate schemas and provide type safety.  We believe in type safety regardless of whether TypeScript is used or not.

Schema validation should also be done on the backend in whatever backend language being used (e.g. Go, Python, or whatever), but Mini-Z was made to provide schema validation at the Alpine/Datastar level if needed.

# Setup Instructions
- Install Bun if you haven't already
- Run ```bun install``` to install development dependencies.
- Run ```bun tests``` to run the tests.
- That's it.

# Usage

## Installation

Mini-Z has no dependencies and requires no build step. Copy `mz.js` into your project and import it directly.

```js
import { mz } from './mz.js';
```

---

## Core Concepts

### Building a Schema

Call `mz.schema()` with an object where each key maps to a schema-field builder:

```js
const schema = mz.schema({
  id:        mz.uuid({ version: 'v4' }),
  name:      mz.string({ minLength: 1, maxLength: 50 }),
  email:     mz.email(),
  age:       mz.number({ min: 0, max: 120 }),
  createdAt: mz.isoDatetime(),
});
```

### Parsing an Object

Pass the object to validate and the compiled schema to `mz.parse()`:

```js
const result = mz.parse({
  id:        'c9f7a3da-5825-41d1-89fc-f543ee634e98',
  name:      'Owen Wexler',
  email:     'owen@example.com',
  age:       30,
  createdAt: '2026-05-22T18:29:00Z',
}, schema);
```

### The Return Value

`mz.parse()` always returns a plain object. On success the input object is returned as-is. On failure an `error` property is attached describing what went wrong:

```js
// Success — the validated object is returned directly
// result = { id: '...', name: '...', email: '...', age: 30, createdAt: '...' }
// result.error === undefined

// Failure — a structured error object is returned
// result = { error: { code, message, details, hint } }
```

#### Checking the result

```js
const result = mz.parse(input, schema);

if (result.error) {
  console.error(result.error.code);    // e.g. 'invalid_email'
  console.error(result.error.message); // e.g. 'Invalid email address'
  console.error(result.error.hint);    // e.g. 'Provide a valid email address in the format user@domain.tld.'
} else {
  // result is the validated object
  console.log(result.name);
}
```

#### Error object shape

Every error returned by Mini-Z has the same four fields:

| Field | Type | Description |
|---|---|---|
| `code` | string | Machine-readable shorthand for use in conditional logic |
| `message` | string | Short human-readable title |
| `details` | string | Fuller description of what went wrong |
| `hint` | string | Actionable suggestion for fixing the input |

All error objects are also available directly on `mz.errors` (e.g. `mz.errors.invalidEmail`).

---

## Schema Types

### Primitives

#### `mz.number(options?)`
Validates a JavaScript number.

```js
mz.number()                        // any number
mz.number({ min: 0 })              // >= 0
mz.number({ max: 100 })            // <= 100
mz.number({ min: 1, max: 10 })     // between 1 and 10 inclusive
```

| Option | Type | Description |
|---|---|---|
| `min` | number | Inclusive lower bound |
| `max` | number | Inclusive upper bound |

#### `mz.string(options?)`
Validates a JavaScript string.

```js
mz.string()                                      // any string
mz.string({ minLength: 1 })                      // at least 1 character
mz.string({ maxLength: 255 })                    // at most 255 characters
mz.string({ regex: /^[a-z]+$/ })                 // must match pattern
mz.string({ startsWith: 'https' })               // must start with 'https'
mz.string({ endsWith: '.pdf' })                  // must end with '.pdf'
mz.string({ mustInclude: '@' })                  // must contain '@'
mz.string({ minLength: 8, regex: /[A-Z]/ })      // combine options freely
```

| Option | Type | Description |
|---|---|---|
| `minLength` | number | Inclusive minimum character count |
| `maxLength` | number | Inclusive maximum character count |
| `regex` | RegExp | Input must match this pattern |
| `startsWith` | string | Input must begin with this substring |
| `endsWith` | string | Input must end with this substring |
| `mustInclude` | string | Input must contain this substring |

#### `mz.boolean()`
Validates `true` or `false`. Strings and numbers are rejected.

```js
mz.boolean()
```

#### `mz.null()`
Validates that the value is exactly `null`.

#### `mz.undefined()`
Validates that the value is exactly `undefined`.

#### `mz.symbol()`
Validates a JavaScript `Symbol`.

#### `mz.enum(values)`
Validates that the value is one of the provided strings.

```js
mz.enum(['admin', 'user', 'guest'])
```

---

### Identifiers

#### `mz.uuid(options?)`
Validates a UUID (any version by default).

```js
mz.uuid()                    // any UUID
mz.uuid({ version: 'v4' })  // UUID v4 only
mz.uuid({ version: 'v1' })  // UUID v1 only
```

| Option | Type | Description |
|---|---|---|
| `version` | `'v1'`\|`'v2'`\|`'v3'`\|`'v4'`\|`'v5'`\|`'v6'`\|`'v7'` | Require a specific UUID version |

#### `mz.ulid()`
Validates a ULID (26-character Crockford base32 string).

#### `mz.cuid()`
Validates a CUID (starts with `c`, minimum 25 lowercase alphanumeric characters).

#### `mz.cuid2()`
Validates a CUID2 (starts with a lowercase letter, lowercase alphanumeric only, minimum 24 characters).

#### `mz.guid()`
Validates a GUID (same `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` format as UUID, without version enforcement).

#### `mz.nanoid()`
Validates a NanoID (exactly 21 URL-safe characters: `A–Z`, `a–z`, `0–9`, `_`, `-`).

---

### Contact & Web

#### `mz.email(options?)`
Validates an email address.

```js
mz.email()                                           // any valid email
mz.email({ pattern: /^[^@]+@mycompany\.com$/ })     // restrict to a domain
```

| Option | Type | Description |
|---|---|---|
| `pattern` | RegExp | Additional pattern the email must match (applied on top of the default check) |

#### `mz.url(options?)`
Validates a URL.

```js
mz.url()                                       // any valid URL
mz.url({ protocol: 'https' })                 // https only
mz.url({ hostname: 'api.example.com' })       // specific hostname
mz.url({ protocol: 'https', hostname: 'api.example.com' })
```

| Option | Type | Description |
|---|---|---|
| `protocol` | string | Required protocol, e.g. `'https'` (trailing colon optional) |
| `hostname` | string | Required hostname, e.g. `'example.com'` |

#### `mz.e164()`
Validates a phone number in E.164 format: a leading `+` followed by 7–15 digits, no spaces.

```js
mz.e164()  // e.g. '+14155552671', '+447911123456'
```

---

### Encoding Formats

#### `mz.base64()`
Validates a standard base64-encoded string (alphabet `A–Z`, `a–z`, `0–9`, `+`, `/` with optional `=` padding).

#### `mz.base64url()`
Validates a URL-safe base64 string (alphabet `A–Z`, `a–z`, `0–9`, `-`, `_`, no padding).

#### `mz.hex()`
Validates a hexadecimal string (any length, characters `0–9` and `a–f`/`A–F`).

---

### Security Tokens & Hashes

#### `mz.jwt()`
Validates a JSON Web Token — three base64url-encoded segments separated by dots (`header.payload.signature`).

#### `mz.hash(options)`
Validates a hex-encoded hash of a specific type.

```js
mz.hash({ hashType: 'md5' })    // 32-character hex string
mz.hash({ hashType: 'sha256' }) // 64-character hex string
```

| Option | Type | Description |
|---|---|---|
| `hashType` | `'md5'`\|`'sha256'` | The expected hash algorithm (determines required length) |

---

### Dates & Times

#### `mz.date()`
Validates a JavaScript `Date` instance. String and number timestamps are rejected; `Invalid Date` objects are rejected.

```js
mz.date()  // expects new Date(...)
```

#### `mz.timestamp()`
Validates a Unix timestamp — a non-negative integer (no floats, no negative values).

```js
mz.timestamp()  // e.g. 1716393600
```

#### `mz.isoDatetime()`
Validates an ISO 8601 datetime string with a required time component and timezone designator.

```js
mz.isoDatetime()
// Valid:   '2026-05-22T18:29:00Z'
//          '2026-05-22T18:29:00+05:30'
//          '2026-05-22T18:29:00.000Z'
// Invalid: '2026-05-22'   (date only)
```

#### `mz.isoDate()`
Validates an ISO 8601 date string in `YYYY-MM-DD` format. Calendar validity is enforced (e.g. `2026-02-30` is rejected).

```js
mz.isoDate()  // e.g. '2026-05-22'
```

#### `mz.isoTime()`
Validates an ISO 8601 time string in `HH:MM:SS` or `HH:MM:SS.mmm` format. Hours must be 0–23, minutes and seconds 0–59.

```js
mz.isoTime()  // e.g. '18:29:00', '18:29:00.000'
```

---

### Network

#### `mz.ipv4()`
Validates an IPv4 address in dotted-decimal notation. Each octet must be 0–255.

```js
mz.ipv4()  // e.g. '192.168.1.1', '0.0.0.0'
```

#### `mz.ipv6()`
Validates an IPv6 address in full or compressed form.

```js
mz.ipv6()  // e.g. '2001:0db8:85a3::8a2e:0370:7334', '::1'
```

#### `mz.cidr()`
Validates an IP range in CIDR notation. Supports both IPv4 (`/0`–`/32`) and IPv6 (`/0`–`/128`).

```js
mz.cidr()  // e.g. '192.168.1.0/24', '2001:db8::/32'
```

#### `mz.mac()`
Validates a MAC address. Accepts colon-separated (`00:1A:2B:3C:4D:5E`) or hyphen-separated (`00-1A-2B-3C-4D-5E`) formats, case-insensitive.

---

### Special

#### `mz.emoji()`
Validates a string consisting entirely of emoji characters, including ZWJ sequences (e.g. family emoji).

---

## Full Example

```js
import { mz } from './mz.js';

const userSchema = mz.schema({
  id:          mz.uuid({ version: 'v4' }),
  username:    mz.string({ minLength: 3, maxLength: 20 }),
  email:       mz.email(),
  role:        mz.enum(['admin', 'user', 'guest']),
  age:         mz.number({ min: 13 }),
  website:     mz.url({ protocol: 'https' }),
  phone:       mz.e164(),
  ipAddress:   mz.ipv4(),
  createdAt:   mz.isoDatetime(),
  avatarEmoji: mz.emoji(),
});

const result = mz.parse({
  id:          'c9f7a3da-5825-41d1-89fc-f543ee634e98',
  username:    'owenwexler',
  email:       'owen@example.com',
  role:        'admin',
  age:         30,
  website:     'https://example.com',
  phone:       '+14155552671',
  ipAddress:   '203.0.113.42',
  createdAt:   '2026-05-22T18:29:00Z',
  avatarEmoji: '🚀',
}, userSchema);

if (result.error) {
  // Validation failed — inspect the error
  console.error(`[${result.error.code}] ${result.error.message}`);
  console.error(result.error.hint);
} else {
  // Validation passed — result is the validated object
  console.log('Welcome,', result.username);
}
```

---

## Error Codes Reference

| Code | Returned by |
|---|---|
| `type_error` | Any field when the value has the wrong JS type |
| `number_below_min` | `mz.number()` when value < `min` |
| `number_above_max` | `mz.number()` when value > `max` |
| `string_length_below_min` | `mz.string()` when length < `minLength` |
| `string_length_above_max` | `mz.string()` when length > `maxLength` |
| `string_regex_mismatch` | `mz.string()` when value doesn't match `regex` |
| `string_starts_with_mismatch` | `mz.string()` when value doesn't begin with `startsWith` |
| `string_ends_with_mismatch` | `mz.string()` when value doesn't end with `endsWith` |
| `string_must_include_mismatch` | `mz.string()` when value doesn't contain `mustInclude` |
| `enum_mismatch` | `mz.enum()` when value is not in the allowed list |
| `invalid_email` | `mz.email()` |
| `invalid_url` | `mz.url()` when URL format is invalid |
| `url_protocol_mismatch` | `mz.url()` when protocol doesn't match |
| `url_hostname_mismatch` | `mz.url()` when hostname doesn't match |
| `invalid_e164` | `mz.e164()` |
| `invalid_uuid` | `mz.uuid()` when format is wrong |
| `uuid_version_mismatch` | `mz.uuid()` when version doesn't match |
| `invalid_ulid` | `mz.ulid()` |
| `invalid_cuid` | `mz.cuid()` |
| `invalid_cuid2` | `mz.cuid2()` |
| `invalid_guid` | `mz.guid()` |
| `invalid_nanoid` | `mz.nanoid()` |
| `invalid_base64` | `mz.base64()` |
| `invalid_base64url` | `mz.base64url()` |
| `invalid_hex` | `mz.hex()` |
| `invalid_jwt` | `mz.jwt()` |
| `invalid_hash` | `mz.hash()` |
| `invalid_date` | `mz.date()` when `Invalid Date` is passed |
| `invalid_timestamp` | `mz.timestamp()` when value is a float or negative |
| `invalid_iso_datetime` | `mz.isoDatetime()` |
| `invalid_iso_date` | `mz.isoDate()` |
| `invalid_iso_time` | `mz.isoTime()` |
| `invalid_ipv4` | `mz.ipv4()` |
| `invalid_ipv6` | `mz.ipv6()` |
| `invalid_cidr` | `mz.cidr()` |
| `invalid_mac` | `mz.mac()` |
| `invalid_emoji` | `mz.emoji()` |

# The Rest
Refer to CLAUDE.md for code style and other particulars.
