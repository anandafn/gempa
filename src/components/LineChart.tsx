import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { useStore } from '../hooks';
import { getEarthquakes } from '../api/earthquakes';

export default function LineChartVisualization() {
  const startTime = useStore((state) => state.startTime);
  const endTime = useStore((state) => state.endTime);
  const [timeData, setTimeData] = useState([]);

  const { data: earthquakes } = useQuery(
    ['earthquakes', startTime, endTime],
    () => getEarthquakes(startTime, endTime),
    {
      onSuccess: (data) => {
        // Extract magnitudes and set the state
        const times = data.features
          .map((earthquake: any) => earthquake.properties.time)
          .sort((a: number, b: number) => a - b);
        setTimeData(times);
      }
    }
  );

  useEffect(() => {}, [earthquakes]);

  const dateOccurrences = timeData.reduce((acc: any, timestamp) => {
    const date = new Date(timestamp);

    // Format the date as "YYYY-MM-DD"
    const formattedDate = date.toISOString().split('T')[0];

    // Increment the count for the formatted date
    acc[formattedDate] = (acc[formattedDate] || 0) + 1;

    return acc;
  }, {});

  const data = Object.keys(dateOccurrences).map((date) => ({
    date,
    'Earthquake Occurence': dateOccurrences[date]
  }));

  return (
    <div className="chart-content">
      <p>Earthquake Occurence based on Preference Date</p>
      <LineChart
        width={400}
        height={200}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="Earthquake Occurence"
          stroke="#FAAE4A"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </div>
  );
}
