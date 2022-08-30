const mongoose = require(`mongoose`);

function checkValidityUsername(username) {
  return username.length > 4;
}

function wrongUsername(res) {
  res.status(400).send({
    message: "Username is invalid. It should be at least 4 characters long ",
  });
}

function checkValidityOfPassword(password) {
  return password.length > 8;
}

function wrongPassword(res) {
  res.status(400).send({
    message: "Password is invalid. It should be at least 8 characters long ",
  });
}

module.exports = {
  checkValidityOfPassword,
  wrongPassword,
  checkValidityUsername,
  wrongUsername,
};
