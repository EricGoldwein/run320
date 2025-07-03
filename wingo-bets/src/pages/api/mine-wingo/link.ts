import type { NextApiRequest, NextApiResponse } from 'next';
import { spawn } from 'child_process';
import path from 'path';

type ResponseData = {
  wingoAmount: number;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ wingoAmount: 0, error: 'Method not allowed' });
  }

  const { url, accessToken } = req.body;

  try {
    const pythonProcess = spawn('python', [
      path.join(process.cwd(), 'strava_activity_wingo.py'),
      '--url', url,
      '--access-token', accessToken
    ]);

    let output = '';
    let error = '';

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    await new Promise((resolve, reject) => {
      pythonProcess.on('close', (code) => {
        if (code === 0) {
          resolve(output);
        } else {
          reject(new Error(error || 'Python process failed'));
        }
      });
    });

    // Parse the output to get the WINGO effort
    const effort = JSON.parse(output);
    const wingoAmount = effort ? 1 : 0;

    res.status(200).json({ wingoAmount });
  } catch (error) {
    console.error('Error mining WINGO:', error);
    res.status(500).json({ 
      wingoAmount: 0, 
      error: error instanceof Error ? error.message : 'Failed to mine WINGO' 
    });
  }
} 