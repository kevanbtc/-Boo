@echo off
echo 🎃 Deploying BOO Friends & Family Site...

echo.
echo ✅ Files ready:
echo   - friends-family.html (F&F sales site)
echo   - ff-dashboard.html (admin dashboard)
echo   - scripts/ff-processor.js (payment processor)
echo   - netlify.toml (routing config)

echo.
echo 🚀 Committing to Git...
git add .
git commit -m "🎃 Friends & Family launch site ready

✅ Interactive F&F sales interface
✅ Automated USDC payment processing
✅ Admin dashboard for tracking
✅ Referral system with commissions
✅ Mobile responsive design

Ready for immediate launch! 🚀"

echo.
echo 📤 Pushing to GitHub (triggers Netlify deployment)...
git push origin main

echo.
echo ✅ DEPLOYMENT COMPLETE!
echo.
echo 🌐 Your Friends & Family sites will be live at:
echo   Main F&F Site: https://boo-halloween.netlify.app/friends-family.html
echo   Short links:   https://boo-halloween.netlify.app/ff
echo                  https://boo-halloween.netlify.app/early
echo   Admin Dashboard: https://boo-halloween.netlify.app/admin
echo.
echo 💰 Start payment processor with:
echo   node scripts/ff-processor.js monitor
echo.
echo 🎯 Share this link with friends:
echo   https://boo-halloween.netlify.app/ff
echo.
echo Ready to sell BOO tokens! 🔥

pause