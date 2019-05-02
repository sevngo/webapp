const { toString, replace } = require('ramda');
const jwt = require('jsonwebtoken');
const { ObjectID } = require('mongodb');
const bcrypt = require('bcryptjs');
const { path } = require('ramda');
const { Users } = require('../database');
const { JWT_SECRET } = require('../utils');

const generateAuthToken = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await Users().findOne({ username });
    if (!user) throw new Error();

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error();

    const token = await jwt.sign({ _id: toString(user._id) }, JWT_SECRET);

    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    res.status(400).send();
    console.log(e); // eslint-disable-line no-console
  }
};

const auth = async (req, res, next) => {
  try {
    const token = replace('Bearer ', '')(req.header('Authorization'));
    const { _id } = jwt.verify(token, JWT_SECRET);
    const user = await Users().findOne({ _id: new ObjectID(_id) });
    if (!user) throw new Error();
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send();
    console.log(e); // eslint-disable-line no-console
  }
};

const isMyId = async (req, res, next) => {
  if (req.params.id !== toString(path(['user', '_id'])(req))) return res.status(401).send();
  next();
};

const emailVerified = async (req, res, next) => {
  if (!req.user.emailVerified) return res.status(400).send();
  next();
};

module.exports = { generateAuthToken, auth, isMyId, emailVerified };
