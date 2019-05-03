const bcrypt = require("bcrypt");
const models = require("../models");

const hashPassword = async password => {
  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) reject(err);
      resolve(hash);
    });
  });
  return hashedPassword;
};

const createUser = async ({ name, password, email, phone }) => {
  try {
    const hashedPassword = await hashPassword(password);
    const newUser = await models.User.create({
      name,
      password: hashedPassword,
      email,
      phone
    });
    return newUser;
  } catch (err) {
    console.log(err);
  }
};

const getAllUsers = async () => {
  try {
    const allUsers = await models.User.findAll();
    return allUsers;
  } catch (err) {
    console.log(err);
  }
};

const getUser = async account => {
  try {
    const user = await models.User.findOne({
      where: account
    });
    return user;
  } catch (err) {
    console.log(err);
  }
};

const utils = {
  createUser,
  getAllUsers,
  getUser
};

module.exports = utils;
