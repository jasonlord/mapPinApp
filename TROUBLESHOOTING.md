# Troubleshooting Guide 🔧

## Error: 500 Internal Server Error on `/api/pins`

If you're seeing this error, here are the steps to fix it:

### Step 1: Redeploy Your Site

The functions code has been updated. Redeploy your site:

```bash
netlify deploy --prod
```

Or if using Git deployment, push your changes:

```bash
git add .
git commit -m "Fix Netlify Functions"
git push
```

### Step 2: Check Netlify Blobs is Enabled

1. Go to your [Netlify Dashboard](https://app.netlify.com)
2. Select your site
3. Go to **Site Configuration** > **Environment Variables**
4. Netlify Blobs should be automatically available (no setup needed)

### Step 3: View Function Logs

To see what's causing the error:

1. Go to your Netlify Dashboard
2. Select your site
3. Click on **Functions** in the left sidebar
4. Click on the `pins` function
5. Check the logs for detailed error messages

### Step 4: Test Functions Locally

Test the functions locally before deploying:

```bash
npm run dev
```

Open `http://localhost:8888` and check the browser console for errors.

### Common Issues

#### Issue: "Cannot find module '@netlify/blobs'"

**Solution:** Reinstall dependencies and redeploy:
```bash
npm install
netlify deploy --prod
```

#### Issue: "getStore is not a function"

**Solution:** Make sure you're using the latest version of `@netlify/blobs`:
```bash
npm install @netlify/blobs@latest
netlify deploy --prod
```

#### Issue: Functions work locally but not in production

**Solution:** 
1. Check that `netlify.toml` is committed to your repository
2. Verify the functions directory is `netlify/functions`
3. Redeploy with `netlify deploy --prod`

#### Issue: CORS errors

**Solution:** The functions already include CORS headers. If you still see CORS errors:
1. Check your Netlify site URL matches what you're accessing
2. Make sure you're not mixing HTTP and HTTPS

### Alternative: Use Environment Variable Storage (Temporary)

If Netlify Blobs continues to have issues, you can use a simpler storage approach temporarily. Check if there's a `pins-simple.js` function as a backup.

### Getting More Help

1. Check Netlify Function logs in your dashboard
2. Run `netlify dev` locally and check terminal output
3. Verify your site is properly deployed with `netlify status`

### Checking Deployment

Run this command to check your deployment status:

```bash
netlify status
```

Make sure:
- ✅ Site is linked to Netlify
- ✅ Functions directory is correct
- ✅ Latest deploy was successful

