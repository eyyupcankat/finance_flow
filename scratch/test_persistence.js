async function testPersistence() {
  const baseURL = 'http://localhost:8080/api';
  const randomSuffix = Math.floor(Math.random() * 10000);
  const email = `test_${randomSuffix}@example.com`;
  const password = 'password123';

  try {
    // 1. Register
    console.log(`Registering ${email}...`);
    const regRes = await fetch(`${baseURL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: email,
        password: password
      })
    });
    if (!regRes.ok) throw new Error(`Registration failed: ${await regRes.text()}`);
    console.log('Registered successfully.');

    // 2. Login
    console.log('Logging in...');
    const loginRes = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!loginRes.ok) throw new Error(`Login failed: ${await loginRes.text()}`);
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('Logged in. Token received.');
    
    const headers = { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    // 3. Get current settings
    console.log('Fetching initial settings...');
    const currentRes = await fetch(`${baseURL}/user/settings`, { headers });
    const currentData = await currentRes.json();
    console.log('Initial settings:', currentData);
    
    // 4. Update settings
    console.log('Updating settings...');
    const updateData = {
      ...currentData,
      darkMode: true,
      currency: 'TRY (₺)'
    };
    delete updateData.id; 
    
    const updateRes = await fetch(`${baseURL}/user/settings`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updateData)
    });
    if (!updateRes.ok) throw new Error(`Update failed: ${await updateRes.text()}`);
    console.log('Update successful.');
    
    // 5. Fetch again to check persistence
    console.log('Fetching settings again to verify...');
    const verifyRes = await fetch(`${baseURL}/user/settings`, { headers });
    const verifyData = await verifyRes.json();
    console.log('Verified settings:', verifyData);
    
    if (verifyData.darkMode === true && verifyData.currency === 'TRY (₺)') {
      console.log('SUCCESS: Persistence is working on the backend!');
    } else {
      console.log('FAILURE: Persistence failed on the backend!');
    }
    
  } catch (error) {
    console.error('Error during test:', error.message);
  }
}

testPersistence();
