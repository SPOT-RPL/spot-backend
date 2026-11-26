import { jwtVerify, SignJWT, type JWTPayload } from "jose";

const JWT_ISSUER = process.env.JWT_ISSUER;
const JWT_AUDIENCE = process.env.JWT_AUDIENCE;
const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const ACCESS_AGE = "15m";
const REFRESH_AGE = "1d";
const JWT_ALGO = "HS256";

if (!JWT_ISSUER) {
	throw new Error("Missing JWT_ISSUER environment variable");
}

if (!JWT_AUDIENCE) {
	throw new Error("Missing JWT_AUDIENCE environment variable");
}

if (!ACCESS_SECRET) {
	throw new Error("Missing ACCESS_SECRET environment variable");
}

if (!REFRESH_SECRET) {
	throw new Error("Missing REFRESH_SECRET environment variable");
}

const ENCODED_ACCESS_SECRET = new TextEncoder().encode(ACCESS_SECRET);
const ENCODED_REFRESH_SECRET = new TextEncoder().encode(REFRESH_SECRET);

if (ENCODED_ACCESS_SECRET.length < 32) {
	throw new Error("Access secret length must be at least 32 bytes");
}

if (ENCODED_REFRESH_SECRET.length < 32) {
	throw new Error("Refresh secret length must be at least 32 bytes");
}

interface TokenPayload extends JWTPayload {
	sub: string;
	iat: number;
	exp: number;
	type: "refresh" | "access";
}

export async function generateAccessToken(userID: string): Promise<string> {
	return new SignJWT({ type: "access" })
		.setProtectedHeader({ alg: JWT_ALGO })
		.setSubject(userID)
		.setIssuedAt()
		.setIssuer(JWT_ISSUER!)
		.setAudience(JWT_AUDIENCE!)
		.setExpirationTime(ACCESS_AGE)
		.sign(ENCODED_ACCESS_SECRET);
}

export async function generateRefreshToken(userID: string): Promise<string> {
	return new SignJWT({ type: "refresh" })
		.setProtectedHeader({ alg: JWT_ALGO })
		.setSubject(userID)
		.setIssuedAt()
		.setIssuer(JWT_ISSUER!)
		.setAudience(JWT_AUDIENCE!)
		.setExpirationTime(REFRESH_AGE)
		.sign(ENCODED_REFRESH_SECRET);
}

export async function verifyAccessToken(token: string): Promise<TokenPayload> {
	const { payload } = await jwtVerify(token, ENCODED_ACCESS_SECRET, {
		algorithms: [JWT_ALGO],
		issuer: JWT_ISSUER!,
		audience: JWT_AUDIENCE!,
		requiredClaims: ["sub", "iat", "exp"],
		maxTokenAge: ACCESS_AGE
	})

	if (typeof payload.sub !== "string") {
		throw new Error("Invalid access token");
	}

	return payload as TokenPayload;
}

export async function verifyRefreshToken(token: string): Promise<TokenPayload> {
	const { payload } = await jwtVerify(token, ENCODED_REFRESH_SECRET, {
		algorithms: [JWT_ALGO],
		issuer: JWT_ISSUER!,
		audience: JWT_AUDIENCE!,
		requiredClaims: ["sub", "iat", "exp"],
		maxTokenAge: REFRESH_AGE
	})

	if (typeof payload.sub !== "string") {
		throw new Error("Invalid access token");
	}

	return payload as TokenPayload;
}
