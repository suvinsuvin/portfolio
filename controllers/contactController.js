const nodemailer = require('nodemailer');
const connectDB = require('../db');
console.log('EMAIL:', process.env.EMAIL);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS);


exports.handleContact = async (req, res) => {
  const { name, email, message } = req.body;

  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  try {
    // Email configuration
    const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

    const mailOptions = {
      from: process.env.EMAIL_USER, // Use your email as sender
      to: process.env.EMAIL_RECEIVER,
      replyTo: email, // User's email for replies
      subject: `New Portfolio Contact: ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4070f4;">New Contact Form Submission</h2>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <div style="background-color: white; padding: 15px; border-radius: 5px; margin-top: 10px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            Sent from your portfolio contact form at ${new Date().toLocaleString()}
          </p>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Store in database
    const db = await connectDB();
    const result = await db.collection('contacts').insertOne({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      createdAt: new Date(),
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    });

    console.log('✅ Contact form submitted:', { name, email, id: result.insertedId });
    
    res.status(200).json({ 
      success: true,
      message: 'Message sent successfully! I\'ll get back to you soon.' 
    });

  } catch (err) {
    console.error('❌ Contact form error:', err);
    
    // Different error messages for different types of errors
    if (err.code === 'EAUTH') {
      return res.status(500).json({ error: 'Email configuration error. Please try again later.' });
    }
    
    if (err.name === 'MongoError' || err.name === 'MongoServerError') {
      return res.status(500).json({ error: 'Database error. Please try again later.' });
    }
    
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};