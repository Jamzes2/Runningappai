import { XMLParser } from 'fast-xml-parser';

export interface TcxTrackpoint {
  time: string;
  lat?: number;
  lng?: number;
  altitude?: number;
  distance?: number;
  heartRate?: number;
  cadence?: number;
  power?: number;
}

export interface TcxActivity {
  id: string;
  startTime: string;
  totalTimeSeconds: number;
  totalDistanceMeters: number;
  avgHeartRate?: number;
  maxHeartRate?: number;
  avgCadence?: number;
  avgPower?: number;
  elevationGained?: number;
  trackpoints: TcxTrackpoint[];
  telemetry?: any[];
}

function findValue(obj: any, keyName: string): any {
  if (!obj || typeof obj !== 'object') return undefined;
  if (obj[keyName] !== undefined) return obj[keyName];
  
  // Handle namespaced keys like ns3:RunCadence
  for (const k in obj) {
    if (k.endsWith(`:${keyName}`)) return obj[k];
  }
  
  // Recursively search in Extensions
  if (obj.Extensions) {
    const val = findValue(obj.Extensions, keyName);
    if (val !== undefined) return val;
  }
  
  // Recursively search in TPX or other common sub-objects
  for (const k in obj) {
    if (typeof obj[k] === 'object') {
      const val = findValue(obj[k], keyName);
      if (val !== undefined) return val;
    }
  }
  
  return undefined;
}

export function parseTcx(xmlData: string): TcxActivity {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    removeNSPrefix: false, 
  });
  const jsonObj = parser.parse(xmlData);

  const activity = jsonObj?.TrainingCenterDatabase?.Activities?.Activity;
  if (!activity) {
    throw new Error('Invalid TCX file: No activity found');
  }

  const laps = Array.isArray(activity.Lap) ? activity.Lap : [activity.Lap];
  
  let heartRateSum = 0;
  let heartRateCount = 0;
  let maxHeartRate = 0;
  let cadenceSum = 0;
  let cadenceCount = 0;
  let powerSum = 0;
  let powerCount = 0;
  let elevationGained = 0;
  let lastAltitude: number | null = null;
  
  const rawTrackpoints: any[] = [];

  laps.forEach((lap: any) => {
    const tracks = Array.isArray(lap.Track) ? lap.Track : [lap.Track];
    tracks.forEach((track: any) => {
      if (!track) return;
      const tps = Array.isArray(track.Trackpoint) ? track.Trackpoint : [track.Trackpoint];
      tps.forEach((tp: any) => {
        if (!tp) return;
        
        const hrVal = findValue(tp, 'HeartRateBpm')?.Value;
        const cadVal = findValue(tp, 'Cadence') || findValue(tp, 'RunCadence');
        const powVal = findValue(tp, 'Watts');
        const altVal = tp.AltitudeMeters;
        const distVal = tp.DistanceMeters;
        const timeVal = tp.Time;

        const tpData = {
          time: timeVal,
          distance: distVal !== undefined ? parseFloat(distVal) : undefined,
          heartRate: hrVal ? parseInt(hrVal) : undefined,
          cadence: cadVal ? parseInt(cadVal) : undefined,
          power: powVal ? parseInt(powVal) : undefined,
          altitude: altVal ? parseFloat(altVal) : undefined,
          lat: tp.Position?.LatitudeDegrees ? parseFloat(tp.Position.LatitudeDegrees) : undefined,
          lng: tp.Position?.LongitudeDegrees ? parseFloat(tp.Position.LongitudeDegrees) : undefined,
        };
        
        if (tpData.cadence && tpData.cadence < 120) tpData.cadence *= 2;
        
        rawTrackpoints.push(tpData);

        if (tpData.heartRate) {
          maxHeartRate = Math.max(maxHeartRate, tpData.heartRate);
          heartRateSum += tpData.heartRate;
          heartRateCount++;
        }
        if (tpData.cadence) {
          cadenceSum += tpData.cadence;
          cadenceCount++;
        }
        if (tpData.power) {
          powerSum += tpData.power;
          powerCount++;
        }
        if (tpData.altitude !== undefined) {
          if (lastAltitude !== null) {
            const diff = tpData.altitude - lastAltitude;
            if (diff > 0) elevationGained += diff;
          }
          lastAltitude = tpData.altitude;
        }
      });
    });
  });

  // Calculate overall stats
  const firstTp = rawTrackpoints[0];
  const lastTp = rawTrackpoints[rawTrackpoints.length - 1];
  let totalDistance = 0;
  let totalTime = 0;
  if (firstTp && lastTp) {
    totalDistance = (lastTp.distance || 0) - (firstTp.distance || 0);
    totalTime = (new Date(lastTp.time).getTime() - new Date(firstTp.time).getTime()) / 1000;
  }

  // Generate continuous telemetry (downsampled for performance)
  const telemetry: any[] = [];
  const samplingRate = Math.max(1, Math.floor(rawTrackpoints.length / 500));

  for (let i = 0; i < rawTrackpoints.length; i += samplingRate) {
    const tp = rawTrackpoints[i];
    if (tp.distance === undefined) continue;

    // Calculate instantaneous pace (look back 10 points for smoothing)
    let pace = null;
    const lookback = 10;
    if (i >= lookback) {
      const prevTp = rawTrackpoints[i - lookback];
      const dDist = (tp.distance - (prevTp.distance || 0)) / 1000; // km
      const dTime = (new Date(tp.time).getTime() - new Date(prevTp.time).getTime()) / 1000 / 60; // mins
      if (dDist > 0.001) { // Only calculate if significant distance covered
        pace = dTime / dDist; // min/km
        if (pace > 20) pace = 20; // Cap pace at 20:00/km for outliers
      }
    }

    telemetry.push({
      d: parseFloat((tp.distance / 1000).toFixed(3)), // distance in km
      p: pace ? parseFloat(pace.toFixed(2)) : null, // pace
      h: tp.heartRate || null,
      c: tp.cadence || null,
      w: tp.power || null,
      a: tp.altitude || null
    });
  }

  return {
    id: activity.Id || new Date().toISOString(),
    startTime: firstTp?.time || new Date().toISOString(),
    totalTimeSeconds: Math.round(totalTime),
    totalDistanceMeters: totalDistance,
    avgHeartRate: heartRateCount > 0 ? Math.round(heartRateSum / heartRateCount) : undefined,
    maxHeartRate: maxHeartRate > 0 ? Math.round(maxHeartRate) : undefined,
    avgCadence: cadenceCount > 0 ? Math.round(cadenceSum / cadenceCount) : undefined,
    avgPower: powerCount > 0 ? Math.round(powerSum / powerCount) : undefined,
    elevationGained: Math.round(elevationGained),
    trackpoints: rawTrackpoints,
    telemetry: telemetry
  };
}

