export const BASE_URL = 'http://158.247.214.79/api';

export const USER_URL = {
  LOGIN: '/user/signin',
  SINGUP: '/user/signup',
  LOGOUT: '/user/logout',
  CHECK_CALENDAR: '/user/checkedCalendar',
};

export const CALENDAR_URL = {
  CREATE_CALENDAR: '/calendar/createGroupCalendar',
  UPDATE_GROUP_CALENDAR: '/calendar/editGroupCalendar',
  UPDATE_PRIVATE_CALENDAR: '/privateCalendar/editPrivateCalendar',
  DELETE_GROUP_CALENDAR: '/calendar/deleteGroupCalendar',
};

export const EVENT_URL = {
  GET_ALL_CALENDAR_AND_EVENT: '/event/getAllEvent',
  GET_EVENT_DETAIL: '/event/getGroupEvent',
  UPDATE_EVENT_INVITE_STATE: '/event/changeEventInviteState',
  CREATE_GROUP_EVENT: '/event/createGroupEvent',
  CREATE_PRIVATE_EVENT: '/privateEvent/createPrivateEvent',
};
