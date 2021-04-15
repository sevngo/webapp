import React from 'react';
import axios from '../../../api';
import { fireEvent, render } from '@testing-library/react';
import TestProvider from '../../../components/TestProvider';
import Component from '../index';

global.google = {
  maps: {
    places: {
      Autocomplete: function () {
        return {
          setTypes: jest.fn(),
          setFields: jest.fn(),
          addListener: jest.fn(),
        };
      },
    },
  },
};

jest.mock('../../../api');

describe('OtherUser', () => {
  it('should load user then like and dislike', async () => {
    const _id = '60084a46203c4e342b13114c';
    axios.get.mockResolvedValue({
      data: {
        _id,
        username: 'Shanie21',
        birthDate: '1998-03-03T13:43:52.868Z',
        gender: 'male',
        address: {
          name: '247 Bert Village',
        },
      },
    });
    const { getByTestId, findByTestId } = render(
      <TestProvider initialState={{}}>
        <Component id={_id} />
      </TestProvider>
    );
    expect(axios.get).toHaveBeenCalledWith(`/api/users/${_id}`);
    await findByTestId('likeUser');
    axios.patch.mockResolvedValue({
      data: {
        usersLiked: [{ _id }],
        friends: [{ _id }],
      },
    });
    fireEvent.click(getByTestId('likeUser'));
    await findByTestId('dislikeUser');
    axios.patch.mockResolvedValue({
      data: {
        usersLiked: [],
        friends: [],
      },
    });
    fireEvent.click(getByTestId('dislikeUser'));
    await findByTestId('likeUser');
  });
});
