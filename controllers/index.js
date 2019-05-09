const bcrypt = require("bcrypt");
const models = require("../models");
const jwt = require("jsonwebtoken");

const hashPassword = password => {
  const hashedPassword = new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) reject(err);
      resolve(hash);
    });
  });
  return hashedPassword;
};

const verifyPassword = async (password, hash) => {
  try {
    const match = await bcrypt.compare(password, hash);
    return match;
  } catch (err) {
    console.log(match);
  }
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

const login = async (name, password, secretKey) => {
  if (name && password) {
    const user = await getUser({ name });
    if (!user) return 204;
    const check = await verifyPassword(password, user.password);
    if (check) {
      const payload = { id: user.id };
      const token = jwt.sign(payload, secretKey);
      return { user, token };
    } else return 401;
  } else return 400;
};

module.exports = {
  utils: {
    hashPassword,
    verifyPassword,
    createUser,
    getAllUsers,
    getUser,
    login
  }
};
