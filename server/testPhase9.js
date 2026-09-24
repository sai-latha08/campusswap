const http = require('http');

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    };

    const req = http.request(options, (res) => {
      let resBody = '';
      res.on('data', (chunk) => resBody += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(resBody) });
        } catch (e) {
          resolve({ status: res.statusCode, data: resBody });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function runPhase9Tests() {
  console.log('🚀 --- Starting Phase 9 (Admin & Moderation Engine) Automated Tests --- 🚀\n');

  const ts = Date.now();
  // 1. Register regular student and admin student
  const regStudent = await request('POST', '/api/auth/register', {
    name: `Student Mod ${ts}`,
    email: `student.mod.${ts}@stanford.edu`,
    password: 'Password123!',
    college: 'Stanford University',
    branch: 'Computer Science',
    year: 2
  });
  const studentToken = regStudent.data.data?.token;
  const studentId = regStudent.data.data?.user?._id;

  const regAdmin = await request('POST', '/api/auth/register', {
    name: `Admin Mod ${ts}`,
    email: `admin.mod.${ts}@stanford.edu`,
    password: 'Password123!',
    college: 'Stanford University',
    branch: 'Administration',
    year: 4
  });
  const adminToken = regAdmin.data.data?.token;
  const adminId = regAdmin.data.data?.user?._id;

  // Manually update admin user's role to 'admin' in Mongo directly using Mongoose script
  const mongoose = require('mongoose');
  require('dotenv').config();
  require('./models');
  await mongoose.connect(process.env.MONGODB_URI);
  const User = mongoose.model('User');
  await User.findByIdAndUpdate(adminId, { role: 'admin' });
  await mongoose.disconnect();

  // 2. Student attempts to access admin route (Should return 403 Forbidden)
  const forbiddenCheck = await request('GET', '/api/admin/stats', null, studentToken);
  console.log('1. RBAC Guard Rejects Student from Admin Routes:', forbiddenCheck.status === 403 ? '✅ PASS (403 Forbidden)' : '❌ FAIL', forbiddenCheck.data.message || '');

  // 3. Admin accesses platform analytics
  const adminStats = await request('GET', '/api/admin/stats', null, adminToken);
  console.log('2. Admin Fetches Platform Analytics:', adminStats.status === 200 ? '✅ PASS' : '❌ FAIL');
  console.log(`   Total Users: ${adminStats.data.data?.overview?.totalUsers}, Items: ${adminStats.data.data?.overview?.totalItems}`);

  // 4. Student lists an item
  const createItem = await request('POST', '/api/items', {
    title: `Suspicious Drone ${ts}`,
    description: 'Selling unverified hardware.',
    category: 'Electronics',
    condition: 'Fair',
    pricePerDay: 50,
    securityDeposit: 100,
    location: 'Off Campus',
    images: ['https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=500']
  }, studentToken);
  const itemId = createItem.data.data?.item?._id;

  // 5. Admin submits a report against the student / item
  const submitReport = await request('POST', '/api/reports', {
    reportedUserId: studentId,
    itemId,
    reason: 'Fake Listing',
    description: 'Item appears to violate campus safety policy.'
  }, adminToken);
  console.log('3. Submit Peer Report:', submitReport.status === 201 ? '✅ PASS' : '❌ FAIL');
  const reportId = submitReport.data.data?.report?._id;

  // 6. Admin fetches all reports
  const adminReports = await request('GET', '/api/admin/reports', null, adminToken);
  console.log('4. Admin Lists Moderation Reports:', adminReports.status === 200 ? '✅ PASS' : '❌ FAIL');
  console.log(`   Found ${adminReports.data.data?.total} total reports in system.`);

  // 7. Admin suspends student user
  const suspendUser = await request('PATCH', `/api/admin/users/${studentId}/status`, {
    isSuspended: true,
    suspensionReason: 'Policy violation: Prohibited item listing.'
  }, adminToken);
  console.log('5. Admin Suspends Student Account:', suspendUser.status === 200 ? '✅ PASS' : '❌ FAIL');
  console.log(`   New Student Trust Score: ${suspendUser.data.data?.user?.trustScore} (penalized -20)`);

  // 8. Verify suspended student is now blocked from API
  const blockedStudent = await request('GET', '/api/notifications', null, studentToken);
  console.log('6. Suspended Student is Blocked by Auth Middleware:', blockedStudent.status === 403 ? '✅ PASS (403 Blocked)' : '❌ FAIL', blockedStudent.data.message || '');

  // 9. Admin deactivates item
  const toggleItem = await request('PATCH', `/api/admin/items/${itemId}/toggle`, {}, adminToken);
  console.log('7. Admin Toggles Item Active State:', toggleItem.status === 200 ? '✅ PASS' : '❌ FAIL');
  console.log(`   Item is now active: ${toggleItem.data.data?.item?.isActive}`);

  // 10. Admin resolves report
  const resolveRep = await request('PATCH', `/api/admin/reports/${reportId}/resolve`, {
    status: 'resolved',
    resolutionNote: 'Listing deactivated and user issued a formal suspension warning.',
    actionTaken: 'penalty'
  }, adminToken);
  console.log('8. Admin Resolves Report with Penalty Action:', resolveRep.status === 200 ? '✅ PASS' : '❌ FAIL');

  console.log('\n🎉 --- Phase 9 Admin Dashboard & Moderation Engine Verification Complete! --- 🎉');
}

runPhase9Tests().catch(console.error);
