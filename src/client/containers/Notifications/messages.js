import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'containers.notifications.title',
    defaultMessage: 'Notifications',
  },
  friendLogged: {
    id: 'containers.notifications.friendLogged',
    defaultMessage: '{username} has logged in',
  },
  gotLiked: {
    id: 'containers.notifications.gotLiked',
    defaultMessage: '{username} has liked you',
  },
  gotFriended: {
    id: 'containers.notifications.gotFriended',
    defaultMessage: '{username} is your new friend',
  },
  gotUnfriended: {
    id: 'containers.notifications.gotUnfriended',
    defaultMessage: '{username} is not your friend anymore',
  },
});
