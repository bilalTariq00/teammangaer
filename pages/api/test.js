export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ 
      success: true, 
      message: 'Pages Router API works!',
      timestamp: new Date().toISOString()
    });
  } else if (req.method === 'POST') {
    res.status(200).json({ 
      success: true, 
      message: 'Pages Router POST works!',
      timestamp: new Date().toISOString()
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
