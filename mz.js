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
    hint: 'Input a string that is as long or longer than the minimum.'
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
  if (validateType(input, 'number').error) {
    return returnedTypeError; 
  }

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

  return { data: input, error: null }
} 

const parseString = (input, options) => {
  if (validateType(input, 'string').error) {
    return returnedTypeError; 
  }

  const { minLength, maxLength } = options;

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

  return noError;
}

// ---------------------------------------------------
// 4. Main mz object with all functions and properties 
// ---------------------------------------------------
export const mz = {
  number: (options) => { // options: { min: number; max: number;}
    return {
      schemaType: 'number',
      options
    }
  },
  string: (options) => { // options: { minLength: number; maxLength: number }
    return {
      schemaType: 'string',
      options
    }
  },
  boolean: () => {
    return {
      schemaType: 'boolean'
    }
  },
  email: () => {
    return {
      schemaType: 'email'
    }
  },
  uuid: () => {
    return {
      schemaType: 'uuid'
    }
  },
  ulid: () => {
    return {
      schemaType: 'ulid'
    }
  },
  errors: { ...errors },
  parse: (input, schema) => {
    // parse function logic will go here
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
