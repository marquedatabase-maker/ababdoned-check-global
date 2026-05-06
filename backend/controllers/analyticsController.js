import Lead from '../models/Lead.js';

export const getAnalytics = async (req, res) => {
  try {
    const store_id = req.user.store_id;
    const { startDate, endDate } = req.query;
    console.log(`Fetching analytics for store_id: ${store_id} with dates: ${startDate} - ${endDate}`);

    const query = { store_id };
    if (startDate || endDate) {
      query.created_at = {};
      if (startDate) query.created_at.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.created_at.$lte = end;
      }
    }

    const totalLeads = await Lead.countDocuments(query);
    const abandonedCount = await Lead.countDocuments({ ...query, status: 'abandoned' });
    const convertedCount = await Lead.countDocuments({ ...query, status: 'success' });
    
    const stats = await Lead.aggregate([
      { $match: query },
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
