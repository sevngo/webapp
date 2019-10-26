import React, { useEffect, useState } from 'react';
import { find, path, isEmpty, length } from 'ramda';
import { FormattedMessage } from 'react-intl';
import { Grid, Button } from '@material-ui/core';
import Paper from '../../components/Paper';
import UserForm from '../../components/UserForm';
import Carousel from '../../components/Carousel';
import emptyImage from '../../images/emptyImage.png';
import { getUserImage } from '../../api';
import useStyles from './styles';
import { useConnect } from './hooks';
import messages from './messages';

const User = ({ id }) => {
  const { user, myUser, loadUser, likeUser, blockUser } = useConnect();
  const [activeStep, handleStep] = useState(0);
  useEffect(() => {
    loadUser(myUser, id);
  }, []);
  const classes = useStyles();
  const isLiked = Boolean(find(userLiked => userLiked._id === user._id)(myUser.usersLiked));
  const isBlocked = Boolean(find(userBlocked => userBlocked._id === user._id)(myUser.usersBlocked));
  const isFriend = find(friend => friend._id === user._id)(myUser.friends);
  const { images = [] } = user;
  const image = !isEmpty(images)
    ? getUserImage(user._id, path([activeStep, '_id'])(images))
    : emptyImage;
  const maxSteps = length(images);
  return (
    <Grid container alignItems="center" className={classes.p3}>
      <Grid container className={classes.mw500}>
        {isFriend && (
          <Grid item xs={12}>
            <Button color="primary" variant="contained" size="large" className={classes.friend}>
              <FormattedMessage {...messages.friend} />
            </Button>
          </Grid>
        )}
        <Grid item xs={12}>
          <Button
            color="primary"
            variant="contained"
            size="large"
            className={classes.like}
            onClick={() => likeUser(myUser, user._id)}
            disabled={isLiked}
          >
            <FormattedMessage {...messages.likeUser} />
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            size="large"
            variant="contained"
            onClick={() => blockUser(myUser, user._id)}
            className={classes.block}
            disabled={isBlocked}
          >
            <FormattedMessage {...messages.blockUser} />
          </Button>
        </Grid>
      </Grid>
      <Grid item className={classes.mw500}>
        <Paper>
          <Carousel activeStep={activeStep} handleStep={handleStep} maxSteps={maxSteps}>
            <img className={classes.img} src={image} alt="image" />
          </Carousel>
        </Paper>
      </Grid>
      <Grid item className={classes.mw500}>
        <Paper className={classes.p3}>
          <UserForm initialValues={user} disabled />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default User;
