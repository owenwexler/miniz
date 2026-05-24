// ---------------------------------------------------
// 1. errors object - error types returned by the mz
// object and its private internal functions
// ---------------------------------------------------

const errors = {
  unknownError: {
    code: 'unknown_error',
    message: 'Unknown Error',
    details: 'We are sorry, something went wrong',
    hint: 'Try again later'
  },
  invalidObjectSchema: {
    code: 'invalid_object_schema',
    message: 'Invalid Object Schema',
    details: 'The object does not conform to the expected schema',
    hint: 'Usually this is because the object is missing fields expected by the schema or a field is wrongly typed'
  },
  typeError: {
    code: 'type_error',
    message: 'Type error',
    details: 'A value is not of the expected type or used in an incompatible way',
    hint: 'Check the function this error was thrown and make sure all variables are being used properly.'
  },
  syntaxError: {
    code: 'syntax_error',
    message: 'Syntax error',
    details: 'There is a syntax error',
    hint: 'Check the syntax.'
  },
  rangeError: {
    code: 'range',
    message: 'Range error',
    details: 'A value is passed in to a function that does not allow a range that includes the value',
    hint: 'Check the value that is passed into the function throwing the error, it may be an unallowed string value, array of illegal length, etc.'
  },
  numberBelowMin: {
    code: 'number_below_min',
    message: 'Number below minimum',
    details: 'An input number was below the minimum number in the schema',
    hint: 'Input a number that is above the minimum.'
  },
  numberAboveMax: {
    code: 'number_above_max',
    message: 'Number above maximum',
    details: 'An input number was above the maximum number in the schema',
    hint: 'Input a number that is below the maximum.'
  },
  stringLengthBelowMin: {
    code: 'string_length_below_min',
    message: 'String length below minimum',
    details: 'An input string length was below the minimum length required in the schema',
    hint: 'Input a string that is as long or longer than the minimum.'
  },
  stringLengthAboveMax: {
    code: 'string_length_above_max',
    message: 'String length above maximum',
    details: 'An input string length was above the maximum length required in the schema',
    hint: 'Input a string that is as long or shorter than the maximum.'
  },
  stringRegexMismatch: {
    code: 'string_regex_mismatch',
    message: 'String does not match regex',
    details: 'The input string did not match the required regular expression pattern',
    hint: 'Ensure the input string matches the regex pattern defined in the schema.'
  },
  stringStartsWithMismatch: {
    code: 'string_starts_with_mismatch',
    message: 'String does not start with required prefix',
    details: 'The input string does not begin with the required prefix defined in the schema',
    hint: 'Ensure the input string starts with the required prefix.'
  },
  stringEndsWithMismatch: {
    code: 'string_ends_with_mismatch',
    message: 'String does not end with required suffix',
    details: 'The input string does not end with the required suffix defined in the schema',
    hint: 'Ensure the input string ends with the required suffix.'
  },
  stringMustIncludeMismatch: {
    code: 'string_must_include_mismatch',
    message: 'String does not include required substring',
    details: 'The input string does not contain the required substring defined in the schema',
    hint: 'Ensure the input string contains the required substring.'
  },
  enumMismatch: {
    code: 'enum_mismatch',
    message: 'Value not in enum',
    details: 'The input value was not one of the allowed enum values',
    hint: 'Input one of the allowed values defined in the enum schema.'
  },
  invalidEmail: {
    code: 'invalid_email',
    message: 'Invalid email address',
    details: 'The input string is not a valid email address',
    hint: 'Provide a valid email address in the format user@domain.tld.'
  },
  invalidUrl: {
    code: 'invalid_url',
    message: 'Invalid URL',
    details: 'The input string is not a valid URL',
    hint: 'Provide a valid URL including a protocol such as https://example.com.'
  },
  urlProtocolMismatch: {
    code: 'url_protocol_mismatch',
    message: 'URL protocol mismatch',
    details: 'The URL does not use the required protocol defined in the schema',
    hint: 'Ensure the URL uses the required protocol (e.g. https).'
  },
  urlHostnameMismatch: {
    code: 'url_hostname_mismatch',
    message: 'URL hostname mismatch',
    details: 'The URL does not match the required hostname defined in the schema',
    hint: 'Ensure the URL uses the required hostname.'
  },
  invalidEmoji: {
    code: 'invalid_emoji',
    message: 'Invalid emoji',
    details: 'The input string does not consist of valid emoji characters',
    hint: 'Provide a string containing only emoji characters.'
  },
  invalidBase64: {
    code: 'invalid_base64',
    message: 'Invalid base64 string',
    details: 'The input string is not valid base64-encoded data',
    hint: 'Provide a valid base64-encoded string using the standard alphabet (A-Z, a-z, 0-9, +, /) with optional = padding.'
  },
  invalidBase64url: {
    code: 'invalid_base64url',
    message: 'Invalid base64url string',
    details: 'The input string is not valid base64url-encoded data',
    hint: 'Provide a valid base64url-encoded string using the URL-safe alphabet (A-Z, a-z, 0-9, -, _) without padding.'
  },
  invalidHex: {
    code: 'invalid_hex',
    message: 'Invalid hex string',
    details: 'The input string contains characters outside the hexadecimal alphabet (0-9, a-f, A-F)',
    hint: 'Provide a string containing only valid hexadecimal characters.'
  },
  invalidNanoid: {
    code: 'invalid_nanoid',
    message: 'Invalid nanoid',
    details: 'The input string does not conform to the nanoid format (21 URL-safe characters)',
    hint: 'Provide a valid 21-character nanoid using the URL-safe alphabet (A-Z, a-z, 0-9, _, -).'
  },
  invalidUuid: {
    code: 'invalid_uuid',
    message: 'Invalid UUID',
    details: 'The input string is not a valid UUID',
    hint: 'Provide a valid UUID in the format xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.'
  },
  uuidVersionMismatch: {
    code: 'uuid_version_mismatch',
    message: 'UUID version mismatch',
    details: 'The UUID does not match the required version defined in the schema',
    hint: 'Provide a UUID of the version required by the schema.'
  },
  invalidUlid: {
    code: 'invalid_ulid',
    message: 'Invalid ULID',
    details: 'The input string is not a valid ULID (26 Crockford base32 characters)',
    hint: 'Provide a valid 26-character ULID using the Crockford base32 alphabet.'
  },
  invalidCuid: {
    code: 'invalid_cuid',
    message: 'Invalid CUID',
    details: 'The input string does not conform to the CUID format (starts with "c", minimum 25 characters)',
    hint: 'Provide a valid CUID generated by a CUID library.'
  },
  invalidCuid2: {
    code: 'invalid_cuid2',
    message: 'Invalid CUID2',
    details: 'The input string does not conform to the CUID2 format (lowercase alphanumeric, minimum 24 characters)',
    hint: 'Provide a valid CUID2 generated by a CUID2 library.'
  },
  invalidGuid: {
    code: 'invalid_guid',
    message: 'Invalid GUID',
    details: 'The input string is not a valid GUID',
    hint: 'Provide a valid GUID in the format xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.'
  },
  invalidHash: {
    code: 'invalid_hash',
    message: 'Invalid hash',
    details: 'The input string does not match the expected hash format or length for the specified hash type',
    hint: 'Provide a valid hash string of the correct length and format for the hash type (md5: 32 hex chars, sha256: 64 hex chars).'
  },
  invalidJwt: {
    code: 'invalid_jwt',
    message: 'Invalid JWT',
    details: 'The input string is not a valid JSON Web Token (must have three base64url-encoded parts separated by dots)',
    hint: 'Provide a valid JWT in the format header.payload.signature.'
  },
  invalidE164: {
    code: 'invalid_e164',
    message: 'Invalid E.164 phone number',
    details: 'The input string is not a valid E.164 formatted phone number',
    hint: 'Provide a phone number in E.164 format: a leading + followed by 1-15 digits (e.g. +14155552671).'
  },
  invalidDate: {
    code: 'invalid_date',
    message: 'Invalid Date object',
    details: 'The input is not a valid JavaScript Date object or represents an invalid date',
    hint: 'Provide a valid JavaScript Date object (e.g. new Date()).'
  },
  invalidTimestamp: {
    code: 'invalid_timestamp',
    message: 'Invalid timestamp',
    details: 'The input is not a valid Unix timestamp (must be a non-negative integer)',
    hint: 'Provide a non-negative integer Unix timestamp in seconds.'
  },
  invalidIpv4: {
    code: 'invalid_ipv4',
    message: 'Invalid IPv4 address',
    details: 'The input string is not a valid IPv4 address',
    hint: 'Provide a valid IPv4 address in dotted-decimal notation (e.g. 192.168.1.1).'
  },
  invalidIpv6: {
    code: 'invalid_ipv6',
    message: 'Invalid IPv6 address',
    details: 'The input string is not a valid IPv6 address',
    hint: 'Provide a valid IPv6 address (e.g. 2001:db8::1 or ::1).'
  },
  invalidCidr: {
    code: 'invalid_cidr',
    message: 'Invalid CIDR notation',
    details: 'The input string is not a valid IP range in CIDR notation',
    hint: 'Provide a valid CIDR block such as 192.168.1.0/24 or 2001:db8::/32.'
  },
  invalidMac: {
    code: 'invalid_mac',
    message: 'Invalid MAC address',
    details: 'The input string is not a valid MAC address',
    hint: 'Provide a valid MAC address in colon or hyphen notation (e.g. 00:1A:2B:3C:4D:5E).'
  },
  invalidIsoDatetime: {
    code: 'invalid_iso_datetime',
    message: 'Invalid ISO datetime',
    details: 'The input string is not a valid ISO 8601 datetime',
    hint: 'Provide a valid ISO 8601 datetime string (e.g. 2026-05-22T18:29:00Z).'
  },
  invalidIsoDate: {
    code: 'invalid_iso_date',
    message: 'Invalid ISO date',
    details: 'The input string is not a valid ISO 8601 date',
    hint: 'Provide a valid ISO 8601 date string in the format YYYY-MM-DD (e.g. 2026-05-22).'
  },
  invalidIsoTime: {
    code: 'invalid_iso_time',
    message: 'Invalid ISO time',
    details: 'The input string is not a valid ISO 8601 time',
    hint: 'Provide a valid ISO 8601 time string in the format HH:MM:SS (e.g. 18:29:00).'
  }
};
// --------------------------------------------
// 2.  Private global variables used by the mz
// object and its private functions
// --------------------------------------------

