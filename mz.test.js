import { test, expect, describe } from 'bun:test';
import { mz } from './mz';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ok = (result, expectedData) => {
  expect(result.error).toBeUndefined();
  expect(result).toEqual(expectedData);
};

const fail = (result, expectedCode) => {
  expect(result.error).not.toBeUndefined();
  if (expectedCode) {
    expect(result.error.code).toBe(expectedCode);
  }
};

// ---------------------------------------------------------------------------
// Smoke tests
// ---------------------------------------------------------------------------

test('mz object exists and has required properties', () => {
  expect(mz).toBeDefined();
  expect(mz).toHaveProperty('errors');
  expect(mz).toHaveProperty('parse');
  expect(mz).toHaveProperty('schema');
});

// ---------------------------------------------------------------------------
// mz.number
// ---------------------------------------------------------------------------

describe('mz.number', () => {
  test('valid number, no options', () => {
    const schema = mz.schema({ n: mz.number() });
    ok(mz.parse({ n: 42 }, schema), { n: 42 });
  });

  test('valid number at min boundary', () => {
    const schema = mz.schema({ n: mz.number({ min: 0 }) });
    ok(mz.parse({ n: 0 }, schema), { n: 0 });
  });

  test('valid number at max boundary', () => {
    const schema = mz.schema({ n: mz.number({ max: 100 }) });
    ok(mz.parse({ n: 100 }, schema), { n: 100 });
  });

  test('valid number within min and max', () => {
    const schema = mz.schema({ n: mz.number({ min: 1, max: 10 }) });
    ok(mz.parse({ n: 5 }, schema), { n: 5 });
  });

  test('invalid: string instead of number', () => {
    const schema = mz.schema({ n: mz.number() });
    fail(mz.parse({ n: 'hello' }, schema), 'type_error');
  });

  test('invalid: number below min', () => {
    const schema = mz.schema({ n: mz.number({ min: 5 }) });
    fail(mz.parse({ n: 3 }, schema), 'number_below_min');
  });

  test('invalid: number above max', () => {
    const schema = mz.schema({ n: mz.number({ max: 10 }) });
    fail(mz.parse({ n: 99 }, schema), 'number_above_max');
  });

  test('invalid: null instead of number', () => {
    const schema = mz.schema({ n: mz.number() });
    fail(mz.parse({ n: null }, schema), 'type_error');
  });

  test('valid: negative number', () => {
    const schema = mz.schema({ n: mz.number({ min: -100, max: -1 }) });
    ok(mz.parse({ n: -50 }, schema), { n: -50 });
  });

  test('valid: float', () => {
    const schema = mz.schema({ n: mz.number({ min: 0.1, max: 0.9 }) });
    ok(mz.parse({ n: 0.5 }, schema), { n: 0.5 });
  });
});

// ---------------------------------------------------------------------------
// mz.string
// ---------------------------------------------------------------------------

describe('mz.string', () => {
  test('valid string, no options', () => {
    const schema = mz.schema({ s: mz.string() });
    ok(mz.parse({ s: 'hello' }, schema), { s: 'hello' });
  });

  test('valid string at minLength boundary', () => {
    const schema = mz.schema({ s: mz.string({ minLength: 3 }) });
    ok(mz.parse({ s: 'abc' }, schema), { s: 'abc' });
  });

  test('valid string at maxLength boundary', () => {
    const schema = mz.schema({ s: mz.string({ maxLength: 5 }) });
    ok(mz.parse({ s: 'hello' }, schema), { s: 'hello' });
  });

  test('valid string within minLength and maxLength', () => {
    const schema = mz.schema({ s: mz.string({ minLength: 2, maxLength: 10 }) });
    ok(mz.parse({ s: 'hi there' }, schema), { s: 'hi there' });
  });

  test('valid string matching regex', () => {
    const schema = mz.schema({ s: mz.string({ regex: /^[a-z]+$/ }) });
    ok(mz.parse({ s: 'lowercase' }, schema), { s: 'lowercase' });
  });

  test('valid string with startsWith', () => {
    const schema = mz.schema({ s: mz.string({ startsWith: 'Hello' }) });
    ok(mz.parse({ s: 'Hello World' }, schema), { s: 'Hello World' });
  });

  test('valid string with endsWith', () => {
    const schema = mz.schema({ s: mz.string({ endsWith: 'World' }) });
    ok(mz.parse({ s: 'Hello World' }, schema), { s: 'Hello World' });
  });

  test('valid string with mustInclude', () => {
    const schema = mz.schema({ s: mz.string({ mustInclude: 'ello' }) });
    ok(mz.parse({ s: 'Hello World' }, schema), { s: 'Hello World' });
  });

  test('valid string with all options', () => {
    const schema = mz.schema({
      s: mz.string({
        minLength: 5,
        maxLength: 20,
        startsWith: 'Hi',
        endsWith: '!',
        mustInclude: 'there',
        regex: /^Hi there!$/
      })
    });
    ok(mz.parse({ s: 'Hi there!' }, schema), { s: 'Hi there!' });
  });

  test('invalid: number instead of string', () => {
    const schema = mz.schema({ s: mz.string() });
    fail(mz.parse({ s: 42 }, schema), 'type_error');
  });

  test('invalid: string below minLength', () => {
    const schema = mz.schema({ s: mz.string({ minLength: 5 }) });
    fail(mz.parse({ s: 'hi' }, schema), 'string_length_below_min');
  });

  test('invalid: string above maxLength', () => {
    const schema = mz.schema({ s: mz.string({ maxLength: 3 }) });
    fail(mz.parse({ s: 'toolongstring' }, schema), 'string_length_above_max');
  });

  test('invalid: string does not match regex', () => {
    const schema = mz.schema({ s: mz.string({ regex: /^[0-9]+$/ }) });
    fail(mz.parse({ s: 'abc' }, schema), 'string_regex_mismatch');
  });

  test('invalid: string does not start with required prefix', () => {
    const schema = mz.schema({ s: mz.string({ startsWith: 'Hello' }) });
    fail(mz.parse({ s: 'Goodbye World' }, schema), 'string_starts_with_mismatch');
  });

  test('invalid: string does not end with required suffix', () => {
    const schema = mz.schema({ s: mz.string({ endsWith: '!' }) });
    fail(mz.parse({ s: 'Hello World' }, schema), 'string_ends_with_mismatch');
  });

  test('invalid: string does not include required substring', () => {
    const schema = mz.schema({ s: mz.string({ mustInclude: 'xyz' }) });
    fail(mz.parse({ s: 'Hello World' }, schema), 'string_must_include_mismatch');
  });
});

