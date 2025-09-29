// MongoDB Compass Commands for Setting Up Test Users
// Run these commands in MongoDB Compass or MongoDB Shell

// 1. Switch to your database
use joyapps

// 2. Create Admin User
db.users.insertOne({
  name: "Admin User",
  email: "admin@joyapps.com",
  password: "$2b$10$ObsalZtmtVZgELzQW7MnT.xiOLX/Xka0Q43cLS3tCto5lfRARfL3m", // password: admin123
  role: "admin",
  taskRole: "viewer",
  workerType: "manager",
  status: "permanent",
  locked: "unlocked",
  links: 0,
  assignedUsers: [],
  contactNumber: "+1-555-0001",
  emergencyNumber: "+1-555-0002",
  phoneNumber: "+1-555-0001",
  address: "123 Admin St, Admin City, AC 12345",
  emergencyContact: "Admin Emergency",
  emergencyPhone: "+1-555-0002",
  dateOfBirth: "1980-01-01",
  socialSecurityNumber: "000-00-0001",
  bankAccount: "****0001",
  benefits: "Full Benefits Package",
  notes: "System Administrator",
  department: "IT",
  position: "System Administrator",
  salary: 100000,
  joinDate: "2020-01-01",
  performance: 100,
  attendance: 100,
  lastReview: "2024-01-01",
  vacationDay: "Monday",
  avatar: null,
  createdAt: new Date(),
  updatedAt: new Date()
})

// 3. Create Manager User
db.users.insertOne({
  name: "Muhammad Shahood",
  email: "manager@joyapps.com",
  password: "$2b$10$u8rhmcQEoNF..fB9g3fXA.WXKaQtsSNW/i9wQKaaAjyac4OpIKA0m", // password: manager123
  role: "manager",
  taskRole: "viewer",
  workerType: "manager",
  status: "permanent",
  locked: "unlocked",
  links: 1,
  assignedUsers: [],
  contactNumber: "+1-555-0101",
  emergencyNumber: "+1-555-0102",
  phoneNumber: "+1-555-0101",
  address: "456 Manager Ave, Manager City, MC 23456",
  emergencyContact: "Manager Emergency",
  emergencyPhone: "+1-555-0102",
  dateOfBirth: "1985-05-15",
  socialSecurityNumber: "111-11-1111",
  bankAccount: "****1111",
  benefits: "Health, Dental, Vision",
  notes: "Team Manager",
  department: "Operations",
  position: "Team Manager",
  salary: 75000,
  joinDate: "2021-03-15",
  performance: 95,
  attendance: 98,
  lastReview: "2024-01-15",
  vacationDay: "Saturday",
  avatar: null,
  createdAt: new Date(),
  updatedAt: new Date()
})

// 4. Create QC User
db.users.insertOne({
  name: "John QC",
  email: "qc@joyapps.com",
  password: "$2b$10$JOi3Jl.Oe8wMSV8Ui2SEwuq7obVXdJOEtuDqiSlqn.3WK12irtR3G", // password: qc123
  role: "qc",
  taskRole: "viewer",
  workerType: "qc",
  status: "permanent",
  locked: "unlocked",
  links: 0,
  assignedUsers: [],
  contactNumber: "+1-555-0201",
  emergencyNumber: "+1-555-0202",
  phoneNumber: "+1-555-0201",
  address: "789 QC Blvd, QC City, QC 34567",
  emergencyContact: "QC Emergency",
  emergencyPhone: "+1-555-0202",
  dateOfBirth: "1988-08-20",
  socialSecurityNumber: "222-22-2222",
  bankAccount: "****2222",
  benefits: "Health, Dental",
  notes: "Quality Control Specialist",
  department: "Quality Assurance",
  position: "QC Specialist",
  salary: 60000,
  joinDate: "2022-01-10",
  performance: 90,
  attendance: 95,
  lastReview: "2024-01-10",
  vacationDay: "Tuesday",
  avatar: null,
  createdAt: new Date(),
  updatedAt: new Date()
})

// 5. Create HR User
db.users.insertOne({
  name: "Sarah HR",
  email: "hr@joyapps.com",
  password: "$2b$10$HAbBD/uJo6RkDdPYG4cHDu/rU0sD4irwrB6RXyHsUUk9uhtIenCa.", // password: hr123
  role: "hr",
  taskRole: "viewer",
  workerType: "hr",
  status: "permanent",
  locked: "unlocked",
  links: 0,
  assignedUsers: [],
  contactNumber: "+1-555-0301",
  emergencyNumber: "+1-555-0302",
  phoneNumber: "+1-555-0301",
  address: "321 HR Street, HR City, HR 45678",
  emergencyContact: "HR Emergency",
  emergencyPhone: "+1-555-0302",
  dateOfBirth: "1987-12-10",
  socialSecurityNumber: "333-33-3333",
  bankAccount: "****3333",
  benefits: "Full Benefits Package",
  notes: "Human Resources Manager",
  department: "Human Resources",
  position: "HR Manager",
  salary: 80000,
  joinDate: "2021-06-01",
  performance: 92,
  attendance: 97,
  lastReview: "2024-01-05",
  vacationDay: "Wednesday",
  avatar: null,
  createdAt: new Date(),
  updatedAt: new Date()
})

