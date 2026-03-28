import os
import requests
from jose import jwt
from fastapi import HTTPException, Security, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose.exceptions import JWTError, ExpiredSignatureError
from dotenv import load_dotenv
from typing import Optional

async def get_optional_user(credentials: Optional[HTTPAuthorizationCredentials] = Security(HTTPBearer(auto_error=False))):
    if credentials is None:
        return None
    try:
        jwks = get_jwks()
        token = credentials.credentials
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header.get("kid")
        if not kid:
            return None
            
        rsa_key = {}
        for key in jwks["keys"]:
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
            return None
            
        payload = jwt.decode(
            token,
            rsa_key,
            algorithms=["RS256"],
            audience=None,
            issuer=CLERK_ISSUER_URL
        )
        
        return payload.get("sub")
    except Exception:
        return None

load_dotenv()

# Clerk Settings
CLERK_ISSUER_URL = os.getenv("CLERK_ISSUER_URL", "https://coherent-flounder-70.clerk.accounts.dev")
CLERK_JWKS_URL = f"{CLERK_ISSUER_URL}/.well-known/jwks.json"

security = HTTPBearer()

# Cache for JWKS
_jwks = None

def get_jwks():
    global _jwks
    if _jwks is None:
        try:
            response = requests.get(CLERK_JWKS_URL)
            response.raise_for_status()
            _jwks = response.json()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to fetch JWKS from Clerk: {e}")
    return _jwks

async def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    jwks = get_jwks()
    
    try:
        # Get the unverified header to find the kid
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header.get("kid")
        if not kid:
            raise HTTPException(status_code=401, detail="Header missing 'kid'")
            
        # Find the correct key in JWKS
        rsa_key = {}
        for key in jwks["keys"]:
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
            raise HTTPException(status_code=401, detail="Could not find appropriate key")
            
        # Verify the JWT
        payload = jwt.decode(
            token,
            rsa_key,
            algorithms=["RS256"],
            audience=None, # In Clerk, audience is usually not set or is the frontend URL
            issuer=CLERK_ISSUER_URL
        )
        
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Token missing 'sub'")
            
        return user_id

    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {e}")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Auth error: {e}")