// ---------------------------------------------------------------------------
// mz.boolean
// ---------------------------------------------------------------------------

describe.only('mz.boolean', () => {
  test('valid: true', () => {
    const schema = mz.schema({ b: mz.boolean() });
    ok(mz.parse({ b: true }, schema), { b: true });
  });

  test('valid: false', () => {
    const schema = mz.schema({ b: mz.boolean() });
    ok(mz.parse({ b: false }, schema), { b: false });
  });

  test('invalid: string "true"', () => {
    const schema = mz.schema({ b: mz.boolean() });
    fail(mz.parse({ b: 'true' }, schema), 'type_error');
  });

  test('invalid: number 1', () => {
    const schema = mz.schema({ b: mz.boolean() });
    fail(mz.parse({ b: 1 }, schema), 'type_error');
  });

  test('invalid: null', () => {
    const schema = mz.schema({ b: mz.boolean() });
    fail(mz.parse({ b: null }, schema), 'type_error');
  });
});

// ---------------------------------------------------------------------------
// mz.undefined
// ---------------------------------------------------------------------------

describe('mz.undefined', () => {
  test('valid: undefined value', () => {
    const schema = mz.schema({ u: mz.undefined() });
    ok(mz.parse({ u: undefined }, schema), { u: undefined });
  });

  test('invalid: null instead of undefined', () => {
    const schema = mz.schema({ u: mz.undefined() });
    fail(mz.parse({ u: null }, schema), 'type_error');
  });

  test('invalid: string instead of undefined', () => {
    const schema = mz.schema({ u: mz.undefined() });
    fail(mz.parse({ u: 'hello' }, schema), 'type_error');
  });
});

// ---------------------------------------------------------------------------
// mz.null
// ---------------------------------------------------------------------------

describe('mz.null', () => {
  test('valid: null value', () => {
    const schema = mz.schema({ n: mz.null() });
    ok(mz.parse({ n: null }, schema), { n: null });
  });

  test('invalid: undefined instead of null', () => {
    const schema = mz.schema({ n: mz.null() });
    fail(mz.parse({ n: undefined }, schema), 'type_error');
  });

  test('invalid: 0 instead of null', () => {
    const schema = mz.schema({ n: mz.null() });
    fail(mz.parse({ n: 0 }, schema), 'type_error');
  });
});

// ---------------------------------------------------------------------------
// mz.enum
// ---------------------------------------------------------------------------

describe('mz.enum', () => {
  test('valid: value in enum', () => {
    const schema = mz.schema({ role: mz.enum(['admin', 'user', 'guest']) });
    ok(mz.parse({ role: 'admin' }, schema), { role: 'admin' });
  });

  test('valid: last value in enum', () => {
    const schema = mz.schema({ role: mz.enum(['admin', 'user', 'guest']) });
    ok(mz.parse({ role: 'guest' }, schema), { role: 'guest' });
  });

  test('invalid: value not in enum', () => {
    const schema = mz.schema({ role: mz.enum(['admin', 'user', 'guest']) });
    fail(mz.parse({ role: 'superadmin' }, schema), 'enum_mismatch');
  });

  test('invalid: number when enum is strings', () => {
    const schema = mz.schema({ role: mz.enum(['admin', 'user']) });
    fail(mz.parse({ role: 1 }, schema), 'enum_mismatch');
  });

  test('invalid: empty string when not in enum', () => {
    const schema = mz.schema({ role: mz.enum(['admin', 'user']) });
    fail(mz.parse({ role: '' }, schema), 'enum_mismatch');
  });
});

// ---------------------------------------------------------------------------
// mz.symbol
// ---------------------------------------------------------------------------

describe('mz.symbol', () => {
  test('valid: symbol value', () => {
    const sym = Symbol('test');
    const schema = mz.schema({ s: mz.symbol() });
    ok(mz.parse({ s: sym }, schema), { s: sym });
  });

  test('invalid: string instead of symbol', () => {
    const schema = mz.schema({ s: mz.symbol() });
    fail(mz.parse({ s: 'test' }, schema), 'type_error');
  });

  test('invalid: number instead of symbol', () => {
    const schema = mz.schema({ s: mz.symbol() });
    fail(mz.parse({ s: 42 }, schema), 'type_error');
  });
});

// ---------------------------------------------------------------------------
// mz.email
// ---------------------------------------------------------------------------

describe('mz.email', () => {
  test('valid email, no options', () => {
    const schema = mz.schema({ e: mz.email() });
    ok(mz.parse({ e: 'user@example.com' }, schema), { e: 'user@example.com' });
  });

  test('valid email with subdomain', () => {
    const schema = mz.schema({ e: mz.email() });
    ok(mz.parse({ e: 'user@mail.example.com' }, schema), { e: 'user@mail.example.com' });
  });

  test('valid email with plus addressing', () => {
    const schema = mz.schema({ e: mz.email() });
    ok(mz.parse({ e: 'user+tag@example.com' }, schema), { e: 'user+tag@example.com' });
  });

  test('valid email matching custom pattern', () => {
    const schema = mz.schema({ e: mz.email({ pattern: /^[^@]+@miniz\.dev$/ }) });
    ok(mz.parse({ e: 'hello@miniz.dev' }, schema), { e: 'hello@miniz.dev' });
  });

  test('invalid: missing @', () => {
    const schema = mz.schema({ e: mz.email() });
    fail(mz.parse({ e: 'notanemail' }, schema), 'invalid_email');
  });

  test('invalid: missing domain', () => {
    const schema = mz.schema({ e: mz.email() });
    fail(mz.parse({ e: 'user@' }, schema), 'invalid_email');
  });

  test('invalid: missing local part', () => {
    const schema = mz.schema({ e: mz.email() });
    fail(mz.parse({ e: '@example.com' }, schema), 'invalid_email');
  });

  test('invalid: does not match custom pattern', () => {
    const schema = mz.schema({ e: mz.email({ pattern: /^[^@]+@miniz\.dev$/ }) });
    fail(mz.parse({ e: 'user@example.com' }, schema), 'invalid_email');
  });

  test('invalid: number instead of email', () => {
    const schema = mz.schema({ e: mz.email() });
    fail(mz.parse({ e: 12345 }, schema), 'type_error');
  });
});

