export const LoginStart = (userCredentials) => ({
  type: "LOGIN_START",
  payload: userCredentials,
});

export const LoginSuccess = (user) => ({
  type: "LOGIN_SUCCESS",
  payload: user,
});

export const LoginFailure = (error) => ({
  type: "LOGIN_FAILURE",
  payload: error,
});

export const Follow = (userId) => ({
  type: "FOLLOW",
  payload: userId,
});

export const Unfollow = (userId) => ({
  type: "UNFOLLOW",
  payload: userId,
});

// TODO: add follow/unfollow SUCCESS/FAILURE actions
// TODO: split Auth and User actions into separate files (AuthContext, User Context, etc.)
