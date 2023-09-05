import React, { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  allNotificationRead,
  selectMetadataEntities,
  useGetNotificationsQuery,
} from './notificationSlice';
import { selectAllUsers } from '../users/usersSlice';
import { formatDistanceToNow, parseISO } from 'date-fns';
import classnames from 'classnames';

export const NotificationsList = () => {
  const dispatch = useDispatch();
  const { data: notifications = [] } = useGetNotificationsQuery();
  const notificationsMetadata = useSelector(selectMetadataEntities);

  const users = useSelector(selectAllUsers);

  const renderedNotifications = notifications.map((n) => {
    const date = parseISO(n.date);
    const timeAgo = formatDistanceToNow(date);
    const user = users.find((u) => u.id === n.user) || { name: 'Unknown user' };

    const metadata = notificationsMetadata[n.id];

    const notificationClass = classnames('notification', {
      new: metadata.isNew,
    });
    return (
      <div key={n.id} className={notificationClass}>
        <div>
          <b>{user.name}</b>
          <span> {n.message}</span>
        </div>
        <div title={n.date}>
          <i>{timeAgo} ago</i>
        </div>
      </div>
    );
  });

  useLayoutEffect(() => {
    dispatch(allNotificationRead());
  }, [notifications.length, dispatch]);

  return (
    <section className="notificationsList">
      <h2>Notifications</h2>
      {renderedNotifications}
    </section>
  );
};
