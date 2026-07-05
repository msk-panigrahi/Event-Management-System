import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import Navbar from '../../components/Navbar';
import DashboardSidebar from '../../components/DashboardSidebar';
import { SkeletonStats } from '../../components/Skeleton';
import { analyticsAPI, dashboardAPI } from '../../services/api';
import { formatCurrency } from '../../utils/helpers';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const chartOptions = {
  responsive: true,
  plugins: { legend: { labels: { color: '#fff' } } },
  scales: {
    x: { ticks: { color: '#aaa' }, grid: { color: 'rgba(255,255,255,0.05)' } },
    y: { ticks: { color: '#aaa' }, grid: { color: 'rgba(255,255,255,0.05)' } },
  },
};

const pieOptions = {
  responsive: true,
  plugins: { legend: { position: 'bottom', labels: { color: '#fff', padding: 16 } } },
};

const Analytics = () => {
  const [revenue, setRevenue] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [popular, setPopular] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statusStats, setStatusStats] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rev, book, pop, cat, status, dash] = await Promise.all([
          analyticsAPI.getMonthlyRevenue(new Date().getFullYear()),
          analyticsAPI.getMonthlyBookings(new Date().getFullYear()),
          analyticsAPI.getPopularEvents(),
          analyticsAPI.getCategoryDistribution(),
          analyticsAPI.getBookingStatus(),
          dashboardAPI.getAdminStats(),
        ]);
        setRevenue(rev.data.data);
        setBookings(book.data.data);
        setPopular(pop.data.data);
        setCategories(cat.data.data);
        setStatusStats(status.data.data);
        setStats(dash.data.data);
      } catch {
        setRevenue([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const revenueChart = {
    labels: revenue.map((r) => r.month),
    datasets: [{
      label: 'Revenue (₹)',
      data: revenue.map((r) => r.revenue),
      backgroundColor: 'rgba(99, 102, 241, 0.7)',
      borderRadius: 8,
    }],
  };

  const bookingsChart = {
    labels: bookings.map((b) => b.month),
    datasets: [{
      label: 'Bookings',
      data: bookings.map((b) => b.count),
      backgroundColor: 'rgba(168, 85, 247, 0.7)',
      borderRadius: 8,
    }],
  };

  const categoryChart = {
    labels: categories.map((c) => c.category),
    datasets: [{
      data: categories.map((c) => c.count),
      backgroundColor: [
        'rgba(99, 102, 241, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(129, 140, 248, 0.8)',
        'rgba(192, 132, 252, 0.8)',
        'rgba(79, 70, 229, 0.8)',
        'rgba(139, 92, 246, 0.8)',
      ],
    }],
  };

  const statusChart = {
    labels: statusStats.map((s) => s.status),
    datasets: [{
      data: statusStats.map((s) => s.count),
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(99, 102, 241, 0.8)',
      ],
    }],
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-layout">
        <DashboardSidebar isAdmin />
        <main className="dashboard-main">
          <h1 className="section-title">Analytics Dashboard</h1>
          <p className="section-subtitle">Revenue, bookings, and event performance insights</p>

          {loading ? <SkeletonStats count={4} /> : (
            <div className="grid-4 mb-4">
              <div className="stat-card">
                <div className="stat-card-value">{formatCurrency(stats?.totalRevenue || 0)}</div>
                <div className="stat-card-label">Total Revenue</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-value">{stats?.totalBookings || 0}</div>
                <div className="stat-card-label">Total Bookings</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-value">{stats?.publishedEvents || 0}</div>
                <div className="stat-card-label">Published Events</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-value">{stats?.totalUsers || 0}</div>
                <div className="stat-card-label">Registered Users</div>
              </div>
            </div>
          )}

          <div className="grid-2 mb-4">
            <div className="chart-container">
              <h3 className="chart-title">Monthly Revenue</h3>
              {!loading && <Bar data={revenueChart} options={chartOptions} />}
            </div>
            <div className="chart-container">
              <h3 className="chart-title">Monthly Bookings</h3>
              {!loading && <Bar data={bookingsChart} options={chartOptions} />}
            </div>
          </div>

          <div className="grid-2 mb-4">
            <div className="chart-container">
              <h3 className="chart-title">Events by Category</h3>
              {!loading && categories.length > 0 && <Pie data={categoryChart} options={pieOptions} />}
            </div>
            <div className="chart-container">
              <h3 className="chart-title">Booking Status</h3>
              {!loading && statusStats.length > 0 && <Pie data={statusChart} options={pieOptions} />}
            </div>
          </div>

          <div className="chart-container">
            <h3 className="chart-title">Popular Events</h3>
            {!loading && (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr><th>Event</th><th>Category</th><th>Bookings</th><th>Tickets Sold</th><th>Revenue</th></tr>
                  </thead>
                  <tbody>
                    {popular.map((p) => (
                      <tr key={p._id}>
                        <td>{p.title}</td>
                        <td>{p.category}</td>
                        <td>{p.bookings}</td>
                        <td>{p.tickets}</td>
                        <td>₹{p.revenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {popular.length === 0 && <div className="empty-state"><p>No data yet</p></div>}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default Analytics;
