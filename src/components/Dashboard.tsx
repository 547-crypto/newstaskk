import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, getDocs, doc, setDoc } from 'firebase/firestore';
import { Wallet, ClipboardList, Clock, User as UserIcon, LogOut, ArrowUpRight, CheckCircle2, AlertCircle, HelpCircle, Copy, Share2 } from 'lucide-react';
import { db } from '../firebase';
import { Task, UserProfile, UserTask, WithdrawRequest } from '../types';

interface DashboardProps {
  currentUser: UserProfile;
  onLogout: () => void;
  onStartTask: (task: Task) => void;
  onOpenAdmin: () => void;
}

export default function Dashboard({
  currentUser,
  onLogout,
  onStartTask,
  onOpenAdmin
}: DashboardProps) {
  const [activeSection, setActiveSection] = useState<'dashboard' | 'history' | 'withdraw' | 'profile'>('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userTasks, setUserTasks] = useState<UserTask[]>([]);
  const [withdraws, setWithdraws] = useState<WithdrawRequest[]>([]);
  
  // Withdraw form state
  const [withdrawAmount, setWithdrawAmount] = useState('300');
  const [upiId, setUpiId] = useState('');
  const [withdrawError, setWithdrawError] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState('');
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  // Seed tasks if empty
  const seedTasksIfEmpty = async () => {
    try {
      const q = query(collection(db, 'tasks'));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        const initialTasks = [
          { title: 'Fact-Check: Tech Editorial Review', rewardAmount: 1.50, disabled: false, createdAt: Date.now() },
          { title: 'Headline Optimization: Gaming News', rewardAmount: 1.50, disabled: false, createdAt: Date.now() },
          { title: 'Image Captioning: World Events', rewardAmount: 1.50, disabled: false, createdAt: Date.now() },
          { title: 'Proofread: OLED Display Analysis', rewardAmount: 2.25, disabled: false, createdAt: Date.now() },
          { title: 'Verify Source claims: Quantum Qubits', rewardAmount: 3.00, disabled: false, createdAt: Date.now() }
        ];
        for (const t of initialTasks) {
          const docRef = doc(collection(db, 'tasks'));
          await setDoc(docRef, { id: docRef.id, ...t });
        }
      }
    } catch (err) {
      console.error('Error seeding tasks:', err);
    }
  };

  useEffect(() => {
    seedTasksIfEmpty();
  }, []);

  // Real-time listener for tasks
  useEffect(() => {
    const q = query(collection(db, 'tasks'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: Task[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as Task);
      });
      setTasks(list.filter(t => !t.disabled));
    });
    return () => unsubscribe();
  }, []);

  // Real-time listener for completed tasks (history)
  useEffect(() => {
    const q = query(collection(db, 'userTasks'), where('userId', '==', currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: UserTask[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as UserTask);
      });
      // Sort newest completed first
      list.sort((a, b) => b.completedAt - a.completedAt);
      setUserTasks(list);
    });
    return () => unsubscribe();
  }, [currentUser.uid]);

  // Real-time listener for withdrawals
  useEffect(() => {
    const q = query(collection(db, 'withdraws'), where('userId', '==', currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: WithdrawRequest[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as WithdrawRequest);
      });
      list.sort((a, b) => b.createdAt - a.createdAt);
      setWithdraws(list);
    });
    return () => unsubscribe();
  }, [currentUser.uid]);

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError('');
    setWithdrawSuccess('');
    setWithdrawLoading(true);

    const amountNum = parseFloat(withdrawAmount);

    if (isNaN(amountNum) || amountNum < 300) {
      setWithdrawError('Minimum withdrawal amount is ₹300.');
      setWithdrawLoading(false);
      return;
    }

    if (amountNum > currentUser.walletBalance) {
      setWithdrawError('Insufficient wallet balance.');
      setWithdrawLoading(false);
      return;
    }

    if (!upiId.trim() || !upiId.includes('@')) {
      setUpiId('');
      setWithdrawError('Please enter a valid UPI ID (e.g. name@upi).');
      setWithdrawLoading(false);
      return;
    }

    try {
      // 1. Create withdraw doc in Firestore
      const withdrawId = doc(collection(db, 'withdraws')).id;
      await setDoc(doc(db, 'withdraws', withdrawId), {
        id: withdrawId,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        amount: amountNum,
        upiId: upiId.trim(),
        status: 'Pending',
        createdAt: Date.now()
      });

      // 2. Decrement wallet balance in users collection
      const newBalance = currentUser.walletBalance - amountNum;
      await setDoc(doc(db, 'users', currentUser.uid), {
        ...currentUser,
        walletBalance: newBalance
      });

      setWithdrawSuccess('Withdrawal request submitted successfully!');
      setUpiId('');
    } catch (err: any) {
      console.error(err);
      setWithdrawError(err.message || 'Error submitting request.');
    } finally {
      setWithdrawLoading(false);
    }
  };

  // Helper to check if a task is already completed
  const isTaskCompleted = (taskId: string) => {
    return userTasks.some(ut => ut.taskId === taskId);
  };

  return (
    <div className="max-w-[1120px] mx-auto px-4 py-6 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Side Sidebar */}
        <aside className="md:col-span-3 flex flex-col gap-4 bg-white p-5 rounded-lg border border-gray-100 shrink-0">
          <div className="mb-4">
            <h1 className="font-bold text-xl text-black">Contributor Panel</h1>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Editorial Rewards</p>
          </div>

          <nav className="flex flex-col gap-1 flex-grow">
            <button
              onClick={() => setActiveSection('dashboard')}
              className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-bold transition-all text-left cursor-pointer ${
                activeSection === 'dashboard'
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-black'
              }`}
            >
              <Wallet size={18} />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveSection('history')}
              className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-bold transition-all text-left cursor-pointer ${
                activeSection === 'history'
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-black'
              }`}
            >
              <Clock size={18} />
              <span>Completed Tasks</span>
            </button>

            <button
              onClick={() => setActiveSection('withdraw')}
              className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-bold transition-all text-left cursor-pointer ${
                activeSection === 'withdraw'
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-black'
              }`}
            >
              <ArrowUpRight size={18} />
              <span>Withdraw Funds</span>
            </button>

            <button
              onClick={() => setActiveSection('profile')}
              className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-bold transition-all text-left cursor-pointer ${
                activeSection === 'profile'
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-black'
              }`}
            >
              <UserIcon size={18} />
              <span>My Profile</span>
            </button>

            {currentUser.role === 'admin' && (
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-bold text-red-600 hover:bg-red-50 transition-all text-left cursor-pointer mt-4 border border-red-100"
              >
                <Clock size={18} />
                <span>Admin Panel</span>
              </button>
            )}
          </nav>

          <div className="mt-8 pt-4 border-t border-gray-100">
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-gray-500 hover:text-red-600 font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </aside>

        {/* Right Side Main Content View */}
        <div className="md:col-span-9 flex flex-col gap-6">
          
          {/* Welcome header */}
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-black">Welcome back, Contributor</h2>
            <p className="text-gray-500 text-sm mt-1">Manage your editorial tasks and track your rewards in real-time.</p>
          </div>

          {/* Section: Dashboard */}
          {activeSection === 'dashboard' && (
            <div className="space-y-8 animate-fade-in">
              
              {/* Wallet Bento Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
                
                {/* Balance Card */}
                <div className="sm:col-span-8 bg-black text-white p-8 rounded-lg relative overflow-hidden flex flex-col justify-between h-48">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Current Balance</span>
                    <h3 className="text-4xl font-bold tracking-tight">₹{currentUser.walletBalance.toFixed(2)}</h3>
                  </div>

                  <div className="flex gap-8 border-t border-white/10 pt-4">
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Total Earned</p>
                      <p className="text-lg font-bold">₹{currentUser.totalEarned.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Tasks Completed</p>
                      <p className="text-lg font-bold">{userTasks.length}</p>
                    </div>
                  </div>
                  <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                </div>

                {/* Performance Analytics Card */}
                <div className="sm:col-span-4 border border-gray-100 p-6 rounded-lg flex flex-col justify-between bg-white">
                  <div>
                    <h4 className="font-bold text-black text-sm uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <CheckCircle2 size={16} className="text-black" /> Task Target
                    </h4>
                    <p className="text-gray-500 text-xs leading-relaxed">
                      You completed {userTasks.filter(ut => Date.now() - ut.completedAt < 7 * 24 * 60 * 60 * 1000).length} tasks this week. Keep going to unlock faster review tier bonuses!
                    </p>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden border border-gray-100">
                      <div 
                        className="bg-black h-full transition-all duration-500" 
                        style={{ width: `${Math.min(100, (userTasks.length / 10) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-wider">
                      <span>Progress</span>
                      <span>{userTasks.length}/10 Tasks</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Available Tasks List */}
              <div className="bg-white border border-gray-100 rounded-lg">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h3 className="font-bold text-black text-base uppercase tracking-wider">Available Tasks</h3>
                  <span className="bg-black text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {tasks.filter(t => !isTaskCompleted(t.id)).length} Active
                  </span>
                </div>

                <div className="divide-y divide-gray-100">
                  {tasks.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 text-sm">
                      No active editorial tasks found in registry.
                    </div>
                  ) : (
                    tasks.map((task) => {
                      const completed = isTaskCompleted(task.id);
                      return (
                        <div key={task.id} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50 transition-colors">
                          <div className="flex gap-3 items-start">
                            <input 
                              type="checkbox" 
                              checked={completed}
                              readOnly
                              className="mt-1 border-gray-300 rounded text-black focus:ring-black h-4 w-4"
                            />
                            <div>
                              <h4 className={`font-bold text-sm ${completed ? 'line-through text-gray-400' : 'text-black'}`}>
                                {task.title}
                              </h4>
                              <p className="text-gray-400 text-xs mt-0.5">Verify information correctness inside 3 review checkpoints.</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-6 w-full sm:w-auto shrink-0 self-end sm:self-center">
                            <div className="text-right">
                              <span className="font-mono font-bold text-sm text-black">₹{task.rewardAmount.toFixed(2)}</span>
                              <p className="text-[9px] text-gray-400 uppercase tracking-widest">per review</p>
                            </div>
                            {completed ? (
                              <span className="bg-green-100 text-green-700 font-bold text-xs px-3 py-1.5 rounded uppercase tracking-wider">
                                Claimed
                              </span>
                            ) : (
                              <button
                                onClick={() => onStartTask(task)}
                                className="bg-black text-white px-5 py-2 rounded-md text-xs font-bold hover:bg-gray-800 transition-colors cursor-pointer"
                              >
                                Start Task
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Editor Referral Widget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="p-6 bg-black text-white rounded-lg flex flex-col justify-between h-40">
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider mb-1">Editor Referral Program</h4>
                    <p className="text-gray-400 text-xs leading-normal">Invite verified peer journalists and earn ₹50 once they finish 100 verification checkpoints.</p>
                  </div>
                  <button className="bg-white text-black py-1.5 px-4 rounded-md text-xs font-bold self-start hover:bg-gray-100 transition-colors cursor-pointer">
                    Copy Invite Link
                  </button>
                </div>

                <div className="p-6 border border-gray-100 rounded-lg flex flex-col justify-between h-40 bg-white">
                  <div>
                    <h4 className="font-bold text-black text-sm uppercase tracking-wider mb-1">Need Guidelines?</h4>
                    <p className="text-gray-500 text-xs leading-normal">Read our strict news fact-checking code of conduct to prevent review dispute penalties.</p>
                  </div>
                  <button className="border border-gray-200 text-black py-1.5 px-4 rounded-md text-xs font-bold self-start hover:bg-gray-50 transition-colors cursor-pointer">
                    View Code of Ethics
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* Section: History */}
          {activeSection === 'history' && (
            <div className="bg-white border border-gray-100 rounded-lg p-6 animate-fade-in space-y-4">
              <h3 className="font-bold text-black text-base uppercase tracking-wider border-b border-gray-100 pb-3">Completed tasks registry</h3>
              {userTasks.length === 0 ? (
                <div className="py-8 text-center text-gray-400 text-sm">
                  You haven't completed any editorial tasks yet.
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {userTasks.map((ut) => (
                    <div key={ut.id} className="py-4 flex justify-between items-center text-sm">
                      <div>
                        <p className="font-bold text-black">{ut.taskTitle}</p>
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                          Claimed on {new Date(ut.completedAt).toLocaleString()}
                        </p>
                      </div>
                      <span className="font-mono font-bold text-green-600">+₹{ut.rewardAmount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Section: Withdraw */}
          {activeSection === 'withdraw' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
              
              {/* Withdraw request form */}
              <div className="lg:col-span-7 bg-white border border-gray-100 rounded-lg p-6">
                <h3 className="font-bold text-black text-base uppercase tracking-wider border-b border-gray-100 pb-3 mb-6">Withdraw Earnings</h3>
                
                {withdrawError && (
                  <div className="mb-4 bg-red-50 text-red-700 text-xs p-3 rounded font-medium border border-red-100 text-center">
                    {withdrawError}
                  </div>
                )}

                {withdrawSuccess && (
                  <div className="mb-4 bg-green-50 text-green-700 text-xs p-3 rounded font-medium border border-green-200 text-center">
                    {withdrawSuccess}
                  </div>
                )}

                <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block">Withdraw Amount (₹)</label>
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      min="300"
                      step="any"
                      className="w-full h-11 px-4 bg-gray-50/50 border border-gray-100 rounded-md text-sm text-black focus:outline-none focus:border-black"
                      required
                    />
                    <p className="text-[10px] text-gray-400 font-medium">Minimum withdrawal limit: ₹300</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block">Your UPI ID</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@upi"
                      className="w-full h-11 px-4 bg-gray-50/50 border border-gray-100 rounded-md text-sm text-black focus:outline-none focus:border-black"
                      required
                    />
                    <p className="text-[10px] text-gray-400 font-medium">Payouts are sent to your UPI address securely within 24 hours.</p>
                  </div>

                  <button
                    type="submit"
                    disabled={withdrawLoading}
                    className="w-full h-11 bg-black text-white rounded-md font-bold text-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <span>{withdrawLoading ? 'Submitting...' : 'Submit Withdraw Request'}</span>
                  </button>
                </form>
              </div>

              {/* Status and limits column */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                
                {/* Available Balance Card */}
                <div className="p-6 border border-gray-100 rounded-lg bg-gray-50/50 text-center">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Withdrawable Balance</span>
                  <p className="text-3xl font-bold text-black">₹{currentUser.walletBalance.toFixed(2)}</p>
                </div>

                {/* History list */}
                <div className="bg-white border border-gray-100 rounded-lg p-5 flex-grow">
                  <h4 className="font-bold text-black text-xs uppercase tracking-wider border-b border-gray-100 pb-2 mb-3">Withdrawal Log</h4>
                  {withdraws.length === 0 ? (
                    <p className="text-gray-400 text-xs text-center py-6">No withdrawals recorded.</p>
                  ) : (
                    <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto">
                      {withdraws.map((w) => (
                        <div key={w.id} className="py-3 flex justify-between items-center text-xs">
                          <div>
                            <p className="font-bold text-black">₹{w.amount.toFixed(2)}</p>
                            <p className="text-[9px] text-gray-400 font-medium mt-0.5">{new Date(w.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                              w.status === 'Approved' ? 'bg-green-50 text-green-700' :
                              w.status === 'Rejected' ? 'bg-red-50 text-red-700' :
                              'bg-yellow-50 text-yellow-700'
                            }`}>
                              {w.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* Section: Profile */}
          {activeSection === 'profile' && (
            <div className="bg-white border border-gray-100 rounded-lg p-6 animate-fade-in space-y-6">
              <h3 className="font-bold text-black text-base uppercase tracking-wider border-b border-gray-100 pb-3">Contributor Profile</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Registered Email</p>
                  <p className="text-base font-bold text-black mt-1">{currentUser.email}</p>
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Authorized Role</p>
                  <p className="text-base font-bold text-black mt-1 capitalize">{currentUser.role}</p>
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Registered On</p>
                  <p className="text-base font-bold text-black mt-1">
                    {new Date(currentUser.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Wallet Balance Status</p>
                  <p className="text-base font-bold text-black mt-1">Active</p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
