// "use client";

// import { useAuth } from '@/contexts/AuthContext';

// export default function DebugUser() {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return <div>Loading user...</div>;
//   }

//   return (
//     <div className="fixed top-4 right-4 bg-yellow-100 p-4 rounded-lg shadow-lg z-50 max-w-sm">
//       <h3 className="font-bold text-sm mb-2">Debug User Info</h3>
//       <div className="text-xs space-y-1">
//         <p><strong>User:</strong> {user ? 'Present' : 'Null'}</p>
//         <p><strong>Role:</strong> {user?.role || 'None'}</p>
//         <p><strong>Name:</strong> {user?.name || 'None'}</p>
//         <p><strong>Email:</strong> {user?.email || 'None'}</p>
//         <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
//       </div>
//     </div>
//   );
// }
