function validate (str) {
  return str &&
    !_.every(str, c =>
      c === ' ' || c === '\t' || c === '\n')
}

export default validate;
