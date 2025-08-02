
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URL;
const AUTH_SCOPE = "user-read-private user-read-email playlist-modify-private";

/**
  Type Definitions

  @typedef {{
    country: string;
    display_name: string;
    email: string;
    explicit_content: {
      filter_enabled: boolean;
      filter_locked: boolean;
    };
    external_urls: {
      spotify: string;
    };
    followers: {
      href: string;
      total: number;
    };
    href: string;
    id: string;
    images: {
      url: string;
      height: number;
      width: number;
    };
    product: string;
    type: string;
    uri: string;
  }} ProfileData
*/

/**
  Authentication error type for when authentication errors occur.
*/
class AuthError extends Error {
  constructor(message, options) {
    super(message, options);
  }
}

/**
  Generates a random string of characters with the given length

  @param {number} length
  @returns {string}
*/
function generateRandomString(length) {
  const allowedCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let str = "";
  for (length; length >= 0; length--) {
    str += allowedCharacters[Math.floor((Math.random() * allowedCharacters.length))];
  }
  return str;
}

/**
  Basic sha256 crypto algorithm using `window.crypto.subtle.digest()`.
  Found from Spotify API documentation:
  (https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow)

  @param {string} plainData
  @returns {Promise<ArrayBuffer>}
*/
async function sha256(plainData) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plainData);
  return await window.crypto.subtle.digest('SHA-256', data);
}

function base64Encode(input) {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

/**
  Redirects the user to the auth code flow.

  @returns {Promise}
*/
export async function redirectToAuthCodeFlow() {
  const codeVerifier = generateRandomString(64);
  const hashedVerifier = await sha256(codeVerifier);
  const codeChallenge = base64Encode(hashedVerifier);
  const authUrl = new URL("https://accounts.spotify.com/authorize");

  localStorage.setItem("spotify_auth_state", codeVerifier);

  const params = {
    response_type: "code",
    client_id: CLIENT_ID,
    scope: AUTH_SCOPE,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    redirect_uri: REDIRECT_URI
  };

  console.log("Redirecting to auth code flow...");
  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl;
}

/**
  Authenticates the user with the given authentication code. Returns the new
  access token if successful.

  @returns {Promise<string?>}
*/
export async function authenticateUser(code) {
  let codeVerifier = localStorage.getItem("spotify_auth_state");

  if (codeVerifier && code) {
    const result = await fetch("https://accounts.spotify.com/api/token", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier
      })
    });
    const response = await result.json();

    if (response.error) {
      if (response.error === "invalid_grant") {
        throw new AuthError(response.error_description);
      } else {
        throw Error(`${response.error}: ${response.error_description}`);
      }
    }

    // Date.now() is in milliseconds while the expire date is stored in seconds.
    localStorage.setItem("expire_date", Date.now() + response.expires_in * 1000);
    localStorage.setItem("access_token", response.access_token);
    localStorage.setItem("refresh_token", response.refresh_token);

    console.log("User has been authorized successfully!");

    return response.access_token;
  }

  console.log("Unable to authenticate user.");
  return null;
}

/**
  Refreshes the access token if needed, stores the new token into local
  storage, and returns the new token as long as an access token already exists.
  If the current access token hasn't expired, this function will return the
  currently existing access token.

  @returns {Promise<string?>}
*/
export async function refreshAuthToken() {
  const accessToken = localStorage.getItem("access_token");

  if (accessToken) {
    const expireDate = localStorage.getItem("expire_date");

    if (expireDate && Date.now() >= expireDate) {
      const refreshToken = localStorage.getItem("refresh_token");
      const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
          client_id: CLIENT_ID
        })
      });
      const response = await result.json();

      // Fallback to the original access token if an error is thrown.
      if (response.error) {
        return localStorage.getItem("access_token");
      }

      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem("expire_date", Date.now() + response.expires_in);

      if (response.refresh_token) {
        localStorage.setItem("refresh_token", response.refresh_token);
      }

      console.log("Access token refreshed.");
      return response.access_token;
    } else {
      return accessToken;
    }
  }

  return null;
}

/**
  Attempts to authorize the Spotify user if the user isn't already authorized,
  and returns a new access token if successful. This function essensially calls
  `redirectAuthCodeFlow()`, `authenticateUser()`, and `refreshAuthToken()`
  automatically so you don't have to do everything manually.

  @returns {string?}
*/
export async function getAccessToken() {
  // We need to refresh the access token if it expires.
  let accessToken = await refreshAuthToken();
  if (accessToken && accessToken !== "undefined") {
    return accessToken;
  }

  // If there is no access token, we need to create a new access token.
  // Spotify sends the authentication code through search parameters.
  const urlParams = new URLSearchParams(window.location.search);
  const errorString = urlParams.get("error");
  let code = urlParams.get("code");
  let codeVerifier = localStorage.getItem("spotify_auth_state");

  // Spotify also sends errors through the search parameters.
  if (errorString) {
    throw Error(`An error has occured!\n${errorString}`);
  }

  if (code) {
    // Store the code in local storage and wipe the URL clean.
    localStorage.setItem("auth_code", code);
    history.replaceState(null, "", REDIRECT_URI);
  } else {
    // Get the auth code from local storage.
    code = localStorage.getItem("auth_code");
  }

  try {
    accessToken = await authenticateUser(code);
    if (accessToken) {
      return accessToken;
    }
  } catch (err) {
    if (err instanceof AuthError) {
      redirectToAuthCodeFlow();
    } else {
      console.error(`An error has occured!\n${err}`);
      return null;
    }
  }

  redirectToAuthCodeFlow();
}

/**
  Shortcut function that returns the user's profile data.

  @returns {Promise<ProfileData>}
*/
export async function getUserProfile() {
  const accessToken = await getAccessToken();
  const result = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  });

  if (!result.ok) {
    throw Error("Unable to get profile!");
  }

  return await result.json();
}

