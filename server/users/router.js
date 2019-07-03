const { Router } = require('express');
const conversions = require('../middlewares/conversions');
const auth = require('../middlewares/auth');
const stages = require('../middlewares/stages');
const controllers = require('./controllers');

const router = new Router();

router.post('/', conversions.newDateBirth, conversions.hashPassword, controllers.postUsers);

router.get(
  '/',
  auth.authenticate,
  stages.maxDistance,
  stages.matchGender,
  stages.matchInterests,
  stages.matchBirthRange,
  stages.mismatchUsersBlocked,
  stages.mismatchMyUser,
  stages.limit,
  stages.skip,
  stages.sort,
  controllers.getUsers,
);

router.get(
  '/:id',
  auth.authenticate,
  auth.isValidObjectId,
  conversions.newObjectId,
  controllers.getUser,
);

router.patch(
  '/',
  auth.authenticate,
  conversions.trimBody,
  conversions.newDateBirth,
  conversions.hashNewPassword,
  conversions.newUsersLikedId,
  conversions.newUsersBlockedId,
  stages.lookupUsersLiked,
  stages.lookupUsersBlocked,
  controllers.patchUsers,
);

router.post(
  '/login',
  conversions.trimBody,
  auth.generateAuthToken,
  auth.emailVerified,
  stages.lookupUsersLiked,
  stages.lookupUsersBlocked,
  controllers.postUsersLogin,
);

router.post('/forgot', conversions.trimBody, controllers.postUsersForgot);

router.post(
  '/images',
  auth.authenticate,
  conversions.uploadImage.single('image'),
  controllers.postUsersImages,
  // eslint-disable-next-line no-unused-vars
  (error, req, res, next) => {
    res.status(400).send();
    console.log(error); // eslint-disable-line no-console
  },
);

router.delete('/images/:imageId', auth.authenticate, controllers.deleteUsersImages);

router.get(
  '/:id/images/:imageId',
  auth.isValidObjectId,
  conversions.newObjectId,
  controllers.getUsersImages,
);

module.exports = router;