const returnedTypeError = {
  data: null,
  error: errors.typeError
}

const noError = { data: null, error: null }

// --------------------------------------------
// 3.  Private functions used by the mz object
// --------------------------------------------
const logError = (error, location) => {
  const typedError = error;
  const code = typedError.code ? typedError.code : errors.unknownError.code;
  const message = typedError.message ? typedError.message : errors.unknownError.message;

  // log a short version of the input error specified to be at the input location, then log the input error in full
  const summaryErrorMessage = code === 'unknown_error' ? JSON.stringify(error).slice(0, 15) : `${code}: ${message}`;
  console.log(`${summaryErrorMessage} at ${location}`);
  console.error(error);
}

/**
 * @Function formatError
 *
 * Converts an error of any type into a typed error object used by dataerror with code, message, description, and hint fields.  Will return an error already typed as such as is (basically a no-op).  Will check to see if the error is a ReferenceError or TypeError and will return the appopriate dataerror formatted error objects for each.  If the error is completely unknown, errors.unknownError will be returned.
 *
 * @param {unknown} error // the error, which can either be in the typed ErrorType format or an unknown format
 *
 * @returns {ErrorType}
 *
 * @example
 const getCitiesFromAPI () => {
  try {
    const response = await getAllCities();
    res.status(200).send({ data: response, error: null });
  } catch (error) {
    logError(error, 'getCitiesFromAPI');
    const formattedError = formatError(error);
    res.status(500).json({ data: null, error: formattedError });
  }
 }
 */

