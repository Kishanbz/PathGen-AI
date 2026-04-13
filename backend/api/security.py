import os
import time
import httpx
from jose import jwt
from fastapi import HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose.exceptions import JWTError, ExpiredSignatureError
from dotenv import load_dotenv
from typing import Optional

load_dotenv()

# Clerk Settings
CLERK_ISSUER_URL = os.getenv("CLERK_ISSUER_URL", "https://coherent-flounder-70.clerk.accounts.dev")
CLERK_JWKS_URL = f"{CLERK_ISSUER_URL}/.well-known/jwks.json"
DEBUG = os.getenv("DEBUG", "True").lower() == "true"

security = HTTPBearer()

# JWKS cache with TTL
_jwks = None
_jwks_fetched_at = 0
_JWKS_TTL = 600  # 10 minutes

def get_jwks_sync():
    """Synchronous JWKS fetch with caching and timeout."""
    global _jwks, _jwks_fetched_at
    now = time.time()
    if _jwks is not None and (now - _jwks_fetched_at) < _JWKS_TTL:
        return _jwks
    try:
        with httpx.Client(timeout=5.0) as client:
            response = client.get(CLERK_JWKS_URL)
            response.raise_for_status()
            _jwks = response.json()
            _jwks_fetched_at = now
    except Exception as e:
        print(f"WARN: Failed to fetch JWKS: {e}")
        if _jwks is not None:
            return _jwks
        if DEBUG:
            return {"keys": []}
        raise HTTPException(status_code=500, detail=f"Failed to fetch JWKS: {e}")
    return _jwks

def _verify_token(token: str) -> str:
    """Core token verification logic."""
    if DEBUG and token == "dev_token":
        return "user_dev_123"

    jwks = get_jwks_sync()

    try:
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header.get("kid")

        rsa_key = {}
        for key in jwks.get("keys", []):
            if key["kid"] == kid:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"]
                }
                break

        if not rsa_key:
            if DEBUG:
                payload = jwt.get_unverified_claims(token)
                return payload.get("sub", "dev_user")
            raise HTTPException(status_code=401, detail="Could not find appropriate key")

        payload = jwt.decode(
            token,
            rsa_key,
            algorithms=["RS256"],
            audience=None,
            options={"verify_iss": False} if DEBUG else {},
            issuer=CLERK_ISSUER_URL if not DEBUG else None
        )

        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Token missing 'sub'")
        return user_id

    except ExpiredSignatureError:
        if DEBUG:
            return jwt.get_unverified_claims(token).get("sub", "dev_user")
        raise HTTPException(status_code=401, detail="Token has expired")
    except JWTError as e:
        if DEBUG:
            return jwt.get_unverified_claims(token).get("sub", "dev_user")
        raise HTTPException(status_code=401, detail=f"Invalid token: {e}")
    except HTTPException:
        raise
    except Exception as e:
        if DEBUG:
            return "dev_user"
        raise HTTPException(status_code=401, detail=f"Auth error: {e}")

async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Security(HTTPBearer(auto_error=False))
):
    if credentials is None:
        return None
    try:
        return _verify_token(credentials.credentials)
    except Exception:
        return None

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    return _verify_token(credentials.credentials)
