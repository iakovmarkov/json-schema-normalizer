const curry = fn => {
  const arity = fn.length

  return (...args) => {
    const firstArgs = args.length
    if (firstArgs >= arity) {
      return fn(...args)
    } else {
      return (...secondArgs) => {
        return fn(...[...args, ...secondArgs])
      }
    }
  }
}

export default curry
