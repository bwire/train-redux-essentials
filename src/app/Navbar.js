import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  fetchNotificationsWS,
  selectNotificationsMetadata,
  useGetNotificationsQuery,
} from '../features/notifications/notificationSlice';

export const Navbar = () => {
  const dispatch = useDispatch();

  // Trigger initial fetch of notifications and keep the websocket open to receive updates
  useGetNotificationsQuery();

  const notificationsMetadata = useSelector(selectNotificationsMetadata);
  const numUnreadNotifications = notificationsMetadata.filter(
    (n) => !n.read
  ).length;

  const fetchNewNotifications = () => {
    dispatch(fetchNotificationsWS());
  };

  let unreadNotificationsBadge;

  if (numUnreadNotifications > 0) {
    unreadNotificationsBadge = (
      <span className="badge">{numUnreadNotifications}</span>
    );
  }

  return (
    <nav>
      <section>
        <h1>Redux Essentials Example</h1>

        <div className="navContent">
          <div className="navLinks">
            <Link to="/">Posts</Link>
            <Link to="/users">Users</Link>
            <Link to="/notifications">
              Notifications {unreadNotificationsBadge}
            </Link>
          </div>
          <button className="button" onClick={fetchNewNotifications}>
            Refresh notifications
          </button>
        </div>
      </section>
    </nav>
  );
};