// ---------------------------------------------------------------------------
// mz.url
// ---------------------------------------------------------------------------

describe('mz.url', () => {
  test('valid URL, no options', () => {
    const schema = mz.schema({ u: mz.url() });
    ok(mz.parse({ u: 'https://example.com' }, schema), { u: 'https://example.com' });
  });

  test('valid URL with path and query', () => {
    const schema = mz.schema({ u: mz.url() });
    ok(mz.parse({ u: 'https://example.com/path?q=1' }, schema), { u: 'https://example.com/path?q=1' });
  });

  test('valid URL with required protocol', () => {
    const schema = mz.schema({ u: mz.url({ protocol: 'https' }) });
    ok(mz.parse({ u: 'https://example.com' }, schema), { u: 'https://example.com' });
  });

  test('valid URL with required hostname', () => {
    const schema = mz.schema({ u: mz.url({ hostname: 'example.com' }) });
    ok(mz.parse({ u: 'https://example.com/path' }, schema), { u: 'https://example.com/path' });
  });

  test('valid URL with protocol and hostname', () => {
    const schema = mz.schema({ u: mz.url({ protocol: 'https', hostname: 'example.com' }) });
    ok(mz.parse({ u: 'https://example.com' }, schema), { u: 'https://example.com' });
  });

  test('invalid: plain string not a URL', () => {
    const schema = mz.schema({ u: mz.url() });
    fail(mz.parse({ u: 'not a url' }, schema), 'invalid_url');
  });

  test('invalid: wrong protocol', () => {
    const schema = mz.schema({ u: mz.url({ protocol: 'https' }) });
    fail(mz.parse({ u: 'http://example.com' }, schema), 'url_protocol_mismatch');
  });

  test('invalid: wrong hostname', () => {
    const schema = mz.schema({ u: mz.url({ hostname: 'example.com' }) });
    fail(mz.parse({ u: 'https://other.com' }, schema), 'url_hostname_mismatch');
  });

  test('invalid: number instead of URL', () => {
    const schema = mz.schema({ u: mz.url() });
    fail(mz.parse({ u: 42 }, schema), 'type_error');
  });
});

// ---------------------------------------------------------------------------
// mz.emoji
// ---------------------------------------------------------------------------

describe('mz.emoji', () => {
  test('valid: single emoji', () => {
    const schema = mz.schema({ e: mz.emoji() });
    ok(mz.parse({ e: '😀' }, schema), { e: '😀' });
  });

  test('valid: emoji sequence', () => {
    const schema = mz.schema({ e: mz.emoji() });
    ok(mz.parse({ e: '👨‍👩‍👧‍👦' }, schema), { e: '👨‍👩‍👧‍👦' });
  });

  test('invalid: regular ASCII text', () => {
    const schema = mz.schema({ e: mz.emoji() });
    fail(mz.parse({ e: 'hello' }, schema), 'invalid_emoji');
  });

  test('invalid: number', () => {
    const schema = mz.schema({ e: mz.emoji() });
    fail(mz.parse({ e: 123 }, schema), 'type_error');
  });
});

// ---------------------------------------------------------------------------
// mz.base64
// ---------------------------------------------------------------------------

describe('mz.base64', () => {
  test('valid base64 string', () => {
    const schema = mz.schema({ b: mz.base64() });
    ok(mz.parse({ b: 'SGVsbG8gV29ybGQ=' }, schema), { b: 'SGVsbG8gV29ybGQ=' });
  });

  test('valid base64 with padding', () => {
    const schema = mz.schema({ b: mz.base64() });
    ok(mz.parse({ b: 'dGVzdA==' }, schema), { b: 'dGVzdA==' });
  });

  test('invalid: not base64 (contains spaces)', () => {
    const schema = mz.schema({ b: mz.base64() });
    fail(mz.parse({ b: 'not valid base64!' }, schema), 'invalid_base64');
  });

  test('invalid: number instead of base64', () => {
    const schema = mz.schema({ b: mz.base64() });
    fail(mz.parse({ b: 123 }, schema), 'type_error');
  });
});

// ---------------------------------------------------------------------------
// mz.base64url
// ---------------------------------------------------------------------------

describe('mz.base64url', () => {
  test('valid base64url string', () => {
    const schema = mz.schema({ b: mz.base64url() });
    ok(mz.parse({ b: 'SGVsbG8gV29ybGQ' }, schema), { b: 'SGVsbG8gV29ybGQ' });
  });

  test('valid base64url with hyphens and underscores', () => {
    const schema = mz.schema({ b: mz.base64url() });
    ok(mz.parse({ b: 'abc-def_ghi' }, schema), { b: 'abc-def_ghi' });
  });

  test('invalid: contains + or / (standard base64, not url-safe)', () => {
    const schema = mz.schema({ b: mz.base64url() });
    fail(mz.parse({ b: 'SGVs+bG8/' }, schema), 'invalid_base64url');
  });

  test('invalid: number instead of base64url', () => {
    const schema = mz.schema({ b: mz.base64url() });
    fail(mz.parse({ b: 99 }, schema), 'type_error');
  });
});

// ---------------------------------------------------------------------------
// mz.hex
// ---------------------------------------------------------------------------