// 6. Create User - Viewer Only
db.users.insertOne({
  name: "Adnan Amir",
  email: "adnan@joyapps.net",
  password: "$2b$10$lJP6bV2h7HDxoGLljyjA7.Kr8p1PU4Ib700Fy1l/kInpEGZMYLGUq", // password: user123
  role: "user",
  taskRole: "viewer",
  workerType: "permanent",
  status: "permanent",
  locked: "unlocked",
  links: 0,
  assignedUsers: [],
  contactNumber: "+1-555-0401",
  emergencyNumber: "+1-555-0402",
  phoneNumber: "+1-555-0401",
  address: "654 Viewer Lane, Viewer City, VC 56789",
  emergencyContact: "Viewer Emergency",
  emergencyPhone: "+1-555-0402",
  dateOfBirth: "1990-03-25",
  socialSecurityNumber: "444-44-4444",
  bankAccount: "****4444",
  benefits: "Health, Dental",
  notes: "Viewer Worker",
  department: "Operations",
  position: "Permanent Worker",
  salary: 45000,
  joinDate: "2023-03-20",
  performance: 88,
  attendance: 95,
  lastReview: "2024-01-10",
  vacationDay: "Wednesday",
  avatar: null,
  createdAt: new Date(),
  updatedAt: new Date()
})

// 7. Create User - Clicker Only
db.users.insertOne({
  name: "Waleed Bin Shakeel",
  email: "waleed@joyapps.net",
  password: "$2b$10$lJP6bV2h7HDxoGLljyjA7.Kr8p1PU4Ib700Fy1l/kInpEGZMYLGUq", // password: user123
  role: "user",
  taskRole: "clicker",
  workerType: "trainee",
  status: "trainee",
  locked: "unlocked",
  links: 0,
  assignedUsers: [],
  contactNumber: "+1-555-0501",
  emergencyNumber: "+1-555-0502",
  phoneNumber: "+1-555-0501",
  address: "987 Clicker Court, Clicker City, CC 67890",
  emergencyContact: "Clicker Emergency",
  emergencyPhone: "+1-555-0502",
  dateOfBirth: "1992-07-15",
  socialSecurityNumber: "555-55-5555",
  bankAccount: "****5555",
  benefits: "Health",
  notes: "Clicker Worker",
  department: "Operations",
  position: "Trainee Worker",
  salary: 35000,
  joinDate: "2024-01-08",
  performance: 78,
  attendance: 92,
  lastReview: "2024-01-25",
  vacationDay: "Thursday",
  avatar: null,
  createdAt: new Date(),
  updatedAt: new Date()
})

// 8. Create User - Both Viewer and Clicker
db.users.insertOne({
  name: "Hasan Abbas",
  email: "hasan@joyapps.net",
  password: "$2b$10$lJP6bV2h7HDxoGLljyjA7.Kr8p1PU4Ib700Fy1l/kInpEGZMYLGUq", // password: user123
  role: "user",
  taskRole: "both",
  workerType: "permanent",
  status: "permanent",
  locked: "unlocked",
  links: 0,
  assignedUsers: [],
  contactNumber: "+1-555-0601",
  emergencyNumber: "+1-555-0602",
  phoneNumber: "+1-555-0601",
  address: "147 Both Street, Both City, BC 78901",
  emergencyContact: "Both Emergency",
  emergencyPhone: "+1-555-0602",
  dateOfBirth: "1989-11-30",
  socialSecurityNumber: "666-66-6666",
  bankAccount: "****6666",
  benefits: "Health, Dental, Vision",
  notes: "Versatile Worker",
  department: "Operations",
  position: "Permanent Worker",
  salary: 50000,
  joinDate: "2023-01-15",
  performance: 92,
  attendance: 98,
  lastReview: "2024-01-15",
  vacationDay: "Tuesday",
  avatar: null,
  createdAt: new Date(),
  updatedAt: new Date()
})

// 9. Create a Locked User for Testing
db.users.insertOne({
  name: "Locked User",
  email: "locked@joyapps.com",
  password: "$2b$10$Bv4cRm8m0VYndk8NXI59TuLvqwMSJUqgUp51NxfcggwKIdwaIYnmy", // password: locked123
  role: "user",
  taskRole: "viewer",
  workerType: "permanent",
  status: "permanent",
  locked: "locked",
  links: 0,
  assignedUsers: [],
  contactNumber: "+1-555-0701",
  emergencyNumber: "+1-555-0702",
  phoneNumber: "+1-555-0701",
  address: "999 Locked Lane, Locked City, LC 89012",
  emergencyContact: "Locked Emergency",
  emergencyPhone: "+1-555-0702",
  dateOfBirth: "1991-04-12",
  socialSecurityNumber: "777-77-7777",
  bankAccount: "****7777",
  benefits: "Health",
  notes: "Locked Account for Testing",
  department: "Operations",
  position: "Permanent Worker",
  salary: 40000,
  joinDate: "2023-05-01",
  performance: 70,
  attendance: 85,
  lastReview: "2024-01-01",
  vacationDay: "Friday",
  avatar: null,
  createdAt: new Date(),
  updatedAt: new Date()
})

// 10. Verify all users were created
db.users.find({}, {name: 1, email: 1, role: 1, taskRole: 1, locked: 1}).pretty()

// 11. Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ role: 1 })
db.users.createIndex({ locked: 1 })
db.users.createIndex({ createdAt: -1 })
