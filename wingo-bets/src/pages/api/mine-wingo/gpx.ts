import type { NextApiRequest, NextApiResponse } from 'next';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import formidable from 'formidable';
import { promisify } from 'util';

type ResponseData = {
  wingoAmount: number;
  error?: string;
};

export const config = {
  api: {
    bodyParser: false,
  },
};

const writeFile = promisify(fs.writeFile);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ wingoAmount: 0, error: 'Method not allowed' });
  }

  try {
    const form = formidable();
    const [fields, files] = await form.parse(req);
    const file = files.gpxFile?.[0];

    if (!file) {
      return res.status(400).json({ wingoAmount: 0, error: 'No GPX file uploaded' });
    }

    // Save the uploaded file temporarily
    const tempPath = path.join(process.cwd(), 'temp.gpx');
    await writeFile(tempPath, fs.readFileSync(file.filepath));

    const pythonProcess = spawn('python', [
      path.join(process.cwd(), 'strava_premium_wingo.py'),
      '--gpx', tempPath
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

    // Clean up the temporary file
    fs.unlinkSync(tempPath);

    // Parse the output to get the WINGO efforts
    const efforts = JSON.parse(output);
    const wingoAmount = efforts.length;

    res.status(200).json({ wingoAmount });
  } catch (error) {
    console.error('Error mining WINGO:', error);
    res.status(500).json({ 
      wingoAmount: 0, 
      error: error instanceof Error ? error.message : 'Failed to mine WINGO' 
    });
  }
} 