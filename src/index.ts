import type { UserResponse } from "@fusionauth/typescript-client";
import { StrategyVerifyCallback } from "remix-auth";

import type {
  OAuth2Profile,
  OAuth2StrategyVerifyParams,
} from "remix-auth-oauth2";
import { OAuth2Strategy } from "remix-auth-oauth2";

/**
 * This interface declares what configuration the strategy needs from the
 * developer to correctly work.
 */
export interface FusionAuthStrategyOptions {
  host: string;
  callbackURL: string;
  clientId: string;
  clientSecret: string;
}

/**
 * This interface declares what the developer will receive from the strategy
 * to verify the user identity in their system.
 */
export interface FusionAuthUserInfo extends UserResponse, OAuth2Profile {}

export const fusionAuthEndpoints = {
  authorize: "/oauth2/authorize",
  token: "/oauth2/token",
  user: "/api/user",
};

export class FusionAuthStrategy<User> extends OAuth2Strategy<
  User,
  FusionAuthUserInfo
> {
  name = "FusionAuth";
  host: string;

  constructor(
    options: FusionAuthStrategyOptions,
    verify: StrategyVerifyCallback<
      User,
      OAuth2StrategyVerifyParams<FusionAuthUserInfo>
    >
  ) {
    super(
      {
        authorizationURL: `https://${options.host}${fusionAuthEndpoints.authorize}`,
        tokenURL: `https://${options.host}${fusionAuthEndpoints.token}`,
        clientID: options.clientId,
        clientSecret: options.clientSecret,
        callbackURL: options.callbackURL,
      },
      verify
    );
    this.host = options.host;
  }

  protected async userProfile(
    accessToken: string
  ): Promise<FusionAuthUserInfo> {
    const request = await fetch(
      `https://${this.host}${fusionAuthEndpoints.user}`,
      {
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      }
    );

    const response: UserResponse = await request.json();

    return {
      ...response,
      provider: "FusionAuth",
    };
  }
}