describe('mz.hex', () => {
  test('valid lowercase hex', () => {
    const schema = mz.schema({ h: mz.hex() });
    ok(mz.parse({ h: 'deadbeef' }, schema), { h: 'deadbeef' });
  });

  test('valid uppercase hex', () => {
    const schema = mz.schema({ h: mz.hex() });
    ok(mz.parse({ h: 'DEADBEEF' }, schema), { h: 'DEADBEEF' });
  });

  test('valid mixed-case hex', () => {
    const schema = mz.schema({ h: mz.hex() });
    ok(mz.parse({ h: 'DeAdBeEf' }, schema), { h: 'DeAdBeEf' });
  });

  test('invalid: contains non-hex characters', () => {
    const schema = mz.schema({ h: mz.hex() });
    fail(mz.parse({ h: 'zzzzzzzz' }, schema), 'invalid_hex');
  });

  test('invalid: number', () => {
    const schema = mz.schema({ h: mz.hex() });
    fail(mz.parse({ h: 255 }, schema), 'type_error');
  });
});

// ---------------------------------------------------------------------------
// mz.nanoid
// ---------------------------------------------------------------------------

describe('mz.nanoid', () => {
  test('valid nanoid (21 chars, URL-safe alphabet)', () => {
    const schema = mz.schema({ id: mz.nanoid() });
    ok(mz.parse({ id: 'V1StGXR8_Z5jdHi6B-myT' }, schema), { id: 'V1StGXR8_Z5jdHi6B-myT' });
  });

  test('invalid: too short', () => {
    const schema = mz.schema({ id: mz.nanoid() });
    fail(mz.parse({ id: 'short' }, schema), 'invalid_nanoid');
  });

  test('invalid: contains invalid characters', () => {
    const schema = mz.schema({ id: mz.nanoid() });
    fail(mz.parse({ id: 'V1StGXR8!Z5jdHi6B+myT' }, schema), 'invalid_nanoid');
  });

  test('invalid: number', () => {
    const schema = mz.schema({ id: mz.nanoid() });
    fail(mz.parse({ id: 12345 }, schema), 'type_error');
  });
});

// ---------------------------------------------------------------------------
// mz.uuid
// ---------------------------------------------------------------------------

describe('mz.uuid', () => {
  test('valid uuid, no version specified', () => {
    const schema = mz.schema({ id: mz.uuid() });
    ok(mz.parse({ id: 'c9f7a3da-5825-41d1-89fc-f543ee634e98' }, schema), { id: 'c9f7a3da-5825-41d1-89fc-f543ee634e98' });
  });

  test('valid uuid v4', () => {
    const schema = mz.schema({ id: mz.uuid({ version: 'v4' }) });
    ok(mz.parse({ id: 'c9f7a3da-5825-41d1-89fc-f543ee634e98' }, schema), { id: 'c9f7a3da-5825-41d1-89fc-f543ee634e98' });
  });

  test('valid uuid v1', () => {
    const schema = mz.schema({ id: mz.uuid({ version: 'v1' }) });
    ok(mz.parse({ id: '550e8400-e29b-11d4-a716-446655440000' }, schema), { id: '550e8400-e29b-11d4-a716-446655440000' });
  });

  test('valid uuid v5', () => {
    const schema = mz.schema({ id: mz.uuid({ version: 'v5' }) });
    ok(mz.parse({ id: '886313e1-3b8a-5372-9b90-0c9aee199e5d' }, schema), { id: '886313e1-3b8a-5372-9b90-0c9aee199e5d' });
  });

  test('invalid: not a uuid format', () => {
    const schema = mz.schema({ id: mz.uuid() });
    fail(mz.parse({ id: 'not-a-uuid' }, schema), 'invalid_uuid');
  });

  test('invalid: wrong version (v1 expected, v4 given)', () => {
    const schema = mz.schema({ id: mz.uuid({ version: 'v1' }) });
    fail(mz.parse({ id: 'c9f7a3da-5825-41d1-89fc-f543ee634e98' }, schema), 'uuid_version_mismatch');
  });

  test('invalid: number', () => {
    const schema = mz.schema({ id: mz.uuid() });
    fail(mz.parse({ id: 123 }, schema), 'type_error');
  });
});

// ---------------------------------------------------------------------------
// mz.ulid
// ---------------------------------------------------------------------------

describe('mz.ulid', () => {
  test('valid ulid', () => {
    const schema = mz.schema({ id: mz.ulid() });
    ok(mz.parse({ id: '01ARZ3NDEKTSV4RRFFQ69G5FAV' }, schema), { id: '01ARZ3NDEKTSV4RRFFQ69G5FAV' });
  });

  test('invalid: wrong length', () => {
    const schema = mz.schema({ id: mz.ulid() });
    fail(mz.parse({ id: '01ARZ3NDEK' }, schema), 'invalid_ulid');
  });

  test('invalid: contains invalid Crockford base32 characters', () => {
    const schema = mz.schema({ id: mz.ulid() });
    fail(mz.parse({ id: '01ARZ3NDEKTSV4RRFFQ69G5FLO' }, schema), 'invalid_ulid');
  });

  test('invalid: number', () => {
    const schema = mz.schema({ id: mz.ulid() });
    fail(mz.parse({ id: 9999 }, schema), 'type_error');
  });
});

// ---------------------------------------------------------------------------
// mz.cuid
// ---------------------------------------------------------------------------

describe('mz.cuid', () => {
  test('valid cuid', () => {
    const schema = mz.schema({ id: mz.cuid() });
    ok(mz.parse({ id: 'cjld2cyuq0000t3rmniod1foy' }, schema), { id: 'cjld2cyuq0000t3rmniod1foy' });
  });

  test('invalid: does not start with c', () => {
    const schema = mz.schema({ id: mz.cuid() });
    fail(mz.parse({ id: 'xjld2cyuq0000t3rmniod1foy' }, schema), 'invalid_cuid');
  });

  test('invalid: too short', () => {
    const schema = mz.schema({ id: mz.cuid() });
    fail(mz.parse({ id: 'cshort' }, schema), 'invalid_cuid');
  });

  test('invalid: number', () => {
    const schema = mz.schema({ id: mz.cuid() });
    fail(mz.parse({ id: 42 }, schema), 'type_error');
  });
});

// ---------------------------------------------------------------------------
// mz.cuid2
// ---------------------------------------------------------------------------

