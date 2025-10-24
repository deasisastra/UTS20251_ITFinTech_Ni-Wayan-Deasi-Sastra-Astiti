import { useEffect, useState } from "react";
import Title from "../ui/Title";
import axios from "axios";
import { toast } from "react-toastify";

const SmallBar = ({ label, value, max }) => {
  const width = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="mb-2">
      <div className="text-xs mb-1">{label} — ${value}</div>
      <div className="bg-gray-300 h-3 rounded overflow-hidden">
        <div className="bg-primary h-3" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
};

const Order = () => {
  const [orders, setOrders] = useState([]);
  const status = ["preparing", "delivering", "delivered"];
  const [hasExtra, setHasExtra] = useState(false);
  const [stats, setStats] = useState({ daily: [], monthly: [] });

  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/orders`
        );
        setOrders(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getOrders();
    const getStats = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/stats`
        );
        setStats(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getStats();
  }, []);

  const handleStatusNext = async (id) => {
    const item = orders.find((order) => order._id === id);
    const currentStatus = item.status;

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`,
        { status: currentStatus + 1 }
      );
      setOrders([res.data, ...orders.filter((order) => order._id !== id)]);
    } catch (error) {
      console.log(error);
    }
  };
  const handleStatusPrior = async (id) => {
    const item = orders.find((order) => order._id === id);
    const currentStatus = item.status;

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`,
        { status: currentStatus - 1 }
      );
      setOrders([res.data, ...orders.filter((order) => order._id !== id)]);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this order?")) {
      try {
        const res = await axios.delete(
          ` ${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`
        );
        setOrders(orders.filter((order) => order._id !== id));
        if (res.data) {
          toast.success("Order deleted successfully");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="lg:p-8 flex-1 lg:mt-0 mt-5  lg:max-w-[70%] xl:max-w-none flex flex-col justify-center">
      <Title addClass="text-[40px]">Products</Title>
      <div className="overflow-x-auto w-full mt-5">
        <table className="w-full text-sm text-center text-gray-500">
          <thead className="text-xs text-gray-400 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="py-3 px-6">
                PRODUCT ID
              </th>
              <th scope="col" className="py-3 px-6">
                CUSTOMER
              </th>
              <th scope="col" className="py-3 px-6">
                Products
              </th>
              <th scope="col" className="py-3">
                EXTRAS
              </th>
              <th scope="col" className="py-3 px-6">
                TOTAL
              </th>
              <th scope="col" className="py-3 px-6">
                PAYMENT
              </th>
              <th scope="col" className="py-3 px-6">
                PAYMENT STATUS
              </th>
              <th scope="col" className="py-3 px-6">
                STATUS
              </th>
              <th scope="col" className="py-3 px-6">
                ACTION
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 &&
              orders
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((order) => (
                  <tr
                    className="transition-all bg-secondary border-gray-700 hover:bg-primary "
                    key={order._id}
                  >
                    <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white gap-x-1 ">
                      {order?._id.substring(0, 7)}
                    </td>
                    <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                      {order?.customer}
                    </td>
                    <td className="py-4 px-6 font-medium  hover:text-white flex-wrap w-[100px] whitespace-nowrap">
                      {order?.products.map((product, index) => (
                        <span key={index}>
                          {product.title} * {product.foodQuantity} <br />
                        </span>
                      ))}
                    </td>
                    <td className="py-4 font-medium hover:text-white">
                      {order?.products.map((item) => {
                        return (
                          <div key={item._id}>
                            {item.extras &&
                              item.extras.length > 0 &&
                              item.extras.map((extra) => (
                                <span key={extra._id}>{extra.text}, </span>
                              ))}
                          </div>
                        );
                      })}
                    </td>
                    <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                      ${order?.total}
                    </td>

                    <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                      {order?.method === 0 ? "Cash" : "Card"}
                    </td>
                    <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                      {/* payment status: infer paid for card payments, waiting for cash */}
                      {order?.method === 1 ? (
                        <span className="text-emerald-400">paid</span>
                      ) : (
                        <span className="text-yellow-300">waiting for payment</span>
                      )}
                    </td>
                    <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                      {status[order?.status]}
                    </td>
                    <td className="py-4 px-1 font-small whitespace-nowrap hover:text-white flex gap-3">
                      <button
                        className="btn-primary !bg-green-700 w-24 !pl-0 !pr-0"
                        onClick={() => handleStatusPrior(order?._id)}
                        disabled={order?.status < 1}
                      >
                        Prior Stage
                      </button>
                      <button
                        className="btn-primary !bg-yellow-600 w-28 !pl-0 !pr-0"
                        onClick={() => handleDelete(order?._id)}
                      >
                        Delete Order
                      </button>
                      <button
                        className="btn-primary !bg-green-700 w-24 !pl-0 !pr-0"
                        onClick={() => handleStatusNext(order?._id)}
                        disabled={order?.status > 1}
                      >
                        Next Stage
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      {/* Revenue charts */}
      <div className="mt-6 p-4 bg-white rounded shadow mb-4">
        <h3 className="text-lg font-semibold mb-3">Revenue — Daily (last 7 days)</h3>
        {stats.daily && stats.daily.length > 0 ? (
          (() => {
            const max = Math.max(...stats.daily.map((d) => d.total));
            return stats.daily
              .slice()
              .reverse()
              .map((d) => (
                <SmallBar key={d._id} label={d._id} value={d.total} max={max} />
              ));
          })()
        ) : (
          <div className="text-sm text-gray-500">No daily data</div>
        )}

        <h3 className="text-lg font-semibold my-3">Revenue — Monthly (last 12 months)</h3>
        {stats.monthly && stats.monthly.length > 0 ? (
          (() => {
            const max = Math.max(...stats.monthly.map((d) => d.total));
            return stats.monthly
              .slice()
              .reverse()
              .map((d) => (
                <SmallBar key={d._id} label={d._id} value={d.total} max={max} />
              ));
          })()
        ) : (
          <div className="text-sm text-gray-500">No monthly data</div>
        )}
      </div>
    </div>
  );
};

export default Order;
