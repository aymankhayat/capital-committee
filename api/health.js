// GET /api/health — tells the browser whether live runs are available.
export default function handler(req, res) {
  res.status(200).json({
    live: Boolean(process.env.ANTHROPIC_API_KEY),
    passcode: Boolean(process.env.APP_PASSCODE),
  });
}
