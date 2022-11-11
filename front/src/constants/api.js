export const BASE_URL = 'http://www.groupcalendars.shop/api';

export const USER_URL = {
  LOGIN: '/auth/signin',
  SINGUP: '/auth/signup',
  LOGOUT: '/auth/logout',
  CHECK_CALENDAR: '/auth/checkedCalendar',
  USER_PROFILE_IMAGE: '/auth/setUserProfileImage',
  USER_CHANGE_NAME: '/auth/changeNickname',
  USER_CHANGE_PASSWORD: '/auth/changePassword',
  USER_CHANGE_PROFILE_IMAGE: '/auth/changeProfileImage',
  USER_DELETE: '/auth/resign',
};

export const CALENDAR_URL = {
  GET_ALL_CALENDAR: '/calendar/getMyCalendars',
  CREATE_CALENDAR: '/calendar/createGroupCalendar',
  UPDATE_CALENDAR: '/calendar/editCalendar',
  DELETE_CALENDAR: '/calendar/deleteCalendar',
  INVITE_CALENDAR: '/calendar/inviteGroupCalendar',
  ACCEPT_CALENDAR_INVITE: '/calendar/acceptCalendarInvite',
  REJECT_CALENDAR_INVITE: '/calendar/rejectCalendarInvite',
  GIVE_AUTHORITY: '/calendar/giveAuthority',
  SEND_OUT_USER: '/calendar/sendOutUser',
  RESIGN_CALENDAR: '/calendar/resignCalendar',
};

export const EVENT_URL = {
  GET_ALL_CALENDAR_AND_EVENT: '/event/getAllEvent',
  GET_ALL_EVENT: '/event/getAllEventForYear',
  GET_EVENT_DETAIL: '/event/getEvent',
  CREATE_EVENT: '/event/createEvent',
  DELETE_EVENT: '/event/deleteEvent',
  UPDATE_EVENT: '/event/editEvent',
  UPDATE_EVENT_COLOR: '/event/editEventColor',
  UPDATE_EVENT_INVITE_STATE: '/event/changeEventInviteState',
  CHECK_CREATE_EVENT_INVITE: '/event/inviteCheckBeforeCreate',
  CHECK_EDIT_EVENT_INVITE: '/event/inviteCheck',
  SEARCH_EVENT: '/event/searchEvent',
  INVITE_EVENT: '/event/inviteGroupEvent',
};

export const ALERT_URL = {
  GET_ALL_ALERT: '/alert/getAlerts',
};
