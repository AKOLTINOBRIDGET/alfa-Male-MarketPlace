import { useState, useEffect } from 'react';
import {
  FaBox, FaCalendarCheck, FaChartLine, FaUserTie,
  FaExclamationTriangle, FaArrowRight,
  FaDollarSign
} from 'react-icons/fa';
import orderService from '../../services/orderService';
import appointmentService from '../../services/appointmentService';
import staffService from '../../services/staffService';
import { useToastContext } from '../../context/ToastContext';
import { getResponseList } from '../../utils/apiResponse';

const DashboardOverview = ({ setActiveTab }) => {
  const toast = useToastContext();
  const [orders, setOrders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [staff, setStaff] = useState([]);
  const [hoveredMonth, setHoveredMonth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [ordersRes, apptsRes, staffRes] = await Promise.all([
          orderService.getOrders(),
          appointmentService.getAppointments(),
          staffService.getAllStaff()
        ]);

        setOrders(getResponseList(ordersRes));
        setAppointments(getResponseList(apptsRes));
        setStaff(getResponseList(staffRes));
      } catch (error) {
        toast.error(error.message || 'Unable to load dashboard data from the database.');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [toast]);

  const totalRevenue = orders.reduce((sum, order) => sum + (order.total ?? order.pricing?.total ?? 0), 0);
  const pendingOrdersCount = orders.filter((order) => order.status === 'Processing').length;
  const pendingAppointmentsCount = appointments.filter((appt) => appt.status === 'Pending').length;
  const activeTailorsCount = staff.filter((member) => member.role?.toLowerCase().includes('tailor') && member.status === 'Available').length;

  const unassignedOrders = orders.filter((order) => !order.assignedTailor && order.status === 'Processing');
  const unassignedAppts = appointments.filter((appt) => !appt.assignedStaff && ['Pending', 'Scheduled'].includes(appt.status));
  const totalAttentionRequired = unassignedOrders.length + unassignedAppts.length;

  const baseSales = [800, 1400, 1100, 2400, 1900];
  const monthlySales = [...baseSales, totalRevenue];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  const targetRevenue = 5000;
  const goalPercentage = Math.min(Math.round((totalRevenue / targetRevenue) * 100), 100);
  const strokeWidth = 8;
  const radius = 50;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (goalPercentage / 100) * circumference;

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-[#0a0a0a] p-10 text-center text-gray-400">
        Loading dashboard data...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-serif text-white">Dashboard Overview</h1>
        <p className="text-gray-400 text-sm mt-1">Here is a real-time summary of your boutique's performance and operations.</p>
      </div>

      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, subText: "Active boutique sales", icon: FaDollarSign, color: "text-green-400", bg: "bg-green-400/5 border-green-500/10" },
          { title: "Pending Orders", value: pendingOrdersCount, subText: "Requires processing", icon: FaBox, color: "text-blue-400", bg: "bg-blue-400/5 border-blue-500/10" },
          { title: "New Fittings", value: pendingAppointmentsCount, subText: "Needs review", icon: FaCalendarCheck, color: "text-purple-400", bg: "bg-purple-400/5 border-purple-500/10" },
          { title: "Active Tailors", value: `${activeTailorsCount} Available`, subText: "On boutique duty", icon: FaUserTie, color: "text-gold-500", bg: "bg-gold-500/5 border-gold-500/10" }
        ].map((card, i) => (
          <div key={i} className={`bg-[#0a0a0a] border rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] ${card.bg}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-xs tracking-wider uppercase mb-1 font-semibold">{card.title}</p>
                <p className="text-2xl font-bold font-serif text-white mt-1">{card.value}</p>
                <p className="text-xs text-gray-500 mt-2">{card.subText}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center ${card.color}`}>
                <card.icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales Performance Chart (SVG area chart) */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div>
              <h3 className="text-lg font-serif text-white">Sales Performance Trend</h3>
              <p className="text-xs text-gray-500">Monthly gross sales revenue in USD</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gold-500 font-semibold bg-gold-500/10 px-2.5 py-1 rounded-full border border-gold-500/20">
              <FaChartLine /> Upward Trend
            </div>
          </div>

          {/* SVG Sales Trend Chart */}
          <div className="relative pt-4">
            <svg viewBox="0 0 500 200" className="w-full h-56 overflow-visible">
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Gridlines */}
              <line x1="40" y1="160" x2="480" y2="160" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" />
              <line x1="40" y1="110" x2="480" y2="110" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" />
              <line x1="40" y1="60" x2="480" y2="60" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" />
              <line x1="40" y1="10" x2="480" y2="10" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" />

              {/* Chart Line & Fill */}
              {/* Point mapping: X is spaced 40 + index * 80. Y is mapped (200 - 40) - value * scale */}
              {/* Values: [800, 1400, 1100, 2400, 1900, totalRevenue]. Let's say max value is 3000. Scale = 150 / 3000 = 0.05 */}
              {(() => {
                const maxVal = Math.max(...monthlySales, 3000);
                const points = monthlySales.map((val, idx) => {
                  const x = 40 + idx * 84;
                  const y = 160 - (val / maxVal) * 130;
                  return { x, y, val };
                });

                const pathD = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
                const fillD = `${pathD} L ${points[points.length - 1].x} 160 L ${points[0].x} 160 Z`;

                return (
                  <>
                    {/* Area Fill */}
                    <path d={fillD} fill="url(#areaGrad)" />

                    {/* Plot Line */}
                    <path d={pathD} fill="none" stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="round" />

                    {/* Interactive points & hover anchors */}
                    {points.map((p, idx) => (
                      <g key={idx} className="cursor-pointer group">
                        <circle 
                          cx={p.x} 
                          cy={p.y} 
                          r={hoveredMonth === idx ? "6" : "4"} 
                          fill={hoveredMonth === idx ? "#ffffff" : "#C9A84C"} 
                          stroke="#0a0a0a" 
                          strokeWidth="2" 
                          onMouseEnter={() => setHoveredMonth(idx)}
                          onMouseLeave={() => setHoveredMonth(null)}
                          className="transition-all duration-200"
                        />
                        {/* Tooltip Overlay */}
                        {hoveredMonth === idx && (
                          <foreignObject x={p.x - 45} y={p.y - 45} width="90" height="35" className="overflow-visible pointer-events-none">
                            <div className="bg-white text-dark font-sans font-bold text-[10px] py-1 px-2 rounded shadow-xl text-center border border-gold-500 relative">
                              ${p.val.toLocaleString()}
                              <div className="w-1.5 h-1.5 bg-white border-r border-b border-gold-500 absolute bottom-[-4px] left-[42%] transform rotate-45" />
                            </div>
                          </foreignObject>
                        )}
                      </g>
                    ))}
                  </>
                );
              })()}

              {/* Labels */}
              {months.map((m, idx) => (
                <text 
                  key={m} 
                  x={40 + idx * 84} 
                  y="180" 
                  fill="#666666" 
                  fontSize="10" 
                  textAnchor="middle"
                  className="font-mono"
                >
                  {m}
                </text>
              ))}
            </svg>
          </div>
        </div>

        {/* Monthly Target Gauge (SVG Circular Ring) */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h3 className="text-lg font-serif text-white">Monthly Target</h3>
            <p className="text-xs text-gray-500">Gross sales goal achievement progress</p>
          </div>

          <div className="flex flex-col items-center justify-center py-4 relative">
            <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
              {/* Background Ring */}
              <circle
                stroke="rgba(255,255,255,0.05)"
                fill="transparent"
                strokeWidth={strokeWidth}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              {/* Accent Progress Ring */}
              <circle
                stroke="#C9A84C"
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                className="transition-all duration-500 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-bold text-white font-serif">{goalPercentage}%</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">Reached</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center space-y-1">
            <p className="text-xs text-gray-400">Current Monthly Revenue Goal</p>
            <p className="text-white text-lg font-serif font-bold">
              ${totalRevenue.toLocaleString()} <span className="text-gold-500 text-xs font-normal">/ ${targetRevenue.toLocaleString()}</span>
            </p>
          </div>
        </div>

      </div>

      {/* Needs Attention Tasks (Actionable Assignments Panel) */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <FaExclamationTriangle size={18} />
            </div>
            <div>
              <h3 className="text-lg font-serif text-white">Needs Immediate Attention</h3>
              <p className="text-xs text-gray-500">Unassigned custom clothing orders or fit appointments</p>
            </div>
          </div>
          <span className="text-xs font-bold font-mono px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 rounded-full">
            {totalAttentionRequired} Pending Action
          </span>
        </div>

        {totalAttentionRequired === 0 ? (
          <div className="text-center py-10 text-gray-500 text-sm border border-dashed border-white/10 rounded-xl">
            🎉 All orders and appointment schedules are currently assigned to staff!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Unassigned Orders */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 font-mono">Unassigned Orders ({unassignedOrders.length})</h4>
              {unassignedOrders.length === 0 ? (
                <p className="text-xs text-gray-600 italic">No unassigned orders.</p>
              ) : (
                <div className="space-y-3">
                  {unassignedOrders.map(order => (
                    <div key={order._id || order.id} className="p-4 rounded-xl bg-white/5 border border-white/15 hover:border-gold-500/30 transition-all flex justify-between items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gold-500 font-mono font-bold">{order.orderNumber || order._id?.slice(-6) || order.id}</span>
                          <span className="text-xs text-gray-500">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}</span>
                        </div>
                        <p className="text-sm text-white font-medium mt-1">{order.customer?.name || 'Unknown Customer'}</p>
                        <p className="text-xs text-gray-400 truncate max-w-[180px] mt-0.5">
                          {order.items?.map((item) => item.name).join(', ') || 'No items'}
                        </p>
                      </div>
                      <button 
                        onClick={() => setActiveTab('orders')}
                        className="bg-gold-500 hover:bg-gold-400 text-dark p-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transform active:scale-95 transition-all"
                      >
                        Assign <FaArrowRight size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Unassigned Appointments */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 font-mono">Unassigned Fittings ({unassignedAppts.length})</h4>
              {unassignedAppts.length === 0 ? (
                <p className="text-xs text-gray-600 italic">No unassigned appointments.</p>
              ) : (
                <div className="space-y-3">
                  {unassignedAppts.map(appt => (
                    <div key={appt._id || appt.id} className="p-4 rounded-xl bg-white/5 border border-white/15 hover:border-gold-500/30 transition-all flex justify-between items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gold-500 font-mono font-bold">{appt._id?.slice(-6) || appt.id}</span>
                          <span className="text-xs text-purple-400 bg-purple-500/15 border border-purple-500/25 px-1.5 py-0.5 rounded text-[10px]">{appt.serviceType}</span>
                        </div>
                        <p className="text-sm text-white font-medium mt-1">{appt.customer?.name || 'Unknown Customer'}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{appt.notes || 'No notes added'}</p>
                      </div>
                      <button 
                        onClick={() => setActiveTab('appointments')}
                        className="bg-gold-500 hover:bg-gold-400 text-dark p-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transform active:scale-95 transition-all"
                      >
                        Assign <FaArrowRight size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </div>

    </div>
  );
};

export default DashboardOverview;
