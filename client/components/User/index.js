import React from 'react';
import { Link } from 'react-router-dom';
import {
  withStyles,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Grid,
} from '@material-ui/core';
import { path } from 'ramda';
import emptyImage from '../../images/emptyImage.png';
import Interests from '../Interests';
import { getAge } from '../../utils';
import * as constants from '../../utils/constants';

const styles = theme => ({
  card: {
    width: 300,
  },
  media: {
    height: 250,
  },
  root: {
    padding: theme.spacing(3),
  },
  mt1: {
    marginTop: theme.spacing(1),
  },
});

const Component = ({ user, classes }) => {
  const { images } = user;
  const imageId = path([0, '_id'])(images);
  const image = imageId ? `/api/users/${user._id}/images/${imageId}` : emptyImage;
  return (
    <Card className={classes.card} elevation={24}>
      <CardActionArea component={Link} to={`/user/${user._id}`}>
        <CardMedia className={classes.media} image={image} title={user.username} />
        <CardContent>
          <Grid container justify="space-between" alignItems="center">
            <Typography variant="h6" gutterBottom>
              {user.firstName} {user.lastName}, {getAge(user.birthDate)}
            </Typography>
            <Typography variant="caption">
              {parseFloat(user.distance).toFixed(1)} {constants.distanceUnit}
            </Typography>
          </Grid>
          <Interests interests={user.interests} />
          <Typography noWrap className={classes.mt1}>
            {user.biography}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default withStyles(styles)(Component);
