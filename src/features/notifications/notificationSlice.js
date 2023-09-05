import {
  createAction,
  createEntityAdapter,
  createSelector,
  createSlice,
  isAnyOf,
} from '@reduxjs/toolkit';
import { forceGenerateNotifications } from '../../api/server';
import { apiSlice } from '../api/apiSlice';
import { WebSocket } from 'mock-socket';

const notificationsReceivedAction = createAction(
  'notifications/notificationsReceived'
);

const notificationsAdapter = createEntityAdapter();

const apiNotificationsSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => '/notifications',
      onCacheEntryAdded: async (
        _a,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch }
      ) => {
        // websocket connection
        const ws = new WebSocket('ws://localhost');
        try {
          // wait for the initial query to resolve
          await cacheDataLoaded;
          // when data is received from the socket connection to the server,
          // update our query result with the received message
          const listener = (event) => {
            const message = JSON.parse(event.data);
            switch (message.type) {
              case 'notifications': {
                updateCachedData((draft) => {
                  // Insert all received notifications from the websocket
                  // into the existing RTK cache array
                  draft.push(...message.payload);
                  draft.sort((a, b) => b.date.localeCompare(a.data));
                });
                // Dispatch an additional action so we can track "read" state
                dispatch(notificationsReceivedAction(message.payload));
                break;
              }
              default: {
                break;
              }
            }
          };
          ws.addEventListener('message', listener);
        } catch (error) {
          // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
          // in which case `cacheDataLoaded` will throw
        }
        // cacheEntryRemoved will resolve when the cache subscription is no longer active
        await cacheEntryRemoved;
        ws.close();
      },
    }),
  }),
});

const getNotificationsEndpoint =
  apiNotificationsSlice.endpoints.getNotifications;

const selectNotificationsData = createSelector(
  getNotificationsEndpoint.select(),
  (result) => result.data ?? []
);

export const fetchNotificationsWS = () => (_, getState) => {
  const allNotifications = selectNotificationsData(getState());
  const [latestNotification] = allNotifications;
  const latestTimestamp = latestNotification?.date ?? '';
  // Hardcode a call to the mock server to simulate a server push scenario over websockets
  forceGenerateNotifications(latestTimestamp);
};

const matchNotificationsReceived = isAnyOf(
  notificationsReceivedAction,
  apiSlice.endpoints.getNotifications.matchFulfilled
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: notificationsAdapter.getInitialState(),
  reducers: {
    allNotificationRead: (state, action) => {
      Object.values(state.entities).forEach((n) => (n.read = true));
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(matchNotificationsReceived, (state, action) => {
      // Add client-side metadata for tracking new notifications
      const notificationsMetadata = action.payload.map((n) => ({
        id: n.id,
        read: false,
        isNew: true,
      }));

      Object.values(state.entities).forEach((n) => (n.isNew = !n.read));
      notificationsAdapter.upsertMany(state, notificationsMetadata);
    });
  },
});

// extended api
export const { useGetNotificationsQuery } = apiNotificationsSlice;
export const { allNotificationRead } = notificationSlice.actions;
export const {
  selectAll: selectNotificationsMetadata,
  selectEntities: selectMetadataEntities,
} = notificationsAdapter.getSelectors(({ notifications }) => notifications);

export default notificationSlice.reducer;
