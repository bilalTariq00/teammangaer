// Test HR attendance API access
async function testHRAttendanceAPI() {
  try {
    console.log('🔍 Testing HR attendance API access...\n');

    // Login as HR
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'hr@joyapps.com',
        password: 'hr123'
      })
    });

    const loginResult = await loginResponse.json();
    if (!loginResult.success) {
      console.log('❌ HR login failed:', loginResult.error);
      return;
    }

    console.log('✅ HR login successful');
    console.log('   User ID:', loginResult.user._id);
    console.log('   Name:', loginResult.user.name);
    console.log('   Role:', loginResult.user.role);

    // Test HR employees API
    console.log('\n📋 Testing HR employees API...');
    const employeesResponse = await fetch('http://localhost:3000/api/hr/employees', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginResult.token}`
      }
    });

    const employeesResult = await employeesResponse.json();
    if (employeesResult.success) {
      console.log('✅ HR employees API working');
      console.log('   Employees count:', employeesResult.data.length);
      console.log('   Sample employees:', employeesResult.data.slice(0, 3).map(u => ({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role
      })));
    } else {
      console.log('❌ HR employees API failed:', employeesResult.error);
    }

    // Test attendance API
    console.log('\n📅 Testing attendance API...');
    const attendanceResponse = await fetch('http://localhost:3000/api/attendance?date=2025-09-30', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginResult.token}`
      }
    });

    const attendanceResult = await attendanceResponse.json();
    if (attendanceResult.success) {
      console.log('✅ Attendance API working');
      console.log('   Records count:', attendanceResult.count);
      console.log('   Sample records:', attendanceResult.data.map(r => ({
        _id: r._id,
        userId: r.userId._id,
        userName: r.userId.name,
        status: r.status,
        checkIn: r.checkIn
      })));
    } else {
      console.log('❌ Attendance API failed:', attendanceResult.error);
    }

    console.log('\n✅ Test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testHRAttendanceAPI();

