const { SignJWT } = require('jose');
require('dotenv').config();

async function generateTestToken() {
  const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
  
  // Test user payload - matches NextAuth JWT structure
  const payload = {
    sub: 'test-user-google-id-123',  // Google ID
    email: 'testuser@example.com',
    name: 'Test User',
    picture: 'https://example.com/avatar.jpg',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7), // 7 days
  };

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);

  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║           EcoPromise Test JWT Token                     ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');
  
  console.log('📋 Token (copy this for Postman):');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(token);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  console.log('👤 User Details:');
  console.log(JSON.stringify(payload, null, 2));
  console.log('\n📝 Usage in Postman:');
  console.log('   Authorization: Bearer <paste-token-above>');
  console.log('\n✅ Token valid for: 7 days');
  console.log('🔑 First API call will create this user in MongoDB\n');
}

// Generate multiple test tokens if needed
async function generateMultipleTokens() {
  console.log('\n🎯 Generating Test Tokens for Different Users...\n');

  const users = [
    {
      sub: 'test-user-1-google-id',
      email: 'user1@example.com',
      name: 'Alice Green',
      picture: 'https://example.com/alice.jpg',
    },
    {
      sub: 'test-user-2-google-id',
      email: 'user2@example.com',
      name: 'Bob Eco',
      picture: 'https://example.com/bob.jpg',
    },
    {
      sub: 'admin-user-google-id',
      email: 'admin@example.com',
      name: 'Admin User',
      picture: 'https://example.com/admin.jpg',
    }
  ];

  const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);

  for (const user of users) {
    const payload = {
      ...user,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7),
    };

    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret);

    console.log(`\n👤 ${user.name} (${user.email})`);
    console.log('━'.repeat(60));
    console.log(token);
    console.log('');
  }

  console.log('\n💡 Note: After first login, update admin user role in MongoDB:');
  console.log('   db.users.updateOne(');
  console.log('     { email: "admin@example.com" },');
  console.log('     { $set: { role: "admin" } }');
  console.log('   )\n');
}

// Check command line arguments
const args = process.argv.slice(2);
if (args.includes('--multiple') || args.includes('-m')) {
  generateMultipleTokens().catch(console.error);
} else {
  generateTestToken().catch(console.error);
}
