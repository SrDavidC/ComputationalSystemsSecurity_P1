//

const path = require('path');

const crypto = require('crypto');

const fs = require('fs');

const hash = (word) => {
  return crypto.createHash('sha256').update(word).digest('hex');
};

const getWords = (file) => {
  let data = fs.readFileSync(path.resolve(`./${file}`), 'utf8');

  data = data.replace(/\r/g, '');

  return data.split('\n');
};

const getUsers = (file) => {
  let data = fs.readFileSync(path.resolve(`./${file}`), 'utf8');

  data = data.replace(/\r/g, '');

  const lines = data.split('\n');

  const users = [];

  for (const line of lines) {
    const [name, password] = line.split(',');

    users.push({ name, password });
  }

  return users;
};

const findDecryptedPassword = (words, inputHashedPassword) => {
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const hashed = hash(word);

    if (hashed === inputHashedPassword) {
      return word;
    }
  }

  for (let i = 0; i < words.length; i++) {
    for (let j = 0; j < words.length; j++) {
      const word = words[i] + words[j];
      const hashed = hash(word);

      if (hashed === inputHashedPassword) {
        return word;
      }
    }
  }

  for (let i = 0; i < words.length; i++) {
    for (let j = 0; j < words.length; j++) {
      for (let k = 0; k < words.length; k++) {
        const word = words[i] + words[j] + words[k];
        const hashed = hash(word);

        if (hashed === inputHashedPassword) {
          return word;
        }
      }
    }
  }

  return null;
};

const decrypt = () => {
  const words = getWords('xato-net-10-million-passwords-1000000.txt');

  const users = getUsers('users.csv');

  let data = [];

  for (const user of users) {
    const decryptedPassword = findDecryptedPassword(words, user.password);

    data.push(`${user.name},${decryptedPassword}`);
  }

  fs.writeFileSync(
    path.resolve(`./decrypted_results.csv`),
    data.join('\n'),
    'utf8'
  );
};

decrypt();
