import { Request, Response } from 'express';
import { getData } from '../utils/database';

export const getMapData = async (req: Request, res: Response) => {
  try {
    const sql = `SELECT c.id, c.category, c.meta, g.latitude, g.longitude 
                 FROM calls c 
                 LEFT JOIN geocodes g ON g.id = c.geoid 
                 WHERE c.expired IS NULL OR c.expired >= (NOW() - INTERVAL 1 HOUR)`;
    const calls = await getData(sql);
    
    const mapCalls = calls.map(call => ({
      id: call.id,
      lat: parseFloat(call.latitude),
      lng: parseFloat(call.longitude),
      tooltip: JSON.parse(call.meta).description,
      category: call.category
    }));

    res.json({ calls: mapCalls });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCallList = async (req: Request, res: Response) => {
  try {
    const sql = `SELECT c.id, s.tag as source, c.category, c.meta, c.added, c.expired 
                 FROM calls c 
                 LEFT JOIN sources s ON s.id = c.source 
                 ORDER BY c.added DESC 
                 LIMIT 100`;
    const calls = await getData(sql);
    
    const callList = calls.map(call => ({
      id: call.id,
      source: call.source,
      description: JSON.parse(call.meta).description,
      location: JSON.parse(call.meta).location,
      callTime: call.added,
      closed: call.expired
    }));

    res.json({ calls: callList });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCallDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sql = `SELECT c.id, s.tag as source, c.category, c.meta, c.added, c.expired, g.latitude, g.longitude 
                 FROM calls c 
                 LEFT JOIN sources s ON s.id = c.source 
                 LEFT JOIN geocodes g ON g.id = c.geoid 
                 WHERE c.id = ?`;
    const [call] = await getData(sql, [id]);
    
    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }

    const callDetails = {
      id: call.id,
      source: call.source,
      category: call.category,
      description: JSON.parse(call.meta).description,
      location: JSON.parse(call.meta).location,
      callTime: call.added,
      closed: call.expired,
      lat: parseFloat(call.latitude),
      lng: parseFloat(call.longitude)
    };

    res.json(callDetails);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};