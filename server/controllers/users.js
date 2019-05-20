const { ObjectID } = require('mongodb');
const { find, propEq } = require('ramda');
const jwt = require('jsonwebtoken');
const sharp = require('sharp');
const { usersPipeline, matchById, project } = require('../aggregations/users');
const { Users } = require('../database');
const { sendEmailConfirmation, sendResetPassword } = require('../emails/account');
const { JWT_SECRET } = require('../utils/constants');
const { getAppUrl } = require('../utils/functions');

exports.postUsers = async (req, res) => {
  try {
    const {
      ops: [user],
    } = await Users().insertOne({ usersDisliked: [], usersLiked: [], ...req.body });
    const { _id, email, firstName, lastName } = user;
    const token = await jwt.sign({ _id }, JWT_SECRET);
    const url = `${getAppUrl(req)}/verify/${token}`;
    await sendEmailConfirmation(email, firstName, lastName, url);
    res.status(201).send();
  } catch (e) {
    res.status(400).send();
    console.log(e); // eslint-disable-line no-console
  }
};

exports.getUsers = async (req, res) => {
  try {
    const {
      maxDistance,
      gender,
      interests,
      limit,
      skip,
      sort,
      birthRange,
      notMyUser,
      hideUsersDisliked,
    } = req;
    const projection = project({ password: 0, 'images.data': 0, email: 0 });
    const users = await Users()
      .aggregate(
        usersPipeline(
          maxDistance,
          gender,
          interests,
          birthRange,
          hideUsersDisliked,
          notMyUser,
          limit,
          skip,
          sort,
          projection,
        ),
      )
      .toArray();
    res.status(200).send(users);
  } catch (e) {
    res.status(500).send();
    console.log(e); // eslint-disable-line no-console
  }
};

exports.getUser = async (req, res) => {
  try {
    const projection = project({ password: 0, 'images.data': 0, email: 0 });
    const [data] = await Users()
      .aggregate(usersPipeline(matchById(req._id), projection))
      .toArray();
    if (!data) return res.status(404).send();
    res.send(data);
  } catch (e) {
    res.status(500).send();
    console.log(e); // eslint-disable-line no-console
  }
};

exports.patchUsers = async (req, res) => {
  try {
    const {
      user: { _id },
      body,
      lookupUsersLiked,
      lookupUsersDisliked,
    } = req;
    const { value: user } = await Users().findOneAndUpdate({ _id }, { $set: body });
    if (!user) return res.status(404).send();
    const projection = project({
      password: 0,
      'images.data': 0,
      'usersDisliked.password': 0,
      'usersDisliked.email': 0,
      'usersDisliked.images.data': 0,
      'usersLiked.password': 0,
      'usersLiked.email': 0,
      'usersLiked.images.data': 0,
    });
    const [data] = await Users()
      .aggregate(usersPipeline(matchById(_id), lookupUsersLiked, lookupUsersDisliked, projection))
      .toArray();
    res.send(data);
  } catch (e) {
    res.status(400).send();
    console.log(e); // eslint-disable-line no-console
  }
};

exports.postUsersLogin = async (req, res) => {
  try {
    const { user, token, lookupUsersLiked, lookupUsersDisliked } = req;
    const projection = project({
      password: 0,
      'images.data': 0,
      'usersDisliked.password': 0,
      'usersDisliked.email': 0,
      'usersDisliked.images.data': 0,
      'usersLiked.password': 0,
      'usersLiked.email': 0,
      'usersLiked.images.data': 0,
    });
    const [data] = await Users()
      .aggregate(
        usersPipeline(matchById(user._id), lookupUsersLiked, lookupUsersDisliked, projection),
      )
      .toArray();
    res.send({ ...data, token });
  } catch (e) {
    res.status(400).send();
    console.log(e); // eslint-disable-line no-console
  }
};

exports.postUsersForgot = async (req, res) => {
  try {
    const user = await Users().findOne({ email: req.body.email });
    if (!user) throw new Error();
    const { _id, email, firstName, lastName } = user;
    const token = await jwt.sign({ _id }, JWT_SECRET);
    const url = `${getAppUrl(req)}/reset/${token}`;
    await sendResetPassword(email, firstName, lastName, url);
    res.status(200).send();
  } catch (e) {
    res.status(400).send();
    console.log(e); // eslint-disable-line no-console
  }
};

exports.postUsersImages = async (req, res) => {
  try {
    const {
      user: { _id },
    } = req;
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 500, fit: 'outside' })
      .png()
      .toBuffer();
    const imageId = ObjectID();
    const { value: user } = await Users().findOneAndUpdate(
      { _id },
      { $push: { images: { _id: imageId, data: buffer } } },
    );
    if (!user) return res.status(404).send();
    const projection = project({ password: 0, 'images.data': 0 });
    const [data] = await Users()
      .aggregate(usersPipeline(matchById(_id), projection))
      .toArray();
    res.send(data);
  } catch (e) {
    res.status(400).send();
    console.log(e); // eslint-disable-line no-console
  }
};

exports.deleteUsersImages = async (req, res) => {
  try {
    const {
      user: { _id },
    } = req;
    const imageId = ObjectID(req.params.imageId);
    const { value: user } = await Users().findOneAndUpdate(
      { _id },
      { $pull: { images: { _id: imageId } } },
    );
    if (!user) return res.status(404).send();
    const projection = project({ password: 0, 'images.data': 0 });
    const [data] = await Users()
      .aggregate(usersPipeline(matchById(_id), projection))
      .toArray();
    res.send(data);
  } catch (e) {
    res.status(500).send();
    console.log(e); // eslint-disable-line no-console
  }
};

exports.getUsersImages = async (req, res) => {
  try {
    const imageId = ObjectID(req.params.imageId);
    const user = await Users().findOne({ _id: req._id, 'images._id': imageId });
    if (!user) return res.status(404).send();
    const { data } = find(image => propEq('_id', imageId)(image))(user.images);
    res.type('png');
    res.send(data.buffer);
  } catch (e) {
    res.status(500).send();
    console.log(e); // eslint-disable-line no-console
  }
};