export function generateRouteSvg(trackpoints: any[]): string | null {
  const coords = trackpoints.filter(tp => tp.lat !== undefined && tp.lng !== undefined);
  if (coords.length < 2) return null;

  const lats = coords.map(c => c.lat!);
  const lngs = coords.map(c => c.lng!);
  
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  
  const latRange = maxLat - minLat || 1;
  const lngRange = maxLng - minLng || 1;
  
  // Normalize to 100x100 box
  const points = coords.map(c => {
    const x = ((c.lng! - minLng) / lngRange) * 100;
    const y = 100 - (((c.lat! - minLat) / latRange) * 100);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });
  
  return `M ${points.join(' L ')}`;
}

export function calculateSplits(trackpoints: any[]) {
  if (trackpoints.length === 0) return [];

  const splits: any[] = [];
  let currentSplitDistance = 0;
  let currentSplitTime = 0;
  let currentSplitHeartRateSum = 0;
  let currentSplitHeartRateCount = 0;
  let currentSplitCadenceSum = 0;
  let currentSplitCadenceCount = 0;
  let currentSplitElevationGain = 0;
  let lastTime = new Date(trackpoints[0].time).getTime();
  let lastDistance = trackpoints[0].distance || 0;
  let lastAltitude = trackpoints[0].altitude || null;
  let splitNumber = 1;

  for (let i = 1; i < trackpoints.length; i++) {
    const tp = trackpoints[i];
    const currentTime = new Date(tp.time).getTime();
    const currentDistance = tp.distance || lastDistance;
    
    const timeDiff = (currentTime - lastTime) / 1000;
    const distDiff = currentDistance - lastDistance;
    
    currentSplitDistance += distDiff;
    currentSplitTime += timeDiff;
    
    if (tp.heartRate) {
      currentSplitHeartRateSum += tp.heartRate;
      currentSplitHeartRateCount++;
    }
    
    if (tp.cadence) {
      currentSplitCadenceSum += tp.cadence;
      currentSplitCadenceCount++;
    }

    if (tp.altitude !== undefined && lastAltitude !== null) {
      const altDiff = tp.altitude - lastAltitude;
      if (altDiff > 0) currentSplitElevationGain += altDiff;
    }

    if (currentSplitDistance >= 1000) { // Every 1km
      const paceSeconds = (currentSplitTime / (currentSplitDistance / 1000));
      const mins = Math.floor(paceSeconds / 60);
      const secs = Math.round(paceSeconds % 60);
      
      splits.push({
        split: splitNumber++,
        pace: `${mins}:${secs.toString().padStart(2, '0')}`,
        avg_hr: currentSplitHeartRateCount > 0 ? Math.round(currentSplitHeartRateSum / currentSplitHeartRateCount) : null,
        avg_cadence: currentSplitCadenceCount > 0 ? Math.round(currentSplitCadenceSum / currentSplitCadenceCount) : null,
        elevation_difference: Math.round(currentSplitElevationGain),
      });
      
      currentSplitDistance = 0;
      currentSplitTime = 0;
      currentSplitHeartRateSum = 0;
      currentSplitHeartRateCount = 0;
      currentSplitCadenceSum = 0;
      currentSplitCadenceCount = 0;
      currentSplitElevationGain = 0;
    }
    
    lastTime = currentTime;
    lastDistance = currentDistance;
    lastAltitude = tp.altitude !== undefined ? tp.altitude : lastAltitude;
  }
  
  // Add partial last split if significant
  if (currentSplitDistance > 100) {
    const paceSeconds = (currentSplitTime / (currentSplitDistance / 1000));
    const mins = Math.floor(paceSeconds / 60);
    const secs = Math.round(paceSeconds % 60);
    splits.push({
      split: splitNumber,
      pace: `${mins}:${secs.toString().padStart(2, '0')}`,
      avg_hr: currentSplitHeartRateCount > 0 ? Math.round(currentSplitHeartRateSum / currentSplitHeartRateCount) : null,
      avg_cadence: currentSplitCadenceCount > 0 ? Math.round(currentSplitCadenceSum / currentSplitCadenceCount) : null,
      elevation_difference: Math.round(currentSplitElevationGain),
    });
  }

  return splits;
}
