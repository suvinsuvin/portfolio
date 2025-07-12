const connectDB = require('../db');

exports.getMessages = async (req, res) => {
  try {
    const db = await connectDB();
    
    // Get query parameters for pagination and filtering
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    
    // Get total count
    const total = await db.collection('contacts').countDocuments();
    
    // Get messages with pagination
    const messages = await db.collection('contacts')
      .find()
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(limit)
      .toArray();
    
    // Format response
    const formattedMessages = messages.map(msg => ({
      id: msg._id,
      name: msg.name,
      email: msg.email,
      message: msg.message,
      createdAt: msg.createdAt,
      ip: msg.ip,
      userAgent: msg.userAgent
    }));
    
    res.status(200).json({
      messages: formattedMessages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (err) {
    console.error('❌ Failed to fetch messages:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'Message ID is required' });
    }
    
    const db = await connectDB();
    const result = await db.collection('contacts').deleteOne({ _id: new require('mongodb').ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    res.status(200).json({ success: true, message: 'Message deleted successfully' });
    
  } catch (err) {
    console.error('❌ Failed to delete message:', err);
    res.status(500).json({ error: 'Failed to delete message' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const db = await connectDB();
    
    // Get basic stats
    const total = await db.collection('contacts').countDocuments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayCount = await db.collection('contacts').countDocuments({
      createdAt: { $gte: today }
    });
    
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    
    const weekCount = await db.collection('contacts').countDocuments({
      createdAt: { $gte: thisWeek }
    });
    
    res.status(200).json({
      total,
      today: todayCount,
      thisWeek: weekCount
    });
    
  } catch (err) {
    console.error('❌ Failed to fetch stats:', err);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};