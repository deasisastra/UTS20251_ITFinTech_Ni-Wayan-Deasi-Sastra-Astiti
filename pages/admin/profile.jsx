import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Category from "../../components/admin/Category";
import Footer from "../../components/admin/Footer";
import Order from "../../components/admin/Order";
import Products from "../../components/admin/Products";
import { toast } from "react-toastify";

// Admin-only component to show revenue statistics
const RevenueStats = ({ stats }) => {
  if (!stats) return null;
  
  const formatCurrency = (amount) => `$${amount.toFixed(2)}`;
  
  const today = new Date().toISOString().split('T')[0];
  const dailyTotal = stats.daily?.find(d => d._id === today)?.total || 0;
  const monthlyTotal = stats.monthly?.reduce((sum, m) => sum + m.total, 0) || 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">Today's Revenue</h3>
        <p className="text-3xl font-bold text-green-600">{formatCurrency(dailyTotal)}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">Monthly Revenue</h3>
        <p className="text-3xl font-bold text-blue-600">{formatCurrency(monthlyTotal)}</p>
      </div>
    </div>
  );
};

const Profile = () => {
  const [tabs, setTabs] = useState(0);
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const { push } = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/stats`);
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
        toast.error("Failed to load revenue statistics");
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders`);
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    fetchOrders();
  }, []);

  const closeAdminAccount = async () => {
    try {
      if (confirm("Are you sure you want to close your Admin Account?")) {
        const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/admin`);
        if (res.status === 200) {
          push("/admin");
          toast.success("Admin Account Closed!");
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex px-10 min-h-[calc(100vh_-_433px)] lg:flex-row flex-col lg:mb-0 mb-10">
      <div className="lg:w-80 w-100 flex-shrink-0 lg:h-[100vh] justify-center flex flex-col border-l-2 border-r-4 shadow-2xl">
        <div className="relative flex flex-col items-center px-10 py-5 border-b-0">
          <Image
            src="/images/admin.png"
            alt=""
            width={100}
            height={100}
            className="rounded-full"
          />
          <b className="text-2xl mt-1">Admin Dashboard</b>
          {!loading && (
            <div className="text-sm mt-2">
              <p>Total Orders: {orders.length}</p>
              <p>Pending Payments: {orders.filter(o => o.method === 0).length}</p>
            </div>
          )}
        </div>
        <ul className="text-center font-semibold">
          <li
            className={`border w-full p-3 cursor-pointer hover:bg-primary hover:text-white transition-all ${
              tabs === 0 && "bg-primary text-white"
            }`}
            onClick={() => setTabs(0)}
          >
            <i className="fa fa-cutlery"></i>
            <button className="ml-1 ">Products</button>
          </li>
          <li
            className={`border w-full p-3 cursor-pointer hover:bg-primary hover:text-white transition-all ${
              tabs === 1 && "bg-primary text-white"
            }`}
            onClick={() => setTabs(1)}
          >
            <i className="fa fa-motorcycle"></i>
            <button className="ml-1">Orders</button>
          </li>
          <li
            className={`border w-full p-3 cursor-pointer hover:bg-primary hover:text-white transition-all ${
              tabs === 2 && "bg-primary text-white"
            }`}
            onClick={() => setTabs(2)}
          >
            <i className="fa fa-ellipsis-h"></i>
            <button className="ml-1">Categories</button>
          </li>
          <li
            className={`border w-full p-3 cursor-pointer hover:bg-primary hover:text-white transition-all ${
              tabs === 3 && "bg-primary text-white"
            }`}
            onClick={() => setTabs(3)}
          >
            <i className="fa fa-window-maximize"></i>
            <button className="ml-1">Footer</button>
          </li>
          {/* 'Go to the site (New Tab)' removed per request */}
          <li
            className={`border w-full p-3 cursor-pointer hover:bg-primary hover:text-white transition-all ${
              tabs === 4 && "bg-primary text-white"
            }`}
            onClick={() => setTabs(4)}
          >
            <i className="fa fa-chart-bar"></i>
            <button className="ml-1">Statistics</button>
          </li>
          {/* 'Go to the site (current tab)' removed per request */}
          <li
            className={`border w-full p-3 cursor-pointer hover:bg-primary hover:text-white transition-all ${
              tabs === 4 && "bg-primary text-white"
            }`}
            onClick={closeAdminAccount}
          >
            <i className="fa fa-sign-out"></i>
            <button className="ml-1">Exit</button>
          </li>
        </ul>
      </div>
      {tabs === 0 && <Products />}
      {tabs === 1 && <Order />}
      {tabs === 2 && <Category />}
      {tabs === 3 && <Footer />}
      {tabs === 4 && <StatisticsPanel />}
    </div>
  );
};

// Simple statistics panel showing food vs drinks purchases (pie chart)
const StatisticsPanel = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/stats`);
        setStats(res.data || null);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };
    getStats();
  }, []);

  if (!stats) {
    return (
      <div className="flex-1 p-8">
        <h2 className="text-2xl font-semibold mb-4">Statistics</h2>
        <div className="text-sm text-gray-500">Loading statistics...</div>
      </div>
    );
  }

  const food = stats.foodVsDrinks?.food || 0;
  const drinks = stats.foodVsDrinks?.drinks || 0;
  const total = food + drinks || 1;
  const foodPct = Math.round((food / total) * 100);
  const drinksPct = Math.round((drinks / total) * 100);

  // Simple SVG pie chart
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const foodArc = (food / total) * circumference;
  const drinksArc = (drinks / total) * circumference;

  return (
    <div className="flex-1 p-8">
      <h2 className="text-2xl font-semibold mb-4">Food vs Drinks — Total Items Sold</h2>
      <div className="flex items-center gap-8">
        <div>
          <svg width={220} height={220} viewBox="0 0 220 220">
            <g transform="translate(110,110)">
              <circle r={radius} fill="#eee" />
              {/* Food slice (drawn as stroke arc) */}
              <circle
                r={radius}
                fill="transparent"
                stroke="#f97316"
                strokeWidth={radius * 2}
                strokeDasharray={`${foodArc} ${circumference - foodArc}`}
                strokeDashoffset={-circumference / 4}
                transform="rotate(-90)"
              />
              {/* Drinks slice */}
              <circle
                r={radius}
                fill="transparent"
                stroke="#06b6d4"
                strokeWidth={radius * 2}
                strokeDasharray={`${drinksArc} ${circumference - drinksArc}`}
                strokeDashoffset={-circumference / 4 + foodArc}
                transform="rotate(-90)"
              />
              <text x="0" y="5" textAnchor="middle" fontSize="18" fill="#111">
                {total}
              </text>
            </g>
          </svg>
        </div>
        <div>
          <div className="mb-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 inline-block rounded-sm bg-orange-500" />
              <b>Food</b>
              <span className="ml-2 text-sm text-gray-600">{food} items</span>
              <span className="ml-2 text-sm text-gray-500">({foodPct}%)</span>
            </div>
          </div>
          <div className="mb-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 inline-block rounded-sm bg-cyan-400" />
              <b>Drinks</b>
              <span className="ml-2 text-sm text-gray-600">{drinks} items</span>
              <span className="ml-2 text-sm text-gray-500">({drinksPct}%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = (ctx) => {
  const myCookie = ctx.req?.cookies || "";
  if (myCookie.token !== process.env.ADMIN_TOKEN) {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default Profile;
