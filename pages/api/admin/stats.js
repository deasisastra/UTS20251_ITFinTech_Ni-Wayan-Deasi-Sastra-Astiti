import dbConnect from "../../../util/dbConnect";
import Order from "../../../models/Order";

const handler = async (req, res) => {
  await dbConnect();

  try {
    // daily revenue for last 7 days
    const daily = await Order.aggregate([
      {
        $match: {},
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          total: { $sum: "$total" },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 7 },
    ]);

    // monthly revenue for last 12 months
    const monthly = await Order.aggregate([
      { $match: {} },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          total: { $sum: "$total" },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 12 },
    ]);

    // Compute food vs drinks breakdown based on ordered product titles
    // We aggregate quantities per product title then lookup the product to get its category
    const breakdownByCategory = await Order.aggregate([
      { $unwind: "$products" },
      { $group: { _id: "$products.title", quantity: { $sum: "$products.foodQuantity" } } },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "title",
          as: "prod",
        },
      },
      { $unwind: { path: "$prod", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: { $ifNull: ["$prod.category", "unknown"] },
          totalQuantity: { $sum: "$quantity" },
        },
      },
    ]);

    // Map to simple food vs drinks totals
    let foodCount = 0;
    let drinksCount = 0;
    breakdownByCategory.forEach((c) => {
      const catName = (c._id || "").toString().toLowerCase();
      if (catName.includes("drink") || catName.includes("beverage") || catName === "drinks") {
        drinksCount += c.totalQuantity || 0;
      } else {
        foodCount += c.totalQuantity || 0;
      }
    });

    res.status(200).json({ daily, monthly, foodVsDrinks: { food: foodCount, drinks: drinksCount } });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

export default handler;
