# How to Enable Netlify Blobs 🔧

Since you've used Blobs before, you just need to enable it for this site!

## Option 1: Enable via Netlify Dashboard (Easiest)

1. Go to your [Netlify Dashboard](https://app.netlify.com)
2. Select your map-pin-app site
3. Go to **Site Configuration** → **Environment Variables**
4. Scroll down or look for **Netlify Blobs** section
5. Click **Enable Netlify Blobs** (if you see this option)

OR

1. Go to **Site Configuration** → **General**
2. Look for **Beta Features** or **Add-ons** section
3. Enable **Netlify Blobs**

## Option 2: Enable via Netlify CLI

Run this command in your project directory:

```bash
netlify addons:create blobs
```

Or if that doesn't work:

```bash
netlify blobs:enable
```

## Option 3: Redeploy (Sometimes Auto-Enables)

Sometimes just redeploying with the updated function code will auto-enable Blobs:

```bash
netlify deploy --prod
```

## After Enabling

Once you've enabled Blobs, just redeploy:

```bash
netlify deploy --prod
```

Then refresh your app - it should work! ✨

## Verify It's Working

After deploying, check if it works:

1. Open your app
2. Try dropping a pin
3. Check the Functions log in Netlify Dashboard - you should see no errors

OR run this in your browser console:

```javascript
fetch('/api/pins').then(r => r.json()).then(console.log)
```

You should see `{pins: []}` with no errors!

## Still Getting the Error?

If you still see the `MissingBlobsEnvironmentError`, the function has been updated to accept manual configuration. You can set these environment variables in your Netlify Dashboard:

1. Go to **Site Configuration** → **Environment Variables**
2. Add:
   - `SITE_ID` = your site ID (find it in Site Configuration → General)
   - `NETLIFY_TOKEN` = create one at User Settings → Applications → Personal Access Tokens

But you shouldn't need this if Blobs is properly enabled!

