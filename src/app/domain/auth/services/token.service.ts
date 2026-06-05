export interface TokenService {
  generateAccessToken(payload: object): Promise<string>;
}
