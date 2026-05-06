import Lead from '../models/Lead.js';

// Get all leads for the logged-in user's store with pagination
export const getLeads = async (req, res) => {
  try {
    const { status, source, startDate, endDate, page = 1, limit = 30 } = req.query;
    
    const query = { store_id: req.user.store_id };

    if (status) query.status = status;
    if (source) query.source = source;

    if (startDate || endDate) {
      query.created_at = {};
      if (startDate) query.created_at.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.created_at.$lte = end;
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const totalLeads = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    res.json({
      leads,
      pagination: {
        total: totalLeads,
        pages: Math.ceil(totalLeads / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
