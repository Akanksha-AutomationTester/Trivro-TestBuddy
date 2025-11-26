import React, { useState, useEffect } from 'react';
import { Users, Download, Search, Trash2 } from 'lucide-react';

interface RegisteredUser {
  email: string;
  name: string;
  joinedAt: string;
}

const AdminUserList: React.FC = () => {
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const storedUsers = localStorage.getItem('trivro_db_users');
    if (storedUsers) {
      try {
        setUsers(JSON.parse(storedUsers));
      } catch (e) {
        console.error("Failed to load users", e);
      }
    }
  }, []);

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadCSV = () => {
    if (users.length === 0) return;

    const headers = ["Name", "Email", "Joined Date"];
    const rows = users.map(u => [
      `"${u.name}"`, 
      `"${u.email}"`, 
      `"${new Date(u.joinedAt).toLocaleString()}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(','), ...rows.join('\n')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `trivro_users_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden flex flex-col h-full">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-700 bg-slate-800/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-rose-500/10 p-2.5 rounded-lg">
              <Users className="w-6 h-6 text-rose-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Registered Users</h2>
              <p className="text-sm text-slate-400">Manage and view all signup details</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search users..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 text-slate-200 text-sm rounded-lg pl-9 pr-4 py-2 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>
            <button 
              onClick={handleDownloadCSV}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-indigo-500/20"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900/50 sticky top-0 z-10">
              <tr>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700">Name</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700">Email Address</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700">Joined Date</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, idx) => (
                  <tr key={idx} className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 text-slate-200 font-medium">{user.name}</td>
                    <td className="p-4 text-slate-400 font-mono text-sm">{user.email}</td>
                    <td className="p-4 text-slate-400 text-sm">{new Date(user.joinedAt).toLocaleDateString()} {new Date(user.joinedAt).toLocaleTimeString()}</td>
                    <td className="p-4 text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                        Active
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-500">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 bg-slate-900/30 text-xs text-slate-500 flex justify-between items-center">
          <span>Showing {filteredUsers.length} of {users.length} users</span>
          <span>Database: LocalStorage</span>
        </div>

      </div>
    </div>
  );
};

export default AdminUserList;