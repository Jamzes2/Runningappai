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
  temperature?: number;
  verticalOscillation?: number;
  groundContactTime?: number;
  groundContactBalance?: number;
  strideLength?: number;
  verticalRatio?: number;
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
  avgTemp?: number;
  elevationGained?: number;
  trackpoints: TcxTrackpoint[];
  telemetry?: any[];
  metadata?: any;
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

export async function parseFit(arrayBuffer: ArrayBuffer): Promise<TcxActivity> {
  // We use require here to avoid issues with different build environments for this binary parser
  let FitParser;
  try {
    const FitParserLib = require('fit-file-parser');
    FitParser = FitParserLib.default || FitParserLib;
  } catch (err) {
    throw new Error('FIT parser library not found. Please ensure fit-file-parser is installed.');
  }

  const fitParser = new FitParser({
    force: true,
    speedUnit: 'km/h',
    lengthUnit: 'm',
    temperatureUnit: 'celsius',
    elapsedRecordField: true,
    mode: 'cascade',
  });

  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    fitParser.parse(buffer, (error: any, data: any) => {
      if (error) {
        return reject(new Error(`FIT parsing failed: ${error}`));
      }

      if (!data) {
        return reject(new Error('Failed to parse FIT file: No data returned'));
      }

      // Extract records from various possible locations in the FIT structure
      let records: any[] = [];
      
      // 1. Direct records
      if (data.records && data.records.length > 0) {
        records = data.records;
      } 
      // 2. Cascaded in activity -> sessions -> laps -> records
      else if (data.activity && data.activity.sessions) {
        data.activity.sessions.forEach((session: any) => {
          if (session.laps) {
            session.laps.forEach((lap: any) => {
              if (lap.records) records = records.concat(lap.records);
            });
          }
        });
      }
      // 3. Cascaded in sessions -> laps -> records
      else if (data.sessions) {
        data.sessions.forEach((session: any) => {
          if (session.laps) {
            session.laps.forEach((lap: any) => {
              if (lap.records) records = records.concat(lap.records);
            });
          }
        });
      }
      // 4. Directly in laps -> records
      else if (data.laps) {
        data.laps.forEach((lap: any) => {
          if (lap.records) records = records.concat(lap.records);
        });
      }

      if (records.length === 0) {
        return reject(new Error('No activity telemetry records found. This FIT file may only contain settings, device info, or summary data without GPS/HR points.'));
      }

      const rawTrackpoints: any[] = [];
      let elevationGained = 0;
      let lastAltitude: number | null = null;
      let heartRateSum = 0;
      let heartRateCount = 0;
      let maxHeartRate = 0;
      let cadenceSum = 0;
      let cadenceCount = 0;
      let powerSum = 0;
      let powerCount = 0;
      let tempSum = 0;
      let tempCount = 0;

      records.forEach((record: any) => {
        const tpData: TcxTrackpoint = {
          time: record.timestamp?.toISOString() || new Date().toISOString(),
          distance: record.distance, // Now in meters by default
          heartRate: record.heart_rate || record.heartRate,
          cadence: record.cadence || record.run_cadence || record.runCadence,
          power: record.power,
          altitude: record.enhanced_altitude !== undefined ? record.enhanced_altitude : (record.enhancedAltitude !== undefined ? record.enhancedAltitude : (record.altitude !== undefined ? record.altitude : undefined)),
          lat: record.position_lat || record.positionLat,
          lng: record.position_long || record.positionLong,
          temperature: record.temperature,
          verticalOscillation: record.vertical_oscillation || record.verticalOscillation,
          groundContactTime: record.stance_time || record.stanceTime || record.ground_contact_time || record.groundContactTime,
          groundContactBalance: record.stance_time_balance || record.stanceTimeBalance || record.ground_contact_balance || record.groundContactBalance,
          strideLength: record.step_length || record.stepLength || record.stride_length || record.strideLength,
          verticalRatio: record.vertical_ratio || record.verticalRatio,
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
        if (tpData.temperature !== undefined) {
          tempSum += tpData.temperature;
          tempCount++;
        }
        if (tpData.altitude !== undefined) {
          if (lastAltitude !== null) {
            const diff = tpData.altitude - lastAltitude;
            if (diff > 0) elevationGained += diff;
          }
          lastAltitude = tpData.altitude;
        }
      });

      // Calculate overall stats
      const firstTp = rawTrackpoints[0];
      const lastTp = rawTrackpoints[rawTrackpoints.length - 1];
      let totalDistance = (lastTp?.distance || 0) - (firstTp?.distance || 0);
      let totalTime = (new Date(lastTp.time).getTime() - new Date(firstTp.time).getTime()) / 1000;

      // Generate continuous telemetry
      const telemetry: any[] = [];
      const samplingRate = Math.max(1, Math.floor(rawTrackpoints.length / 500));

      for (let i = 0; i < rawTrackpoints.length; i += samplingRate) {
        const tp = rawTrackpoints[i];
        let pace = null;
        const lookback = 10;
        if (i >= lookback) {
          const prevTp = rawTrackpoints[i - lookback];
          const dDist = ((tp.distance || 0) - (prevTp.distance || 0)) / 1000; // km
          const dTime = (new Date(tp.time).getTime() - new Date(prevTp.time).getTime()) / 1000 / 60; // mins
          if (dDist > 0.001) {
            pace = dTime / dDist;
            if (pace > 20) pace = 20;
          }
        }

        telemetry.push({
          d: parseFloat(((tp.distance || 0) / 1000).toFixed(3)),
          p: pace ? parseFloat(pace.toFixed(2)) : null,
          h: tp.heartRate || null,
          c: tp.cadence || null,
          w: tp.power || null,
          a: tp.altitude || null,
          t: tp.temperature || null,
          vo: tp.verticalOscillation !== undefined ? tp.verticalOscillation : null,
          gct: tp.groundContactTime !== undefined ? tp.groundContactTime : null,
          gctb: tp.groundContactBalance !== undefined ? tp.groundContactBalance : null,
          sl: tp.strideLength !== undefined ? tp.strideLength : null,
          vr: tp.verticalRatio !== undefined ? tp.verticalRatio : null
        });
      }

      const session = (data.sessions && data.sessions[0]) || (data.activity?.sessions && data.activity.sessions[0]) || {};
      const sessionAscent = session.total_ascent || session.totalAscent || session.enhanced_total_ascent || session.enhancedTotalAscent;

      resolve({
        id: session.event_group?.toString() || new Date().toISOString(),
        startTime: firstTp?.time || new Date().toISOString(),
        totalTimeSeconds: Math.round(totalTime),
        totalDistanceMeters: totalDistance,
        avgHeartRate: heartRateCount > 0 ? Math.round(heartRateSum / heartRateCount) : undefined,
        maxHeartRate: maxHeartRate > 0 ? Math.round(maxHeartRate) : undefined,
        avgCadence: cadenceCount > 0 ? Math.round(cadenceSum / cadenceCount) : undefined,
        avgPower: powerCount > 0 ? Math.round(powerSum / powerCount) : undefined,
        avgTemp: tempCount > 0 ? Math.round(tempSum / tempCount) : undefined,
        elevationGained: (sessionAscent && sessionAscent > 0) ? Math.round(sessionAscent) : Math.round(elevationGained),
        trackpoints: rawTrackpoints,
        telemetry: telemetry,
        metadata: {
          calories: session.total_calories || session.totalCalories,
          aerobicTrainingEffect: session.total_training_effect || session.totalTrainingEffect || session.aerobic_training_effect || session.aerobicTrainingEffect,
          anaerobicTrainingEffect: session.total_anaerobic_training_effect || session.totalAnaerobicTrainingEffect || session.anaerobic_training_effect || session.anaerobicTrainingEffect,
          recoveryTime: session.recovery_time || session.recoveryTime,
          normalizedPower: session.normalized_power || session.normalizedPower,
          trainingStressScore: session.training_stress_score || session.trainingStressScore,
          intensityFactor: session.intensity_factor || session.intensityFactor,
          avgTemperature: session.avg_temperature || session.avgTemperature,
          maxTemperature: session.max_temperature || session.maxTemperature,
          vo2Max: session.vo2_max || session.vo2Max,
          // Advanced Running Dynamics
          avgStrideLength: session.avg_stride_length || session.avgStrideLength,
          avgVerticalOscillation: session.avg_vertical_oscillation || session.avgVerticalOscillation,
          avgGroundContactTime: session.avg_stance_time || session.avgStanceTime || session.avg_ground_contact_time || session.avgGroundContactTime,
          avgGroundContactBalance: session.avg_stance_time_balance || session.avgStanceTimeBalance || session.avg_ground_contact_balance || session.avgGroundContactBalance,
          avgVerticalRatio: session.avg_vertical_ratio || session.avgVerticalRatio,
          avgStepLength: session.avg_step_length || session.avgStepLength,
          totalAscent: session.total_ascent || session.totalAscent || session.enhanced_total_ascent || session.enhancedTotalAscent,
          totalDescent: session.total_descent || session.totalDescent || session.enhanced_total_descent || session.enhancedTotalDescent,
          totalWork: session.total_work || session.totalWork,
        }
      });
    });
  });
}