const formatError = (error) => {
  if (error instanceof ReferenceError) {
    return errors.referenceError;
  }

  if (error instanceof TypeError) {
    return errors.typeError;
  }

  if (error instanceof SyntaxError) {
    return errors.syntaxError;
  }

  if (error instanceof RangeError) {
    return errors.rangeError;
  }

  const typedError = error;

  if (typedError.code && typedError.message && typedError.details && typedError.hint) {
    return error;
  }

  return {
    code: typedError.code ? typedError.code : errors.unknownError.code,
    message: typedError.message ? typedError.message : errors.unknownError.message,
    details: typedError.details ? typedError.details : errors.unknownError.details,
    hint: typedError.hint ? typedError.hint : errors.unknownError.hint
  }
}

const failure = (error, location, additionalArgs) => {
  const formattedError = formatError(error);

  if (formattedError.code === errors.invalidCredentials.code) {
    if (additionalArgs && additionalArgs.logInvalidCredentialsErrors) {
      logError(error, location);
    }
  } else {
    logError(error, location);
  }

  // this is an optional argument that forces this function to return a specific error type - for example, we want it to return errors.databaseError in a situation where the error is almost certainly a database error but it may come back as an unknown error
  if (additionalArgs && additionalArgs.returnErrorType) {
    return {
      data: null,
      error: additionalArgs.returnErrorType
    }
  }

  return {
    data: null,
    error: formattedError
  }
}

