# Fixing JWT Session Errors

## Problem
After changing `NEXTAUTH_SECRET`, old session tokens can't be decrypted, causing:
- `JWT_SESSION_ERROR: decryption operation failed`
- 404 errors on protected routes

## Solution

### Option 1: Clear Browser Cookies (Recommended)
1. Open your browser
2. Go to Developer Tools (F12)
3. Navigate to Application/Storage → Cookies → `http://localhost:3000`
4. Delete all cookies starting with `next-auth`
5. Refresh the page and log in again

### Option 2: Use Incognito/Private Window
1. Open an incognito/private window
2. Navigate to `http://localhost:3000/admin/login`
3. Log in with your credentials

### Option 3: Clear All Cookies via Browser Console
Open browser console and run:
```javascript
// Clear all cookies
document.cookie.split(";").forEach(function(c) { 
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
});
location.reload();
```

## What Changed
- Updated `app/(admin)/layout.tsx` to handle JWT decryption errors gracefully
- Updated `middleware.ts` to properly handle missing tokens
- Old sessions encrypted with the previous secret will be invalidated

## After Fixing
1. Clear your browser cookies (see options above)
2. Restart your dev server if needed
3. Navigate to `/admin/login`
4. Log in again with your admin credentials
5. You should now be able to access `/admin/dashboard`

