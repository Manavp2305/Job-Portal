import jwt from 'jsonwebtoken';

const adminAuth = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ success: false, message: 'Access Denied' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified.isRecruiter) {
      return res.status(403).json({ success: false, message: 'Not authorized as a recruiter' });
    }
    req.recruiter = verified;
    next();
  } catch (err) {
    res.status(400).json({ success: false, message: 'Invalid Token' });
  }
};

export default adminAuth;
