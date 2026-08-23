@echo off
setlocal EnableExtensions
title Looters Group - Sign in setup
color 0A
cls
echo.
echo   LOOTERS GROUP  -  Sign in setup
echo   -------------------------------
echo   Three websites. Copy, paste, redeploy. Takes about 10 minutes.
echo.

powershell -NoProfile -Command "$s = -join ((1..64) | ForEach-Object { '{0:x}' -f (Get-Random -Max 16) }); Set-Content -Path $env:TEMP\looters-env.txt -Value ('BETTER_AUTH_URL=https://looters-group-ltd.vercel.app' + [Environment]::NewLine + 'BETTER_AUTH_SECRET=' + $s)"

echo   STEP 1 / 3   Neon database  (free, sign in with GitHub)
echo.
echo   1. Create account / sign in
echo   2. Create a project  (any name, e.g. looters)
echo   3. Copy the connection string that starts with  postgresql://
echo.
echo   Opening Neon...
pause
start "" "https://console.neon.tech"

echo.
echo   Keep that connection string handy. Vercel name is:  DATABASE_URL
echo.
pause

cls
echo.
echo   STEP 2 / 3   GitHub login  (free)
echo.
echo   On the form GitHub opens, type EXACTLY:
echo.
echo      Application name:   Looters Group
echo      Homepage URL:       https://looters-group-ltd.vercel.app
echo      Callback URL:       https://looters-group-ltd.vercel.app/api/auth/callback/github
echo.
echo   Click Register. Then Generate a new client secret.
echo   Copy Client ID and Client Secret.
echo.
echo   Opening GitHub OAuth app form...
pause
start "" "https://github.com/settings/applications/new"

echo.
pause

cls
echo.
echo   STEP 3 / 3   Paste into Vercel, then Redeploy
echo.
echo   Open your project  looters-group-ltd
echo     Settings  -  Environment Variables
echo.
echo   Add these names (Production + Preview):
echo.
echo      DATABASE_URL              (Neon string from step 1)
echo      GITHUB_CLIENT_ID          (from step 2)
echo      GITHUB_CLIENT_SECRET      (from step 2)
echo      BETTER_AUTH_URL           https://looters-group-ltd.vercel.app
echo      BETTER_AUTH_SECRET        (already generated - Notepad will open)
echo.
echo   Then: Deployments tab - latest deploy - ... menu - Redeploy
echo   Wait until it finishes. Then try Sign in with GitHub.
echo.
echo   Opening Vercel + your secret notepad...
pause
start "" "https://vercel.com/dashboard"
start notepad "%TEMP%\looters-env.txt"

echo.
echo   Optional later:
echo     Google callback  https://looters-group-ltd.vercel.app/api/auth/callback/google
echo     X callback       https://looters-group-ltd.vercel.app/api/auth/callback/twitter
echo.
echo   Tradevine (live APARL labels) - same four keys you already have on Render.
echo.
pause
endlocal
