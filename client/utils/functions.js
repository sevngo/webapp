import { reduce, filter, isEmpty, path, split } from 'ramda';

export const getAge = dateString => {
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
};

export const getIds = reduce((acc, object) => [...acc, object._id], []);

export const compact = filter(value => value && !isEmpty(value));

export const getFieldError = (name, errors, touched) => {
  const names = split('.')(name);
  const pathName = path(names);
  const error = pathName(errors);
  const isError = error && pathName(touched);
  return { isError, error };
};