export function parseGpx(xmlData: string): TcxActivity {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    removeNSPrefix: false,
  });
  const jsonObj = parser.parse(xmlData);

  const gpx = jsonObj?.gpx;
  if (!gpx) {
    throw new Error('Invalid GPX file: No gpx root found');
  }

  const track = Array.isArray(gpx.trk) ? gpx.trk[0] : gpx.trk;
  const segments = Array.isArray(track?.trkseg) ? track.trkseg : [track?.trkseg];
  
  let heartRateSum = 0;
  let heartRateCount = 0;
  let maxHeartRate = 0;
  let cadenceSum = 0;
  let cadenceCount = 0;
  let powerSum = 0;
  let powerCount = 0;
  let tempSum = 0;
  let tempCount = 0;
  let elevationGained = 0;
  let lastAltitude: number | null = null;
  
  const rawTrackpoints: any[] = [];
  let totalDistance = 0;
  let lastLat: number | null = null;
  let lastLng: number | null = null;

  // Haversine formula for distance between GPS points
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  segments.forEach((seg: any) => {
    if (!seg) return;
    const tps = Array.isArray(seg.trkpt) ? seg.trkpt : [seg.trkpt];
    tps.forEach((tp: any) => {
      if (!tp) return;
      
      const lat = parseFloat(tp["@_lat"]);
      const lng = parseFloat(tp["@_lon"]);
      const altVal = tp.ele ? parseFloat(tp.ele) : undefined;
      const timeVal = tp.time;

      if (lastLat !== null && lastLng !== null) {
        totalDistance += getDistance(lastLat, lastLng, lat, lng);
      }
      lastLat = lat;
      lastLng = lng;

      // Extensions for HR, Cadence, Power, Temp
      const hrVal = findValue(tp, 'hr') || findValue(tp, 'HeartRate');
      const cadVal = findValue(tp, 'cad') || findValue(tp, 'cadence') || findValue(tp, 'RunCadence');
      const powVal = findValue(tp, 'pwr') || findValue(tp, 'power') || findValue(tp, 'Watts');
      const tempVal = findValue(tp, 'atemp') || findValue(tp, 'temp') || findValue(tp, 'temperature');

      const tpData: TcxTrackpoint = {
        time: timeVal,
        distance: totalDistance,
        heartRate: hrVal ? parseInt(hrVal) : undefined,
        cadence: cadVal ? parseInt(cadVal) : undefined,
        power: powVal ? parseInt(powVal) : undefined,
        temperature: tempVal ? parseFloat(tempVal) : undefined,
        altitude: altVal,
        lat: lat,
        lng: lng,
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
      if (tpData.temperature !== undefined) {
        tempSum += tpData.temperature;
        tempCount++;
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

  const firstTp = rawTrackpoints[0];
  const lastTp = rawTrackpoints[rawTrackpoints.length - 1];
  let totalTime = 0;
  if (firstTp && lastTp) {
    totalTime = (new Date(lastTp.time).getTime() - new Date(firstTp.time).getTime()) / 1000;
  }

  // Generate continuous telemetry
  const telemetry: any[] = [];
  const samplingRate = Math.max(1, Math.floor(rawTrackpoints.length / 500));

  for (let i = 0; i < rawTrackpoints.length; i += samplingRate) {
    const tp = rawTrackpoints[i];
    let pace = null;
    const lookback = 10;
    if (i >= lookback) {
      const prevTp = rawTrackpoints[i - lookback];
      const dDist = (tp.distance - prevTp.distance) / 1000; // km
      const dTime = (new Date(tp.time).getTime() - new Date(prevTp.time).getTime()) / 1000 / 60; // mins
      if (dDist > 0.001) {
        pace = dTime / dDist;
        if (pace > 20) pace = 20;
      }
    }

    telemetry.push({
      d: parseFloat((tp.distance / 1000).toFixed(3)),
      p: pace ? parseFloat(pace.toFixed(2)) : null,
      h: tp.heartRate || null,
      c: tp.cadence || null,
      w: tp.power || null,
      a: tp.altitude || null,
      t: tp.temperature || null,
    });
  }

  return {
    id: new Date().toISOString(),
    startTime: firstTp?.time || new Date().toISOString(),
    totalTimeSeconds: Math.round(totalTime),
    totalDistanceMeters: totalDistance,
    avgHeartRate: heartRateCount > 0 ? Math.round(heartRateSum / heartRateCount) : undefined,
    maxHeartRate: maxHeartRate > 0 ? Math.round(maxHeartRate) : undefined,
    avgCadence: cadenceCount > 0 ? Math.round(cadenceSum / cadenceCount) : undefined,
    avgPower: powerCount > 0 ? Math.round(powerSum / powerCount) : undefined,
    avgTemp: tempCount > 0 ? Math.round(tempSum / tempCount) : undefined,
    elevationGained: Math.round(elevationGained),
    trackpoints: rawTrackpoints,
    telemetry: telemetry
  };
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
  let tempSum = 0;
  let tempCount = 0;
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
        const tempVal = findValue(tp, 'atemp') || findValue(tp, 'temperature');
        const altVal = tp.AltitudeMeters;
        const distVal = tp.DistanceMeters;
        const timeVal = tp.Time;

        const tpData: TcxTrackpoint = {
          time: timeVal,
          distance: distVal !== undefined ? parseFloat(distVal) : undefined,
          heartRate: hrVal ? parseInt(hrVal) : undefined,
          cadence: cadVal ? parseInt(cadVal) : undefined,
          power: powVal ? parseInt(powVal) : undefined,
          temperature: tempVal ? parseFloat(tempVal) : undefined,
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
        if (tpData.temperature !== undefined) {
          tempSum += tpData.temperature;
          tempCount++;
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
      a: tp.altitude || null,
      t: tp.temperature || null,
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
    avgTemp: tempCount > 0 ? Math.round(tempSum / tempCount) : undefined,
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
  let currentSplitAscent = 0;
  let currentSplitDescent = 0;
  let lastTime = new Date(trackpoints[0].time).getTime();
  let lastDistance = trackpoints[0].distance || 0;
  let lastAltitude = (trackpoints[0].altitude !== undefined && trackpoints[0].altitude !== null) ? trackpoints[0].altitude : null;
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

    if (tp.altitude !== undefined && tp.altitude !== null) {
      if (lastAltitude === null) {
        lastAltitude = tp.altitude;
      } else {
        const altDiff = tp.altitude - lastAltitude;
        // Only count changes greater than 0.5m to filter noise
        if (Math.abs(altDiff) >= 0.5) {
          if (altDiff > 0) currentSplitAscent += altDiff;
          else if (altDiff < 0) currentSplitDescent += Math.abs(altDiff);
          lastAltitude = tp.altitude;
        }
      }
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
        ascent: Math.round(currentSplitAscent),
        descent: Math.round(currentSplitDescent),
      });
      
      currentSplitDistance = 0;
      currentSplitTime = 0;
      currentSplitHeartRateSum = 0;
      currentSplitHeartRateCount = 0;
      currentSplitCadenceSum = 0;
      currentSplitCadenceCount = 0;
      currentSplitAscent = 0;
      currentSplitDescent = 0;
    }
    
    lastTime = currentTime;
    lastDistance = currentDistance;
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
      ascent: Math.round(currentSplitAscent),
      descent: Math.round(currentSplitDescent),
    });
  }

  return splits;
}