describe('mz.cuid2', () => {
  test('valid cuid2', () => {
    const schema = mz.schema({ id: mz.cuid2() });
    ok(mz.parse({ id: 'tz4a98xxat96iws9zmbrgj3a' }, schema), { id: 'tz4a98xxat96iws9zmbrgj3a' });
  });

  test('invalid: contains uppercase (cuid2 is lowercase only)', () => {
    const schema = mz.schema({ id: mz.cuid2() });
    fail(mz.parse({ id: 'TZ4A98XXAT96IWS9ZMBRGJ3A' }, schema), 'invalid_cuid2');
  });

  test('invalid: too short', () => {
    const schema = mz.schema({ id: mz.cuid2() });
    fail(mz.parse({ id: 'abc' }, schema), 'invalid_cuid2');
  });

  test('invalid: number', () => {
    const schema = mz.schema({ id: mz.cuid2() });
    fail(mz.parse({ id: 0 }, schema), 'type_error');
  });
});

// ---------------------------------------------------------------------------
// mz.guid
// ---------------------------------------------------------------------------

describe('mz.guid', () => {
  test('valid guid (same format as uuid)', () => {
    const schema = mz.schema({ id: mz.guid() });
    ok(mz.parse({ id: 'c9f7a3da-5825-41d1-89fc-f543ee634e98' }, schema), { id: 'c9f7a3da-5825-41d1-89fc-f543ee634e98' });
  });

  test('valid guid uppercase', () => {
    const schema = mz.schema({ id: mz.guid() });
    ok(mz.parse({ id: 'C9F7A3DA-5825-41D1-89FC-F543EE634E98' }, schema), { id: 'C9F7A3DA-5825-41D1-89FC-F543EE634E98' });
  });

  test('invalid: missing hyphens', () => {
    const schema = mz.schema({ id: mz.guid() });
    fail(mz.parse({ id: 'c9f7a3da582541d189fcf543ee634e98' }, schema), 'invalid_guid');
  });

  test('invalid: number', () => {
    const schema = mz.schema({ id: mz.guid() });
    fail(mz.parse({ id: 99 }, schema), 'type_error');
  });
});

// ---------------------------------------------------------------------------
// mz.hash
// ---------------------------------------------------------------------------

