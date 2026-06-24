import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, setDoc, addDoc, updateDoc, getDoc } from 'firebase/firestore';
import { LayoutDashboard, Users, ClipboardList, ArrowUpRight, Plus, ToggleLeft, ToggleRight, XCircle, CheckCircle2, ChevronLeft } from 'lucide-react';
import { db } from '../firebase';
import { Task, UserProfile, UserTask, WithdrawRequest } from '../types';

interface AdminPanelProps {
  onBack: () => void;
}

export default function AdminPanel({ onBack }: AdminPanelProps) {
  const [adminTab, setAdminTab] = useState<'dashboard' | 'users' | 'tasks' | 'withdraws'>('dashboard');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allUserTasks, setAllUserTasks] = useState<UserTask[]>([]);
  const [allWithdraws, setAllWithdraws] = useState<WithdrawRequest[]>([]);

  // Task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskReward, setNewTaskReward] = useState('1.50');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const [taskError, setTaskError] = useState('');
  const [taskSuccess, setTaskSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Real-time listener for users
  useEffect(() => {
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: UserProfile[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as UserProfile);
      });
      setUsers(list);
    });
    return () => unsubscribe();
  }, []);

  // Real-time listener for tasks
  useEffect(() => {
    const q = query(collection(db, 'tasks'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: Task[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as Task);
      });
      list.sort((a, b) => b.createdAt - a.createdAt);
      setTasks(list);
    });
    return () => unsubscribe();
  }, []);

  // Real-time listener for all userTasks
  useEffect(() => {
    const q = query(collection(db, 'userTasks'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: UserTask[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as UserTask);
      });
      setAllUserTasks(list);
    });
    return () => unsubscribe();
  }, []);

  // Real-time listener for all withdraws
  useEffect(() => {
    const q = query(collection(db, 'withdraws'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: WithdrawRequest[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as WithdrawRequest);
      });
      list.sort((a, b) => b.createdAt - a.createdAt);
      setAllWithdraws(list);
    });
    return () => unsubscribe();
  }, []);

  // Create or Update task
  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTaskError('');
    setTaskSuccess('');
    setLoading(true);

    const rewardNum = parseFloat(newTaskReward);
    if (!newTaskTitle.trim() || isNaN(rewardNum) || rewardNum <= 0) {
      setTaskError('Please enter a valid title and positive reward amount.');
      setLoading(false);
      return;
    }

    try {
      if (editingTask) {
        // Edit mode
        await updateDoc(doc(db, 'tasks', editingTask.id), {
          title: newTaskTitle.trim(),
          rewardAmount: rewardNum
        });
        setTaskSuccess('Task updated successfully!');
        setEditingTask(null);
      } else {
        // Create mode
        const id = doc(collection(db, 'tasks')).id;
        await setDoc(doc(db, 'tasks', id), {
          id,
          title: newTaskTitle.trim(),
          rewardAmount: rewardNum,
          disabled: false,
          createdAt: Date.now()
        });
        setTaskSuccess('Task created successfully!');
      }

      setNewTaskTitle('');
      setNewTaskReward('1.50');
    } catch (err: any) {
      console.error(err);
      setTaskError(err.message || 'Error writing task.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle Task Active state (Enable / Disable)
  const toggleTaskDisabled = async (task: Task) => {
    try {
      await updateDoc(doc(db, 'tasks', task.id), {
        disabled: !task.disabled
      });
    } catch (err) {
      console.error('Error toggling task:', err);
    }
  };

  // Withdraw action: Approve or Reject
  const handleWithdrawAction = async (withdraw: WithdrawRequest, action: 'Approved' | 'Rejected') => {
    try {
      // 1. Update withdraw request status
      await updateDoc(doc(db, 'withdraws', withdraw.id), {
        status: action
      });

      // 2. If rejected, refund the wallet balance
      if (action === 'Rejected') {
        const userRef = doc(db, 'users', withdraw.userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const uProfile = userSnap.data() as UserProfile;
          await updateDoc(userRef, {
            walletBalance: uProfile.walletBalance + withdraw.amount
          });
        }
      }
    } catch (err) {
      console.error('Error performing withdraw action:', err);
    }
  };

  return (
    <div className="max-w-[1120px] mx-auto px-4 py-6 font-sans">
      
      {/* Back to normal Dashboard button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-gray-500 hover:text-black font-semibold text-sm mb-6 transition-colors cursor-pointer"
      >
        <ChevronLeft size={16} /> Back to Contributor Dashboard
      </button>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Admin Navigation Sidebar */}
        <aside className="md:col-span-3 flex flex-col gap-4 bg-white p-5 rounded-lg border border-gray-100 shrink-0">
          <div>
            <h1 className="font-bold text-xl text-black">Backoffice Admin</h1>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">newstaskk Administration</p>
          </div>

          <nav className="flex flex-col gap-1">
            <button
              onClick={() => setAdminTab('dashboard')}
              className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-bold transition-all text-left cursor-pointer ${
                adminTab === 'dashboard'
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-black'
              }`}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setAdminTab('users')}
              className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-bold transition-all text-left cursor-pointer ${
                adminTab === 'users'
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-black'
              }`}
            >
              <Users size={18} />
              <span>Users ({users.length})</span>
            </button>

            <button
              onClick={() => setAdminTab('tasks')}
              className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-bold transition-all text-left cursor-pointer ${
                adminTab === 'tasks'
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-black'
              }`}
            >
              <ClipboardList size={18} />
              <span>Tasks ({tasks.length})</span>
            </button>

            <button
              onClick={() => setAdminTab('withdraws')}
              className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-bold transition-all text-left cursor-pointer ${
                adminTab === 'withdraws'
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-black'
              }`}
            >
              <ArrowUpRight size={18} />
              <span>Withdraws ({allWithdraws.filter(w => w.status === 'Pending').length})</span>
            </button>
          </nav>
        </aside>

        {/* Admin Main Panel Area */}
        <div className="md:col-span-9 flex flex-col gap-6">
          
          {/* Section: Dashboard Summary */}
          {adminTab === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="font-bold text-black text-lg border-b border-gray-100 pb-2 uppercase tracking-wide">Admin Dashboard</h3>
              
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-6 bg-white border border-gray-100 rounded-lg text-center">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Users</p>
                  <p className="text-3xl font-bold text-black">{users.length}</p>
                </div>

                <div className="p-6 bg-white border border-gray-100 rounded-lg text-center">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Tasks Completed</p>
                  <p className="text-3xl font-bold text-black">{allUserTasks.length}</p>
                </div>

                <div className="p-6 bg-white border border-gray-100 rounded-lg text-center">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Pending Withdraws</p>
                  <p className="text-3xl font-bold text-black">
                    {allWithdraws.filter(w => w.status === 'Pending').length}
                  </p>
                </div>
              </div>

              {/* Total payouts analysis */}
              <div className="p-6 bg-gray-50/50 border border-gray-100 rounded-lg">
                <h4 className="font-bold text-black text-sm uppercase tracking-wider mb-2">Editorial Financial Balance Overview</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-sm">
                  <div>
                    <span className="text-gray-400 text-xs font-bold uppercase block">Approved Payout Volume</span>
                    <strong className="text-base text-green-600">
                      ₹{allWithdraws.filter(w => w.status === 'Approved').reduce((acc, curr) => acc + (curr.amount ?? 0), 0).toFixed(2)}
                    </strong>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs font-bold uppercase block">Owed Contributor Balance</span>
                    <strong className="text-base text-gray-800">
                      ₹{users.reduce((acc, curr) => acc + (curr.walletBalance ?? 0), 0).toFixed(2)}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section: Users */}
          {adminTab === 'users' && (
            <div className="bg-white border border-gray-100 rounded-lg p-6 animate-fade-in space-y-4">
              <h3 className="font-bold text-black text-lg border-b border-gray-100 pb-2 uppercase tracking-wide">Registered Contributors</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <th className="py-3 px-2">Email</th>
                      <th className="py-3 px-2">Role</th>
                      <th className="py-3 px-2">Wallet Balance</th>
                      <th className="py-3 px-2">Total Earned</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((u) => (
                      <tr key={u.uid} className="hover:bg-gray-50 text-xs md:text-sm">
                        <td className="py-3 px-2 font-semibold text-black">{u.email || 'No Email'}</td>
                        <td className="py-3 px-2 font-mono uppercase text-xs">{u.role || 'user'}</td>
                        <td className="py-3 px-2 font-mono font-bold text-black">₹{(u.walletBalance ?? 0).toFixed(2)}</td>
                        <td className="py-3 px-2 font-mono font-bold text-gray-500">₹{(u.totalEarned ?? 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section: Tasks management */}
          {adminTab === 'tasks' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
              
              {/* Task Creation Form */}
              <div className="lg:col-span-5 bg-white border border-gray-100 p-6 rounded-lg h-fit">
                <h3 className="font-bold text-black text-base uppercase tracking-wider border-b border-gray-100 pb-2 mb-4">
                  {editingTask ? 'Edit Task Info' : 'Create New Task'}
                </h3>

                {taskError && (
                  <div className="mb-4 bg-red-50 text-red-700 text-xs p-3 rounded font-medium border border-red-100 text-center">
                    {taskError}
                  </div>
                )}

                {taskSuccess && (
                  <div className="mb-4 bg-green-50 text-green-700 text-xs p-3 rounded font-medium border border-green-200 text-center">
                    {taskSuccess}
                  </div>
                )}

                <form onSubmit={handleTaskSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block">Task Title</label>
                    <input
                      type="text"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="e.g., Proofread Tech analysis"
                      className="w-full h-11 px-4 bg-gray-50 border border-gray-100 rounded-md text-sm text-black focus:outline-none focus:border-black"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block">Reward (₹)</label>
                    <input
                      type="number"
                      value={newTaskReward}
                      onChange={(e) => setNewTaskReward(e.target.value)}
                      step="any"
                      min="0.10"
                      className="w-full h-11 px-4 bg-gray-50 border border-gray-100 rounded-md text-sm text-black focus:outline-none focus:border-black"
                      required
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-grow h-11 bg-black text-white rounded-md font-bold text-xs uppercase tracking-wider hover:bg-gray-800 cursor-pointer transition-colors"
                    >
                      {editingTask ? 'Update Task' : 'Add Task'}
                    </button>
                    {editingTask && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTask(null);
                          setNewTaskTitle('');
                          setNewTaskReward('1.50');
                        }}
                        className="px-4 h-11 border border-gray-100 rounded-md font-bold text-xs uppercase hover:bg-gray-50 cursor-pointer text-black"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Tasks Registry List */}
              <div className="lg:col-span-7 bg-white border border-gray-100 rounded-lg p-6">
                <h3 className="font-bold text-black text-base uppercase tracking-wider border-b border-gray-100 pb-2 mb-4">Registry Tasks</h3>
                <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                  {tasks.map((task) => (
                    <div key={task.id} className="py-4 flex justify-between items-center text-sm">
                      <div>
                        <p className={`font-bold ${task.disabled ? 'line-through text-gray-400' : 'text-black'}`}>
                          {task.title}
                        </p>
                        <p className="text-xs font-semibold text-gray-400 mt-0.5">₹{task.rewardAmount.toFixed(2)} reward</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingTask(task);
                            setNewTaskTitle(task.title);
                            setNewTaskReward(task.rewardAmount.toString());
                          }}
                          className="px-2.5 py-1 text-xs border border-gray-100 rounded-md hover:bg-gray-50 font-bold uppercase tracking-wider cursor-pointer text-black"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => toggleTaskDisabled(task)}
                          className={`p-1 hover:opacity-85 transition-opacity cursor-pointer ${task.disabled ? 'text-gray-400' : 'text-black'}`}
                        >
                          {task.disabled ? <ToggleLeft size={28} /> : <ToggleRight size={28} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Section: Withdraws approvals */}
          {adminTab === 'withdraws' && (
            <div className="bg-white border border-gray-100 rounded-lg p-6 animate-fade-in space-y-4">
              <h3 className="font-bold text-black text-lg border-b border-gray-100 pb-2 uppercase tracking-wide">Contributor Withdrawals Requests</h3>
              
              {allWithdraws.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">No requests found inside history.</p>
              ) : (
                <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                  {allWithdraws.map((w) => (
                    <div key={w.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm">
                      <div>
                        <p className="font-bold text-black">{w.userEmail}</p>
                        <p className="text-xs font-semibold text-gray-500 mt-1">
                          Amount: <strong className="font-mono text-black">₹{w.amount.toFixed(2)}</strong> • UPI: <span className="font-mono bg-gray-50 px-1.5 py-0.5 border border-gray-100 rounded text-xs">{w.upiId}</span>
                        </p>
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">Created on {new Date(w.createdAt).toLocaleString()}</p>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {w.status === 'Pending' ? (
                          <>
                            <button
                              onClick={() => handleWithdrawAction(w, 'Approved')}
                              className="px-3.5 py-1.5 bg-black text-white font-bold text-xs rounded-md uppercase tracking-wider hover:bg-gray-800 transition-colors cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleWithdrawAction(w, 'Rejected')}
                              className="px-3.5 py-1.5 border border-gray-200 text-black font-bold text-xs rounded-md uppercase tracking-wider hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                            w.status === 'Approved' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                          }`}>
                            {w.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