const validateType = (input, type) => {
  if (type === 'array') {
    return !Array.isArray(input) ? returnedTypeError : noError;
  }

  const inputType = typeof input;

  if (inputType !== type) {
    return returnedTypeError;
  }

  return noError;
}

const parseNumber = (input, options) => {
  // console.log('parseNumber input: ', input);
  // console.log('parseNumber options: ', options);
  if (validateType(input, 'number').error) {
    return returnedTypeError;
  }

  if (options) {
    const { min, max } = options;

    if (min) {
      if (input < min) {
        return { data: null, error: errors.numberBelowMin }
      }
    }

    if (max) {
      if (input > max) {
        return { data: null, error: errors.numberAboveMax }
      }
    }
  }

  return { data: input, error: null }
}

const parseString = (input, options) => {
  if (validateType(input, 'string').error) {
    return returnedTypeError;
  }

  if (options) {
    const { minLength, maxLength, startsWith, endsWith, mustInclude, regex } = options;

    if (minLength) {
      if (input.length < minLength) {
        return { data: null, error: errors.stringLengthBelowMin }
      }
    }

    if (maxLength) {
      if (input.length > maxLength) {
        return { data: null, error: errors.stringLengthAboveMax }
      }
    }

    if (startsWith) {
      if (input.slice(0, startsWith.length) !== startsWith) {
        return {
          data: null,
          error: errors.startsWithMismatch
        }
      }
    }

    if (endsWith) {
      if (input.slice(input.length - endsWith.length, input.length) !== endsWith) {
        return {
          data: null,
          error: errors.startsWithMismatch
        }
      }
    }

    if (regex) {
      const regexMatches = input.match(regex);

      if (!regexMatches) {
        return { data: null, error: errors.regexMismatch };
      }
    }
  }

  return noError;
}

const parseEnum = (input, schemaEnum) => {

}

const createSchemaFieldObject = (schemaType, options) => {
  return options ? { schemaType, options } : { schemaType, options: null };
}

const parseField = (field) => {
  if (!field.schemaType || field.input === undefined) {
    return { data: null, error: errors.typeError };
  }

  const { schemaType, input, options } = field;

  switch(schemaType) {
    case 'number': {
      const result = parseNumber(input, options);
      return result.error ? { data: null, error: result.error } : { data: result.data, error: null };
    }
    case 'string': {
      const result = parseString(input, options);
      return result.error ? { data: null, error: result.error } : { data: result.data, error: null };
    }
    default:
      return { data: null, error: errors.unknownError };
  }
}

