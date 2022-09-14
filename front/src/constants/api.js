export const BASE_URL = 'http://158.247.214.79/api';

export const USER_URL = {
  LOGIN: '/auth/signin',
  SINGUP: '/auth/signup',
  LOGOUT: '/auth/logout',
  CHECK_CALENDAR: '/auth/checkedCalendar',
  USER_PROFILE_IMAGE: '/auth/setUserProfileImage',
};

export const CALENDAR_URL = {
  CREATE_CALENDAR: '/calendar/createGroupCalendar',
  UPDATE_GROUP_CALENDAR: '/calendar/editGroupCalendar',
  UPDATE_PRIVATE_CALENDAR: '/privateCalendar/editPrivateCalendar',
  DELETE_GROUP_CALENDAR: '/calendar/deleteGroupCalendar',
  GET_MY_CALENDARS: '/calendar/getMyCalendars',
  GIVE_AUTHORITY: '/calendar/giveAuthority',
  INVITE_GROUP_CALENDAR: '/calendar/inviteGroupCalendar',
  SEND_OUT_USER: '/calendar/sendOutUser',
  RESIGN_CALENDAR: '/calendar/resignCalendar',
  RESIGN_GROUP_CALENDAR: '/calendar/resignCalendar',
  ACCEPT_CALENDAR_INVITE: '/calendar/acceptCalendarInvite',
  REJECT_CALENDAR_INVITE: '/calendar/rejectCalendarInvite',
};

export const EVENT_URL = {
  GET_ALL_CALENDAR_AND_EVENT: '/event/getAllEvent',
  GET_GROUP_EVENT_DETAIL: '/event/getGroupEvent',
  GET_PRIVATE_EVENT_DETAIL: '/privateEvent/getPrivateEvent',
  UPDATE_EVENT_INVITE_STATE: '/event/changeEventInviteState',
  CREATE_GROUP_EVENT: '/event/createGroupEvent',
  DELETE_GROUP_EVENT: '/event/deleteGroupEvent',
  UPDATE_GROUP_EVENT: '/event/editGroupEvent',
  UPDATE_GROUP_EVENT_COLOR: '/event/editGroupEventColor',
  CREATE_PRIVATE_EVENT: '/privateEvent/createPrivateEvent',
  DELETE_PRIVATE_EVENT: '/privateEvent/deletePrivateEvent',
  UPDATE_PRIVATE_EVENT: '/privateEvent/editPrivateEvent',
  UPDATE_PRIVATE_EVENT_COLOR: '/privateEvent/editPrivateEventColor',
  SEARCH_EVENT: '/event/searchEvent',
  CHECK_EVENT_INVITE: '/event/inviteCheck',
  CHECK_CREATE_EVENT_INVITE: '/event/inviteCheckBeforeCreateEvent',
  CHECK_EDIT_EVENT_INVITE: '/event/inviteCheck',
  INVITE_GROUP_EVENT: '/event/inviteGroupEvent',
  ALL_EVENT: '/event/getAllEventForYear',
};

export const ALERT_URL = {
  GET_ALL_ALERT: '/alert/getAlerts',
};
