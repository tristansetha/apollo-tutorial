import React from "react";
import { gql, useMutation } from "@apollo/client";

import { LoginForm, Loading } from "../components";
import * as LoginTypes from "./__generated__/login";
import { isLoggedInVar} from '../cache'

/**
 * Our LOGIN_USER definition looks just like our queries from the previous section,
 * except it replaces the word query with mutation.
 * We receive a server-generated token in the response from login, which represents the user's active session.
 */

export const LOGIN_USER = gql`
  mutation login($email: String!) {
    login(email: $email)
  }
`;

// useMutation executes on event rather than component render like useQuery

export default function Login() {
  // login iis the mutate function we call to execute mutation. We pass this function to our LoginForm component
  // the second object in the tuple is similar to the result object retturned by useQuery

  // onCompleted callback enables us to interact with the mutation's result data as soon as it's available.
  const [login, { loading, error }] = useMutation<LoginTypes.login, LoginTypes.loginVariables>(LOGIN_USER, {
    onCompleted({ login }) {
      localStorage.setItem("token", login as string);
      isLoggedInVar(!!localStorage.getItem('token'));
    },
  });

  if (loading) return <Loading />;
  if (error) return <p>An error occurred</p>;

  return <LoginForm login={login} />;
}
