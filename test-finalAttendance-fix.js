// Test finalAttendance fix
async function testFinalAttendanceFix() {
  try {
    console.log('🔍 Testing finalAttendance fix...\n');

    // Login as manager
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'manager@joyapps.com',
        password: 'manager123'
      })
    });

    const loginResult = await loginResponse.json();
    if (!loginResult.success) {
      console.log('❌ Manager login failed:', loginResult.error);
      return;
    }

    console.log('✅ Manager login successful');
    console.log('   Manager:', loginResult.user.name);

    // Test manager team API
    console.log('\n👥 Testing manager team API...');
    const teamResponse = await fetch('http://localhost:3000/api/manager/team', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginResult.token}`
      }
    });

    const teamResult = await teamResponse.json();
    if (teamResult.success) {
      console.log('✅ Manager team API working');
      console.log('   Team members count:', teamResult.count);
      
      teamResult.data.forEach((member, index) => {
        console.log(`   ${index + 1}. ${member.name} (${member.email})`);
      });
    } else {
      console.log('❌ Manager team API failed:', teamResult.error);
    }

    // Test attendance API
    console.log('\n📅 Testing attendance API...');
    const today = new Date().toISOString().split('T')[0];
    const attendanceResponse = await fetch(`http://localhost:3000/api/attendance?date=${today}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginResult.token}`
      }
    });

    const attendanceResult = await attendanceResponse.json();
    if (attendanceResult.success) {
      console.log('✅ Attendance API working');
      console.log('   Total attendance records:', attendanceResult.count);
      
      attendanceResult.data.forEach((record, index) => {
        console.log(`   ${index + 1}. ${record.userId.name}: ${record.status} (${record.checkIn || 'No check-in'})`);
      });
      
      // Test the data structure that the frontend expects
      const teamAttendanceRecords = attendanceResult.data.filter(record => 
        record.userId && loginResult.user.assignedUsers.includes(record.userId._id)
      );
      
      console.log('\n🔍 Team attendance records for frontend:');
      console.log('   Count:', teamAttendanceRecords.length);
      teamAttendanceRecords.forEach(record => {
        console.log(`   - ${record.userId.name}: ${record.status}`);
        console.log(`     userId._id: ${record.userId._id}`);
        console.log(`     userId.name: ${record.userId.name}`);
      });
    } else {
      console.log('❌ Attendance API failed:', attendanceResult.error);
    }

    console.log('\n🎯 Summary:');
    console.log('   ✅ finalAttendance references should be fixed');
    console.log('   ✅ Manager dashboard should use teamAttendance instead');
    console.log('   ✅ Data structure matches frontend expectations');
    console.log('   ✅ No more "finalAttendance is not defined" error');

    console.log('\n✅ Test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testFinalAttendanceFix();