const parseObject = (object, schema) => {
  const result = {};

  for (const key in object) {
    const field = object[key];

    if (!schema[key]) {
      return {
        error: errors.invalidObjectSchema
      }
    }

    const fieldSchema = schema[key];

    const parsedFieldResult = parseField({ schemaType: fieldSchema.schemaType, input: field, options: fieldSchema.options });

    // console.log('parseField result: ', parsedFieldResult);

    if (parsedFieldResult.error) {
      return {
        error: parsedFieldResult.error
      }
    }

    // console.log('object[key]: ', field);

    // clone the field if it is a pass by reference type otherwise just pass the value
    if (Array.isArray(field)) {
      result[key] = [ ...field ];
    } else if (!['string', 'number', 'boolean'].includes(typeof field) && !Array.isArray(field)) {
      result[key] = { ...field };
    } else {
      result[key] = object[key];
    }
  }

  // console.log('parseObject result: ', result);

  return result;
}

// ---------------------------------------------------
// 4. Main mz object with all functions and properties
// ---------------------------------------------------
export const mz = {
  // primitives
  number: (options) => createSchemaFieldObject('number', options), // options: { min, max }
  string: (options) => createSchemaFieldObject('string', options), // options: { minLength, maxLength, regex, startsWith, endsWith, mustInclude }
  boolean: () => createSchemaFieldObject('boolean'),
  undefined: () => createSchemaFieldObject('undefined'),
  null: () => createSchemaFieldObject('null'),
  symbol: () => createSchemaFieldObject('symbol'),
  enum: (values) => createSchemaFieldObject('enum', { values }), // values: string[]

  // string-format identifiers
  uuid: (options) => createSchemaFieldObject('uuid', options), // options: { version: 'v1'|'v4'|'v5'|... }
  ulid: () => createSchemaFieldObject('ulid'),
  cuid: () => createSchemaFieldObject('cuid'),
  cuid2: () => createSchemaFieldObject('cuid2'),
  guid: () => createSchemaFieldObject('guid'),
  nanoid: () => createSchemaFieldObject('nanoid'),

  // contact / web
  email: (options) => createSchemaFieldObject('email', options), // options: { pattern }
  url: (options) => createSchemaFieldObject('url', options), // options: { protocol, hostname }
  e164: () => createSchemaFieldObject('e164'),

  // encoding formats
  base64: () => createSchemaFieldObject('base64'),
  base64url: () => createSchemaFieldObject('base64url'),
  hex: () => createSchemaFieldObject('hex'),

  // security tokens / hashes
  jwt: () => createSchemaFieldObject('jwt'),
  hash: (options) => createSchemaFieldObject('hash', options), // options: { hashType: 'md5'|'sha256' }

  // dates and times
  date: () => createSchemaFieldObject('date'),
  timestamp: () => createSchemaFieldObject('timestamp'),
  isoDatetime: () => createSchemaFieldObject('isoDatetime'),
  isoDate: () => createSchemaFieldObject('isoDate'),
  isoTime: () => createSchemaFieldObject('isoTime'),

  // network
  ipv4: () => createSchemaFieldObject('ipv4'),
  ipv6: () => createSchemaFieldObject('ipv6'),
  cidr: () => createSchemaFieldObject('cidr'),
  mac: () => createSchemaFieldObject('mac'),

  // special
  emoji: () => createSchemaFieldObject('emoji'),

  // schema builder — wraps a plain field-definition object so parse() can identify it
  schema: (fields) => ({ __mzSchema: true, ...fields }),

  errors: { ...errors },
  parse: (object, schema) => {
    return parseObject(object, schema);
  }
}

// ---------------------------------------------------
// 5. Documented type definitions (as comments)
// ---------------------------------------------------

/*
Return type:

type DataErrorReturnObject<T> {
  data: T | null;
  error: ErrorType | null;
}
*/
/*
  type ErrorType {
    code: string;  // the shorthand error code, frontends should use this in error handling primarily
    message: string; // the longer error message
    details: string; // detailed description of the error
    hint: string; // a hint on how to fix the error
  }
*/

/*
mz object type

type MZ {

}
*/
