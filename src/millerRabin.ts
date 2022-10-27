const randInt = (a: number) => Math.floor(Math.random() * a);

const randRange = (a: number, b: number) => a + randInt(b - a);

const expmod = (base: number, exp: number, mod: number): number => {
  if (exp === 0) return 1;
  if (exp % 2 === 0) {
    return Math.pow(expmod(base, exp / 2, mod), 2) % mod;
  } else {
    return (base * expmod(base, exp - 1, mod)) % mod;
  }
};

/**
 * Probabilistically determine a number is prime or not.
 *
 * Every iteration increases the accuracy of the result, with the probability
 * of a bad result being reduced by 1/4 per iteration.
 *
 * Explanation for why k=40 is fine can be found here: https://stackoverflow.com/questions/6325576/how-many-iterations-of-rabin-miller-should-i-use-for-cryptographic-safe-primeshttps://stackoverflow.com/questions/6325576/how-many-iterations-of-rabin-miller-should-i-use-for-cryptographic-safe-primes
 *
 * @param n prime candidate
 * @param k number of iterations
 * @returns
 */
const millerRabin = (n: number, k: number = 40): boolean => {
  if (n === 2 || n === 3) return true;
  if (n % 2 === 0 || n < 2) return false;

  let r = 0;
  let s = n - 1;
  while (s % 2 === 0) {
    r += 1;
    s /= 2;
  }

  for (let i = 0; i < k; i++) {
    const a = randRange(2, n - 1);
    let x = expmod(a, s, n);
    if (x === 1 || x === n - 1) {
      continue;
    }

    if (r - 1 === 0) {
      return false;
    }
    for (let j = 0; j < r - 1; j++) {
      x = expmod(x, 2, n);
      if (x !== n - 1) {
        return false;
      }
    }
  }

  return true;
};

export default millerRabin;
