import Lead from '../models/Lead.js';

export const getAnalytics = async (req, res) => {
  try {
    const store_id = req.user.store_id;
    console.log(`Fetching analytics for store_id: ${store_id}`);

    const totalLeads = await Lead.countDocuments({ store_id });
    const abandonedCount = await Lead.countDocuments({ store_id, status: 'abandoned' });
    const convertedCount = await Lead.countDocuments({ store_id, status: 'success' });
    
    const stats = await Lead.aggregate([
      { $match: { store_id } },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: { $cond: [{ $eq: ["$status", "success"] }, "$amount", 0] }
          },
          lostRevenue: {
            $sum: { $cond: [{ $eq: ["$status", "abandoned"] }, "$amount", 0] }
          }
        }
      }
    ]);

    const result = {
      totalLeads,
      abandonedCount,
      convertedCount,
      totalRevenue: stats.length > 0 ? stats[0].totalRevenue : 0,
      lostRevenue: stats.length > 0 ? stats[0].lostRevenue : 0,
    };

    console.log(`Analytics result for ${store_id}:`, result);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
