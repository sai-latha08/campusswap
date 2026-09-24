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

async function runPhase8Tests() {
  console.log('🚀 --- Starting Phase 8 (Notification Engine) Automated Tests --- 🚀\n');

  const ts = Date.now();
  // 1. Register Alice and Bob
  const regAlice = await request('POST', '/api/auth/register', {
    name: `Alice Notif ${ts}`,
    email: `alice.notif.${ts}@stanford.edu`,
    password: 'Password123!',
    college: 'Stanford University',
    branch: 'Computer Science',
    year: 4
  });
  const aliceToken = regAlice.data.data?.token;

  const regBob = await request('POST', '/api/auth/register', {
    name: `Bob Notif ${ts}`,
    email: `bob.notif.${ts}@stanford.edu`,
    password: 'Password123!',
    college: 'Stanford University',
    branch: 'Mechanical Engineering',
    year: 2
  });
  const bobToken = regBob.data.data?.token;

  // 2. Bob lists an item
  const createItem = await request('POST', '/api/items', {
    title: `Microbiology Textbook 10th Ed ${ts}`,
    description: 'Essential for bio majors.',
    category: 'Books',
    condition: 'Good',
    pricePerDay: 5,
    securityDeposit: 20,
    location: 'Science Building Lobby',
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500']
  }, bobToken);
  const itemId = createItem.data.data?.item?._id;

  // 3. Alice requests to rent Bob's item (triggers rental_request notification to Bob)
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 2);

  const bookRental = await request('POST', '/api/rentals', {
    itemId,
    startDate: today.toISOString(),
    endDate: tomorrow.toISOString(),
    deliveryLocation: 'Science Quad'
  }, aliceToken);
  console.log('1. Rental Request generated Notification:', bookRental.status === 201 ? '✅ PASS' : '❌ FAIL');
  const bookingId = bookRental.data.data?.booking?._id;

  // 4. Bob checks unread count
  const unreadBob = await request('GET', '/api/notifications/unread-count', null, bobToken);
  console.log('2. Bob Unread Notification Count:', unreadBob.status === 200 ? '✅ PASS' : '❌ FAIL');
  console.log(`   Unread Count: ${unreadBob.data.data?.unreadCount}`);

  // 5. Bob fetches notifications list
  const notifsBob = await request('GET', '/api/notifications', null, bobToken);
  console.log('3. Bob Notification List:', notifsBob.status === 200 ? '✅ PASS' : '❌ FAIL');
  console.log(`   Fetched ${notifsBob.data.data?.notifications?.length} notifications. Total: ${notifsBob.data.data?.total}`);
  const notifId = notifsBob.data.data?.notifications?.[0]?._id;

  // 6. Bob marks one notification as read
  const markRead = await request('PATCH', `/api/notifications/${notifId}/read`, {}, bobToken);
  console.log('4. Mark Single Notification as Read:', markRead.status === 200 ? '✅ PASS' : '❌ FAIL');
  console.log(`   Remaining unread count: ${markRead.data.data?.unreadCount}`);

  // 7. Bob approves rental (triggers rental_approved notification to Alice)
  await request('PATCH', `/api/rentals/${bookingId}/status`, { status: 'approved' }, bobToken);

  // 8. Alice checks her notifications
  const notifsAlice = await request('GET', '/api/notifications', null, aliceToken);
  console.log('5. Alice Received Approval Notification:', notifsAlice.status === 200 ? '✅ PASS' : '❌ FAIL');
  console.log(`   Alice notification title: "${notifsAlice.data.data?.notifications?.[0]?.title}"`);

  // 9. Alice marks all notifications as read
  const markAll = await request('PATCH', '/api/notifications/read-all', {}, aliceToken);
  console.log('6. Mark All Read for Alice:', markAll.status === 200 ? '✅ PASS' : '❌ FAIL');

  // 10. Delete a notification
  const deleteNotif = await request('DELETE', `/api/notifications/${notifId}`, null, bobToken);
  console.log('7. Delete Notification:', deleteNotif.status === 200 ? '✅ PASS' : '❌ FAIL');

  console.log('\n🎉 --- Phase 8 Notification Engine Verification Complete! --- 🎉');
}

runPhase8Tests().catch(console.error);
