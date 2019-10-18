import React, { useState } from 'react';
import { withFormik, Field } from 'formik';
import { FormattedMessage } from 'react-intl';
import { has, compose, map, isNil, path } from 'ramda';
import { Grid, Button, FormControlLabel, Radio as MRadio, MenuItem } from '@material-ui/core';
import IconButton from '../IconButton';
import Input from '../Input';
import Radio from '../Radio';
import Select from '../Select';
import Interests from '../Interests';
import Range from '../Range';
import Slider from '../Slider';
import { useGeolocation, useAutocomplete } from '../../hooks/googleMaps';
import {
  composeValidators,
  isRequired,
  isEmail,
  isShort,
  isLong,
  isYoung,
  isOld,
  isTrimmed,
} from '../../utils';
import { GENDER_OPTIONS, SORT_BY_OPTIONS, INTERESTS_OPTIONS } from './constants';
import useStyles from './styles';
import messages from './messages';
import { compact } from '../../utils';

const Component = ({
  handleSubmit,
  initialValues,
  isValid,
  disabled,
  resetForm,
  dirty,
  setFieldValue,
  values,
  isGeoActivated,
}) => {
  const classes = useStyles();
  const [showPassword, toggleShowPassword] = useState(false);
  const hasAddress = !isNil(path(['address', 'coordinates'])(values));
  const handleAddress = address => setFieldValue('address', address);
  useGeolocation(handleAddress, !isNil(values['address']) && isGeoActivated);
  useAutocomplete('address', handleAddress, !isNil(values['address']));
  return (
    <form onSubmit={handleSubmit}>
      {has('username', initialValues) && (
        <Field
          name="username"
          label={<FormattedMessage {...messages.username} />}
          component={Input}
          validate={composeValidators(isRequired, isShort, isLong(30), isTrimmed)}
          startAdornment="account_circle"
          disabled={disabled}
        />
      )}
      {has('password', initialValues) && (
        <Field
          name="password"
          label={<FormattedMessage {...messages.password} />}
          component={Input}
          validate={composeValidators(isRequired, isShort, isLong(30), isTrimmed)}
          type={showPassword ? 'text' : 'password'}
          startAdornment="vpn_key"
          endAdornment={
            <IconButton onClick={() => toggleShowPassword(!showPassword)}>
              {showPassword ? 'visibility' : 'visibility_off'}
            </IconButton>
          }
        />
      )}
      {has('newPassword', initialValues) && (
        <Field
          name="newPassword"
          label={<FormattedMessage {...messages.newPassword} />}
          component={Input}
          validate={composeValidators(isShort, isLong(30), isTrimmed)}
          type={showPassword ? 'text' : 'password'}
          startAdornment="vpn_key"
          endAdornment={
            <IconButton onClick={() => toggleShowPassword(!showPassword)}>
              {showPassword ? 'visibility' : 'visibility_off'}
            </IconButton>
          }
        />
      )}
      {has('email', initialValues) && (
        <Field
          name="email"
          label={<FormattedMessage {...messages.email} />}
          component={Input}
          validate={composeValidators(isRequired, isEmail, isLong(30), isTrimmed)}
          startAdornment="alternate_email"
          disabled={disabled}
        />
      )}
      {has('firstName', initialValues) && (
        <Field
          name="firstName"
          label={<FormattedMessage {...messages.firstName} />}
          component={Input}
          validate={composeValidators(isRequired, isLong(30), isTrimmed)}
          disabled={disabled}
        />
      )}
      {has('lastName', initialValues) && (
        <Field
          name="lastName"
          label={<FormattedMessage {...messages.lastName} />}
          component={Input}
          validate={composeValidators(isRequired, isLong(30), isTrimmed)}
          disabled={disabled}
        />
      )}
      {has('birthDate', initialValues) && (
        <Field
          name="birthDate"
          label={<FormattedMessage {...messages.birthDate} />}
          component={Input}
          validate={composeValidators(isRequired, isYoung, isOld)}
          type="date"
          startAdornment="date_range"
          disabled={disabled}
        />
      )}
      {has('gender', initialValues) && (
        <div className={classes.gender}>
          <Field
            name="gender"
            label={<FormattedMessage {...messages.gender} />}
            component={Radio}
            validate={isRequired}
          >
            {map(gender => (
              <FormControlLabel
                key={gender.id}
                value={gender.value}
                control={<MRadio color="primary" />}
                label={<FormattedMessage {...messages[gender.id]} />}
                disabled={disabled}
              />
            ))(GENDER_OPTIONS)}
          </Field>
        </div>
      )}
      {has('address', initialValues) && (
        <Field
          name="address.name"
          id="address"
          label={<FormattedMessage {...messages.address} />}
          component={Input}
          disabled={disabled || hasAddress}
          validate={() => isRequired(hasAddress)}
          endAdornment={
            hasAddress &&
            !disabled && (
              <IconButton onClick={() => setFieldValue('address', { name: '' })}>clear</IconButton>
            )
          }
        />
      )}
      {has('ageRange', initialValues) && (
        <div className={classes.p1}>
          <Field
            name="ageRange"
            label={<FormattedMessage {...messages.ageRange} />}
            component={Range}
            min={18}
            max={50}
            setFieldValue={setFieldValue}
          />
        </div>
      )}
      {has('maxDistance', initialValues) && (
        <div className={classes.p1}>
          <Field
            name="maxDistance"
            label={<FormattedMessage {...messages.maxDistance} />}
            unitLabel={<FormattedMessage {...messages.unitDistance} />}
            component={Slider}
            min={50}
            max={20000}
            step={50}
            setFieldValue={setFieldValue}
          />
        </div>
      )}
      {has('interests', initialValues) && (
        <Field
          name="interests"
          label={<FormattedMessage {...messages.interests} />}
          component={Select}
          multiple
          validate={isLong(4)}
          disabled={disabled}
          renderValue={selected => <Interests interests={selected} />}
        >
          {map(option => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))(INTERESTS_OPTIONS)}
        </Field>
      )}
      {has('biography', initialValues) && (
        <Field
          name="biography"
          label={<FormattedMessage {...messages.biography} />}
          component={Input}
          validate={composeValidators(isLong(300), isTrimmed)}
          multiline
          rows="3"
          disabled={disabled}
        />
      )}
      {has('sortBy', initialValues) && (
        <Field name="sortBy" label={<FormattedMessage {...messages.sortBy} />} component={Select}>
          {map(option => (
            <MenuItem key={option.id} value={option.value}>
              <FormattedMessage {...messages[option.id]} />
            </MenuItem>
          ))(SORT_BY_OPTIONS)}
        </Field>
      )}
      <Grid container justify="center">
        {!disabled && (
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={!isValid}
            className={classes.mt1}
            fullWidth
          >
            <FormattedMessage {...messages.submit} />
          </Button>
        )}
        {!disabled && (
          <Button
            variant="outlined"
            color="primary"
            size="large"
            disabled={!dirty}
            onClick={() => resetForm(initialValues)}
            fullWidth
          >
            <FormattedMessage {...messages.cancel} />
          </Button>
        )}
      </Grid>
    </form>
  );
};

export default compose(
  withFormik({
    mapPropsToValues: ({ initialValues }) => initialValues,
    handleSubmit: (values, { props: { submit } }) => submit(compact(values)),
    displayName: 'UserForm',
    enableReinitialize: true,
  }),
)(Component);
