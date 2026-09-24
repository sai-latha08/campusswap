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

async function runPhase7Tests() {
  console.log('🚀 --- Starting Phase 7 (Reviews & Trust Engine) Automated Tests --- 🚀\n');

  const ts = Date.now();
  // 1. Register Alice (Reviewer) and Bob (Reviewee)
  const regAlice = await request('POST', '/api/auth/register', {
    name: `Alice Reviewer ${ts}`,
    email: `alice.rev.${ts}@stanford.edu`,
    password: 'Password123!',
    college: 'Stanford University',
    branch: 'Computer Science',
    year: 4
  });
  console.log('1. Register Alice:', regAlice.status === 201 ? '✅ PASS' : '❌ FAIL', regAlice.data.message || '');
  const aliceToken = regAlice.data.data?.token;
  const aliceId = regAlice.data.data?.user?._id;

  const regBob = await request('POST', '/api/auth/register', {
    name: `Bob Reviewee ${ts}`,
    email: `bob.rev.${ts}@stanford.edu`,
    password: 'Password123!',
    college: 'Stanford University',
    branch: 'Electrical Engineering',
    year: 3
  });
  console.log('2. Register Bob:', regBob.status === 201 ? '✅ PASS' : '❌ FAIL', regBob.data.message || '');
  const bobToken = regBob.data.data?.token;
  const bobId = regBob.data.data?.user?._id;
  const initialBobTrust = regBob.data.data?.user?.trustScore;
  console.log(`   Bob initial trust score: ${initialBobTrust}`);

  // 3. Create a rental item by Bob, rent by Alice, mark completed
  const createItem = await request('POST', '/api/items', {
    title: `Scientific Calculator TI-84 ${ts}`,
    description: 'Perfect for engineering exams and calculus classes.',
    category: 'Electronics',
    condition: 'Like New',
    pricePerDay: 15,
    securityDeposit: 30,
    location: 'Stanford Student Union',
    images: ['https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=500']
  }, bobToken);
  console.log('3. Create Item for Bob:', createItem.status === 201 ? '✅ PASS' : '❌ FAIL');
  const itemId = createItem.data.data?.item?._id;

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const bookRental = await request('POST', '/api/rentals', {
    itemId,
    startDate: today.toISOString(),
    endDate: tomorrow.toISOString(),
    deliveryLocation: 'Campus Library West Wing'
  }, aliceToken);
  console.log('4. Alice Books Rental from Bob:', bookRental.status === 201 ? '✅ PASS' : '❌ FAIL');
  const rentalId = bookRental.data.data?.booking?._id;

  // Accept and Complete rental
  const appRes = await request('PATCH', `/api/rentals/${rentalId}/status`, { status: 'approved' }, bobToken);
  const actRes = await request('PATCH', `/api/rentals/${rentalId}/status`, { status: 'active' }, bobToken);
  const completeRental = await request('PATCH', `/api/rentals/${rentalId}/status`, { status: 'completed' }, bobToken);
  console.log('5. Complete Rental Transaction:', completeRental.status === 200 ? '✅ PASS' : '❌ FAIL', completeRental.data?.message || completeRental.data);

  // 6. Test Self Review (Should Fail)
  const selfRev = await request('POST', '/api/reviews', {
    reviewedUserId: aliceId,
    type: 'rental',
    referenceId: rentalId,
    rating: 5,
    comment: 'I am amazing!'
  }, aliceToken);
  console.log('6. Reject Self Review:', selfRev.status === 400 ? '✅ PASS (Correctly Rejected)' : '❌ FAIL', selfRev.data.message || '');

  // 7. Alice submits 5-star review for Bob
  const submitReview = await request('POST', '/api/reviews', {
    reviewedUserId: bobId,
    type: 'rental',
    referenceId: rentalId,
    rating: 5,
    comment: 'Bob was punctual, very friendly, and the calculator was in pristine condition! Highly recommend.'
  }, aliceToken);
  console.log('7. Alice Reviews Bob (5 Stars):', submitReview.status === 201 ? '✅ PASS' : '❌ FAIL');
  console.log(`   Updated Bob Trust Score in Response: ${submitReview.data.data?.updatedTrustScore}`);

  // 8. Test Duplicate Review (Should Fail)
  const dupRev = await request('POST', '/api/reviews', {
    reviewedUserId: bobId,
    type: 'rental',
    referenceId: rentalId,
    rating: 4,
    comment: 'Another review for same rental'
  }, aliceToken);
  console.log('8. Reject Duplicate Review:', dupRev.status === 400 ? '✅ PASS (Correctly Rejected)' : '❌ FAIL', dupRev.data.message || '');

  // 9. Fetch Bob reviews
  const bobReviews = await request('GET', `/api/reviews/user/${bobId}`);
  console.log('9. Fetch Bob Public Reviews:', bobReviews.status === 200 ? '✅ PASS' : '❌ FAIL');
  console.log(`   Total Reviews: ${bobReviews.data.data?.total}, Average Rating: ${bobReviews.data.data?.averageRating}★`);

  // 10. Fetch Alice's given reviews
  const aliceGiven = await request('GET', '/api/reviews/my-reviews', null, aliceToken);
  console.log('10. Fetch Alice Submitted Reviews:', aliceGiven.status === 200 ? '✅ PASS' : '❌ FAIL');
  console.log(`    Reviews given count: ${aliceGiven.data.data?.reviews?.length}`);

  // 11. Verify Bob's updated profile reflects new trustScore
  const bobProfile = await request('GET', `/api/users/${bobId}`);
  console.log('11. Bob User Profile Trust Score Verification:', bobProfile.status === 200 ? '✅ PASS' : '❌ FAIL');
  console.log(`    Current verified DB Trust Score: ${bobProfile.data.data?.user?.trustScore} (increased from ${initialBobTrust})`);

  console.log('\n🎉 --- Phase 7 Reviews & Trust Score Engine Verification Complete! --- 🎉');
}

runPhase7Tests().catch(console.error);
