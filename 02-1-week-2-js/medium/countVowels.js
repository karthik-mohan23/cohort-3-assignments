/*
  Implement a function `countVowels` that takes a string as an argument and returns the number of vowels in the string.
  Note: Consider both uppercase and lowercase vowels ('a', 'e', 'i', 'o', 'u').

  Once you've implemented the logic, test your code by running
*/

function countVowels(str) {
  const vowels = new Set(["a", "e", "i", "o", "u"]);
  let numVowels = 0;

  for (let i = 0; i < str.length; i++) {
    let currentStr = str[i].toLowerCase();
    if (vowels.has(currentStr)) {
      numVowels = numVowels + 1;
    } else {
      continue;
    }
  }

  return numVowels;
}

module.exports = countVowels;
