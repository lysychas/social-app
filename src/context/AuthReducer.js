const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return { user: action.payload, isFetching: true, error: false };

    case "LOGIN_SUCCESS":
      return { user: action.payload, isFetching: false, error: false };

    case "LOGIN_FAILURE":
      return { user: null, isFetching: false, error: action.payload };

    case "FOLLOW":
      return {
        ...state, // spreading/pasting the curent state here = { user: *, isFetching: *, error: * };
        user: {
          ...state.user,
          followings: [...state.user.followings, action.payload],
        },
      };

    case "UNFOLLOW":
      return {
        ...state,
        user: {
          ...state.user, // spread/paste everything here, but change the followings
          followings: state.user.followings.filter(
            (following) => following !== action.payload
          ),
        },
      };

    default:
      return state;
  }
};

export default AuthReducer;
