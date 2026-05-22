const returnedTypeError = {
  data: null,
  error: errors.typeError
}

const validateType = (input, type) {
  const noError = { data: null, error: null }
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
      return { data: null, error: errors.numberBelowMin }
    }
  }

  if (maxLength) {
    if (input.length > maxLength) {
      return { data: null, error: errors.numberAboveMax }
    }
  }

  return noError;
}

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
  }
}

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
  }
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
  }
};