describe('mz.hash', () => {
  test('valid md5 hash', () => {
    const schema = mz.schema({ h: mz.hash({ hashType: 'md5' }) });
    ok(mz.parse({ h: 'd41d8cd98f00b204e9800998ecf8427e' }, schema), { h: 'd41d8cd98f00b204e9800998ecf8427e' });
  });

  test('valid sha256 hash', () => {
    const schema = mz.schema({ h: mz.hash({ hashType: 'sha256' }) });
    ok(mz.parse({ h: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' }, schema), { h: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' });
  });

  test('invalid md5: wrong length (too short)', () => {
    const schema = mz.schema({ h: mz.hash({ hashType: 'md5' }) });
    fail(mz.parse({ h: 'abc123' }, schema), 'invalid_hash');
  });

  test('invalid sha256: wrong length (md5 length given)', () => {
    const schema = mz.schema({ h: mz.hash({ hashType: 'sha256' }) });
    fail(mz.parse({ h: 'd41d8cd98f00b204e9800998ecf8427e' }, schema), 'invalid_hash');
  });

  test('invalid: contains non-hex characters', () => {
    const schema = mz.schema({ h: mz.hash({ hashType: 'md5' }) });
    fail(mz.parse({ h: 'z41d8cd98f00b204e9800998ecf8427e' }, schema), 'invalid_hash');
  });

  test('invalid: number', () => {
    const schema = mz.schema({ h: mz.hash({ hashType: 'md5' }) });
    fail(mz.parse({ h: 12345 }, schema), 'type_error');
  });
});

// ---------------------------------------------------------------------------
// mz.jwt
// ---------------------------------------------------------------------------

describe('mz.jwt', () => {
  test('valid jwt (three base64url parts separated by dots)', () => {
    const schema = mz.schema({ token: mz.jwt() });
    const validJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    ok(mz.parse({ token: validJwt }, schema), { token: validJwt });
  });

  test('invalid: only two parts', () => {
    const schema = mz.schema({ token: mz.jwt() });
    fail(mz.parse({ token: 'header.payload' }, schema), 'invalid_jwt');
  });

  test('invalid: four parts', () => {
    const schema = mz.schema({ token: mz.jwt() });
    fail(mz.parse({ token: 'a.b.c.d' }, schema), 'invalid_jwt');
  });

  test('invalid: not a string', () => {
    const schema = mz.schema({ token: mz.jwt() });
    fail(mz.parse({ token: 123 }, schema), 'type_error');
  });

  test('invalid: empty string', () => {
    const schema = mz.schema({ token: mz.jwt() });
    fail(mz.parse({ token: '' }, schema), 'invalid_jwt');
  });
});

// ---------------------------------------------------------------------------
// mz.e164
// ---------------------------------------------------------------------------

describe('mz.e164', () => {
  test('valid e164 US number', () => {
    const schema = mz.schema({ phone: mz.e164() });
    ok(mz.parse({ phone: '+14155552671' }, schema), { phone: '+14155552671' });
  });

  test('valid e164 UK number', () => {
    const schema = mz.schema({ phone: mz.e164() });
    ok(mz.parse({ phone: '+447911123456' }, schema), { phone: '+447911123456' });
  });

  test('invalid: missing leading +', () => {
    const schema = mz.schema({ phone: mz.e164() });
    fail(mz.parse({ phone: '14155552671' }, schema), 'invalid_e164');
  });

  test('invalid: contains spaces', () => {
    const schema = mz.schema({ phone: mz.e164() });
    fail(mz.parse({ phone: '+1 415 555 2671' }, schema), 'invalid_e164');
  });

  test('invalid: too long (over 15 digits)', () => {
    const schema = mz.schema({ phone: mz.e164() });
    fail(mz.parse({ phone: '+12345678901234567' }, schema), 'invalid_e164');
  });

  test('invalid: number type', () => {
    const schema = mz.schema({ phone: mz.e164() });
    fail(mz.parse({ phone: 14155552671 }, schema), 'type_error');
  });
});

// ---------------------------------------------------------------------------
// mz.date
// ---------------------------------------------------------------------------

describe('mz.date', () => {
  test('valid JS Date object', () => {
    const d = new Date('2026-05-22');
    const schema = mz.schema({ d: mz.date() });
    ok(mz.parse({ d }, schema), { d });
  });

  test('invalid: date string instead of Date object', () => {
    const schema = mz.schema({ d: mz.date() });
    fail(mz.parse({ d: '2026-05-22' }, schema), 'type_error');
  });

  test('invalid: number (unix timestamp) instead of Date object', () => {
    const schema = mz.schema({ d: mz.date() });
    fail(mz.parse({ d: 1716393600 }, schema), 'type_error');
  });

  test('invalid: Invalid Date', () => {
    const schema = mz.schema({ d: mz.date() });
    fail(mz.parse({ d: new Date('not-a-date') }, schema), 'invalid_date');
  });
});

// ---------------------------------------------------------------------------
// mz.timestamp
// ---------------------------------------------------------------------------

describe('mz.timestamp', () => {
  test('valid unix timestamp (positive integer)', () => {
    const schema = mz.schema({ ts: mz.timestamp() });
    ok(mz.parse({ ts: 1716393600 }, schema), { ts: 1716393600 });
  });

  test('valid unix timestamp (0 epoch)', () => {
    const schema = mz.schema({ ts: mz.timestamp() });
    ok(mz.parse({ ts: 0 }, schema), { ts: 0 });
  });

  test('invalid: string timestamp', () => {
    const schema = mz.schema({ ts: mz.timestamp() });
    fail(mz.parse({ ts: '1716393600' }, schema), 'type_error');
  });

  test('invalid: float timestamp', () => {
    const schema = mz.schema({ ts: mz.timestamp() });
    fail(mz.parse({ ts: 1716393600.5 }, schema), 'invalid_timestamp');
  });

  test('invalid: negative timestamp', () => {
    const schema = mz.schema({ ts: mz.timestamp() });
    fail(mz.parse({ ts: -1 }, schema), 'invalid_timestamp');
  });
});

// ---------------------------------------------------------------------------
// mz.ipv4
// ---------------------------------------------------------------------------

describe('mz.ipv4', () => {
  test('valid IPv4', () => {
    const schema = mz.schema({ ip: mz.ipv4() });
    ok(mz.parse({ ip: '192.168.1.1' }, schema), { ip: '192.168.1.1' });
  });

  test('valid IPv4 loopback', () => {
    const schema = mz.schema({ ip: mz.ipv4() });
    ok(mz.parse({ ip: '127.0.0.1' }, schema), { ip: '127.0.0.1' });
  });

  test('valid IPv4 all zeros', () => {
    const schema = mz.schema({ ip: mz.ipv4() });
    ok(mz.parse({ ip: '0.0.0.0' }, schema), { ip: '0.0.0.0' });
  });

  test('invalid: out-of-range octet', () => {
    const schema = mz.schema({ ip: mz.ipv4() });
    fail(mz.parse({ ip: '999.168.1.1' }, schema), 'invalid_ipv4');
  });

  test('invalid: only three octets', () => {
    const schema = mz.schema({ ip: mz.ipv4() });
    fail(mz.parse({ ip: '192.168.1' }, schema), 'invalid_ipv4');
  });

  test('invalid: IPv6 address', () => {
    const schema = mz.schema({ ip: mz.ipv4() });
    fail(mz.parse({ ip: '2001:db8::1' }, schema), 'invalid_ipv4');
  });

  test('invalid: number', () => {
    const schema = mz.schema({ ip: mz.ipv4() });
    fail(mz.parse({ ip: 3232235777 }, schema), 'type_error');
  });
});

// ---------------------------------------------------------------------------
// mz.ipv6
// ---------------------------------------------------------------------------

describe('mz.ipv6', () => {
  test('valid full IPv6', () => {
    const schema = mz.schema({ ip: mz.ipv6() });
    ok(mz.parse({ ip: '2001:0db8:85a3:0000:0000:8a2e:0370:7334' }, schema), { ip: '2001:0db8:85a3:0000:0000:8a2e:0370:7334' });
  });

  test('valid compressed IPv6', () => {
    const schema = mz.schema({ ip: mz.ipv6() });
    ok(mz.parse({ ip: '2001:db8::1' }, schema), { ip: '2001:db8::1' });
  });

  test('valid loopback IPv6', () => {
    const schema = mz.schema({ ip: mz.ipv6() });
    ok(mz.parse({ ip: '::1' }, schema), { ip: '::1' });
  });

  test('invalid: IPv4 address', () => {
    const schema = mz.schema({ ip: mz.ipv6() });
    fail(mz.parse({ ip: '192.168.1.1' }, schema), 'invalid_ipv6');
  });

  test('invalid: too many groups', () => {
    const schema = mz.schema({ ip: mz.ipv6() });
    fail(mz.parse({ ip: '2001:db8:85a3:0:0:8a2e:370:7334:extra' }, schema), 'invalid_ipv6');
  });

  test('invalid: number', () => {
    const schema = mz.schema({ ip: mz.ipv6() });
    fail(mz.parse({ ip: 42 }, schema), 'type_error');
  });
});

// ---------------------------------------------------------------------------
// mz.cidr
// ---------------------------------------------------------------------------

describe('mz.cidr', () => {
  test('valid IPv4 CIDR', () => {
    const schema = mz.schema({ range: mz.cidr() });
    ok(mz.parse({ range: '192.168.1.0/24' }, schema), { range: '192.168.1.0/24' });
  });

  test('valid IPv4 CIDR /32', () => {
    const schema = mz.schema({ range: mz.cidr() });
    ok(mz.parse({ range: '10.0.0.1/32' }, schema), { range: '10.0.0.1/32' });
  });

  test('valid IPv6 CIDR', () => {
    const schema = mz.schema({ range: mz.cidr() });
    ok(mz.parse({ range: '2001:db8::/32' }, schema), { range: '2001:db8::/32' });
  });

  test('invalid: missing prefix length', () => {
    const schema = mz.schema({ range: mz.cidr() });
    fail(mz.parse({ range: '192.168.1.0' }, schema), 'invalid_cidr');
  });

  test('invalid: prefix out of range for IPv4', () => {
    const schema = mz.schema({ range: mz.cidr() });
    fail(mz.parse({ range: '192.168.1.0/33' }, schema), 'invalid_cidr');
  });

  test('invalid: number', () => {
    const schema = mz.schema({ range: mz.cidr() });
    fail(mz.parse({ range: 123 }, schema), 'type_error');
  });
});

// ---------------------------------------------------------------------------
// mz.mac
// ---------------------------------------------------------------------------

describe('mz.mac', () => {
  test('valid MAC address with colons', () => {
    const schema = mz.schema({ mac: mz.mac() });
    ok(mz.parse({ mac: '00:1A:2B:3C:4D:5E' }, schema), { mac: '00:1A:2B:3C:4D:5E' });
  });

  test('valid MAC address with hyphens', () => {
    const schema = mz.schema({ mac: mz.mac() });
    ok(mz.parse({ mac: '00-1A-2B-3C-4D-5E' }, schema), { mac: '00-1A-2B-3C-4D-5E' });
  });

  test('valid lowercase MAC address', () => {
    const schema = mz.schema({ mac: mz.mac() });
    ok(mz.parse({ mac: '00:1a:2b:3c:4d:5e' }, schema), { mac: '00:1a:2b:3c:4d:5e' });
  });

  test('invalid: too few octets', () => {
    const schema = mz.schema({ mac: mz.mac() });
    fail(mz.parse({ mac: '00:1A:2B:3C:4D' }, schema), 'invalid_mac');
  });

  test('invalid: contains invalid hex characters', () => {
    const schema = mz.schema({ mac: mz.mac() });
    fail(mz.parse({ mac: '00:ZZ:2B:3C:4D:5E' }, schema), 'invalid_mac');
  });

  test('invalid: number', () => {
    const schema = mz.schema({ mac: mz.mac() });
    fail(mz.parse({ mac: 12345 }, schema), 'type_error');
  });
});

// ---------------------------------------------------------------------------
// mz.isoDatetime
// ---------------------------------------------------------------------------

describe('mz.isoDatetime', () => {
  test('valid ISO datetime with timezone offset', () => {
    const schema = mz.schema({ dt: mz.isoDatetime() });
    ok(mz.parse({ dt: '2026-05-22T18:29:00+00:00' }, schema), { dt: '2026-05-22T18:29:00+00:00' });
  });

  test('valid ISO datetime with Z timezone', () => {
    const schema = mz.schema({ dt: mz.isoDatetime() });
    ok(mz.parse({ dt: '2026-05-22T18:29:00Z' }, schema), { dt: '2026-05-22T18:29:00Z' });
  });

  test('valid ISO datetime with milliseconds', () => {
    const schema = mz.schema({ dt: mz.isoDatetime() });
    ok(mz.parse({ dt: '2026-05-22T18:29:00.000Z' }, schema), { dt: '2026-05-22T18:29:00.000Z' });
  });

  test('invalid: date only (no time component)', () => {
    const schema = mz.schema({ dt: mz.isoDatetime() });
    fail(mz.parse({ dt: '2026-05-22' }, schema), 'invalid_iso_datetime');
  });

  test('invalid: invalid month', () => {
    const schema = mz.schema({ dt: mz.isoDatetime() });
    fail(mz.parse({ dt: '2026-13-22T18:29:00Z' }, schema), 'invalid_iso_datetime');
  });

  test('invalid: number', () => {
    const schema = mz.schema({ dt: mz.isoDatetime() });
    fail(mz.parse({ dt: 1716393600 }, schema), 'type_error');
  });
});

// ---------------------------------------------------------------------------
// mz.isoDate
// ---------------------------------------------------------------------------

describe('mz.isoDate', () => {
  test('valid ISO date', () => {
    const schema = mz.schema({ d: mz.isoDate() });
    ok(mz.parse({ d: '2026-05-22' }, schema), { d: '2026-05-22' });
  });

  test('valid ISO date first day of year', () => {
    const schema = mz.schema({ d: mz.isoDate() });
    ok(mz.parse({ d: '2026-01-01' }, schema), { d: '2026-01-01' });
  });

  test('invalid: datetime string (has time component)', () => {
    const schema = mz.schema({ d: mz.isoDate() });
    fail(mz.parse({ d: '2026-05-22T18:29:00Z' }, schema), 'invalid_iso_date');
  });

  test('invalid: wrong format (US date)', () => {
    const schema = mz.schema({ d: mz.isoDate() });
    fail(mz.parse({ d: '05/22/2026' }, schema), 'invalid_iso_date');
  });

  test('invalid: invalid day', () => {
    const schema = mz.schema({ d: mz.isoDate() });
    fail(mz.parse({ d: '2026-02-30' }, schema), 'invalid_iso_date');
  });

  test('invalid: number', () => {
    const schema = mz.schema({ d: mz.isoDate() });
    fail(mz.parse({ d: 20260522 }, schema), 'type_error');
  });
});

// ---------------------------------------------------------------------------
// mz.isoTime
// ---------------------------------------------------------------------------

describe('mz.isoTime', () => {
  test('valid ISO time HH:MM:SS', () => {
    const schema = mz.schema({ t: mz.isoTime() });
    ok(mz.parse({ t: '18:29:00' }, schema), { t: '18:29:00' });
  });

  test('valid ISO time with milliseconds', () => {
    const schema = mz.schema({ t: mz.isoTime() });
    ok(mz.parse({ t: '18:29:00.000' }, schema), { t: '18:29:00.000' });
  });

  test('valid ISO time midnight', () => {
    const schema = mz.schema({ t: mz.isoTime() });
    ok(mz.parse({ t: '00:00:00' }, schema), { t: '00:00:00' });
  });

  test('invalid: invalid hour', () => {
    const schema = mz.schema({ t: mz.isoTime() });
    fail(mz.parse({ t: '25:00:00' }, schema), 'invalid_iso_time');
  });

  test('invalid: invalid minute', () => {
    const schema = mz.schema({ t: mz.isoTime() });
    fail(mz.parse({ t: '18:60:00' }, schema), 'invalid_iso_time');
  });

  test('invalid: datetime string', () => {
    const schema = mz.schema({ t: mz.isoTime() });
    fail(mz.parse({ t: '2026-05-22T18:29:00Z' }, schema), 'invalid_iso_time');
  });

  test('invalid: number', () => {
    const schema = mz.schema({ t: mz.isoTime() });
    fail(mz.parse({ t: 182900 }, schema), 'type_error');
  });
});

// ---------------------------------------------------------------------------
// mz.schema — mixed schema tests
// ---------------------------------------------------------------------------

describe('mz.schema — mixed schemas', () => {
  const userSchema = mz.schema({
    id: mz.uuid({ version: 'v4' }),
    name: mz.string({ minLength: 1, maxLength: 50 }),
    email: mz.email(),
    rank: mz.number({ min: 1, max: 3 }),
    isActive: mz.boolean(),
    createdAt: mz.isoDatetime(),
    phone: mz.e164(),
    website: mz.url({ protocol: 'https' }),
  });

  test('all valid inputs', () => {
    const input = {
      id: 'c9f7a3da-5825-41d1-89fc-f543ee634e98',
      name: 'Owen Wexler',
      email: 'owen@miniz.dev',
      rank: 2,
      isActive: true,
      createdAt: '2026-05-22T18:29:00Z',
      phone: '+14155552671',
      website: 'https://miniz.dev',
    };
    ok(mz.parse(input, userSchema), input);
  });

  test('invalid: bad uuid format', () => {
    const input = {
      id: 'not-a-uuid',
      name: 'Owen Wexler',
      email: 'owen@miniz.dev',
      rank: 2,
      isActive: true,
      createdAt: '2026-05-22T18:29:00Z',
      phone: '+14155552671',
      website: 'https://miniz.dev',
    };
    fail(mz.parse(input, userSchema), 'invalid_uuid');
  });

  test('invalid: name too short', () => {
    const input = {
      id: 'c9f7a3da-5825-41d1-89fc-f543ee634e98',
      name: '',
      email: 'owen@miniz.dev',
      rank: 2,
      isActive: true,
      createdAt: '2026-05-22T18:29:00Z',
      phone: '+14155552671',
      website: 'https://miniz.dev',
    };
    fail(mz.parse(input, userSchema), 'string_length_below_min');
  });

  test('invalid: rank out of range', () => {
    const input = {
      id: 'c9f7a3da-5825-41d1-89fc-f543ee634e98',
      name: 'Owen Wexler',
      email: 'owen@miniz.dev',
      rank: 99,
      isActive: true,
      createdAt: '2026-05-22T18:29:00Z',
      phone: '+14155552671',
      website: 'https://miniz.dev',
    };
    fail(mz.parse(input, userSchema), 'number_above_max');
  });

  test('invalid: http instead of https for website', () => {
    const input = {
      id: 'c9f7a3da-5825-41d1-89fc-f543ee634e98',
      name: 'Owen Wexler',
      email: 'owen@miniz.dev',
      rank: 2,
      isActive: true,
      createdAt: '2026-05-22T18:29:00Z',
      phone: '+14155552671',
      website: 'http://miniz.dev',
    };
    fail(mz.parse(input, userSchema), 'url_protocol_mismatch');
  });

  test('all invalid inputs returns first encountered error', () => {
    const input = {
      id: 'bad-id',
      name: '',
      email: 'not-an-email',
      rank: 0,
      isActive: 'yes',
      createdAt: 'not-a-datetime',
      phone: '5555555',
      website: 'not-a-url',
    };
    const result = mz.parse(input, userSchema);
    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error.code).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// mz.schema — network / identifier mixed schema
// ---------------------------------------------------------------------------

describe('mz.schema — network and identifier fields', () => {
  const networkSchema = mz.schema({
    ipv4: mz.ipv4(),
    ipv6: mz.ipv6(),
    cidr: mz.cidr(),
    mac: mz.mac(),
    token: mz.jwt(),
    hash: mz.hash({ hashType: 'sha256' }),
  });

  test('all valid network inputs', () => {
    const input = {
      ipv4: '192.168.1.1',
      ipv6: '2001:db8::1',
      cidr: '10.0.0.0/8',
      mac: '00:1A:2B:3C:4D:5E',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U',
      hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    };
    ok(mz.parse(input, networkSchema), input);
  });

  test('invalid: bad ipv4 in network schema', () => {
    const input = {
      ipv4: '999.999.999.999',
      ipv6: '2001:db8::1',
      cidr: '10.0.0.0/8',
      mac: '00:1A:2B:3C:4D:5E',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U',
      hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    };
    fail(mz.parse(input, networkSchema), 'invalid_ipv4');
  });
});

// ---------------------------------------------------------------------------
// mz.errors dictionary
// ---------------------------------------------------------------------------

describe('mz.errors dictionary', () => {
  test('mz.errors is defined', () => {
    expect(mz.errors).toBeDefined();
    expect(mz.errors).not.toBeNull();
  });

  test('mz.errors.typeError has required fields', () => {
    expect(mz.errors.typeError).toHaveProperty('code');
    expect(mz.errors.typeError).toHaveProperty('message');
    expect(mz.errors.typeError).toHaveProperty('details');
    expect(mz.errors.typeError).toHaveProperty('hint');
  });

  test('mz.errors.numberBelowMin has required fields', () => {
    expect(mz.errors.numberBelowMin).toHaveProperty('code');
    expect(mz.errors.numberBelowMin).toHaveProperty('message');
    expect(mz.errors.numberBelowMin).toHaveProperty('details');
    expect(mz.errors.numberBelowMin).toHaveProperty('hint');
  });

  test('mz.errors.numberAboveMax has required fields', () => {
    expect(mz.errors.numberAboveMax).toHaveProperty('code');
    expect(mz.errors.numberAboveMax).toHaveProperty('message');
    expect(mz.errors.numberAboveMax).toHaveProperty('details');
    expect(mz.errors.numberAboveMax).toHaveProperty('hint');
  });

  test('error returned by failed parse matches mz.errors shape', () => {
    const schema = mz.schema({ n: mz.number() });
    const result = mz.parse({ n: 'not-a-number' }, schema);
    expect(result.error).toHaveProperty('code');
    expect(result.error).toHaveProperty('message');
    expect(result.error).toHaveProperty('details');
    expect(result.error).toHaveProperty('hint');
  });
});
