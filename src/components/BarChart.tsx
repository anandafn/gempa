import React, { useState, useEffect } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { useStore } from '../hooks';
import { getEarthquakes } from '../api/earthquakes';

export default function BarChartVisualization() {
  const startTime = useStore((state) => state.startTime);
  const endTime = useStore((state) => state.endTime);
  const [magnitudeData, setMagnitudeData] = useState([]);

  const { data: earthquakes } = useQuery(
    ['earthquakes', startTime, endTime],
    () => getEarthquakes(startTime, endTime),
    {
      onSuccess: (data) => {
        // Extract magnitudes and set the state
        const magnitudes = data.features.map(
          (earthquake: any) => earthquake.properties.mag
        );
        setMagnitudeData(magnitudes);
      }
    }
  );

  useEffect(() => {}, [earthquakes]);

  const colors = [
    '#47CA4A',
    '#C7FB4A',
    '#F3FC4A',
    '#FADA4A',
    '#FAAE4A',
    '#FA494A'
  ];

  const calcMagnitudeByTime = (dataM: any, floor: number, ceil: number) => {
    return dataM.filter(
      (magnitude: number) => magnitude >= floor && magnitude < ceil
    ).length;
  };

  const data = [
    {
      name: '0 - 1',
      magnitude: calcMagnitudeByTime(magnitudeData, 0, 1)
    },
    {
      name: '1 - 2',
      magnitude: calcMagnitudeByTime(magnitudeData, 1, 2)
    },
    {
      name: '2 - 3',
      magnitude: calcMagnitudeByTime(magnitudeData, 2, 3)
    },
    {
      name: '3 - 5',
      magnitude: calcMagnitudeByTime(magnitudeData, 3, 5)
    },
    {
      name: '5 - 7',
      magnitude: calcMagnitudeByTime(magnitudeData, 5, 7)
    },
    {
      name: '7+',
      magnitude: calcMagnitudeByTime(magnitudeData, 7, 99)
    }
  ];

  return (
    <div className="chart-content">
      <p className="title">Magnitude Calculation by Each Group</p>
      <BarChart
        width={400}
        height={200}
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5
        }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Bar dataKey="magnitude" label={{ position: 'top' }}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index]} /> // eslint-disable-line
          ))}
        </Bar>
      </BarChart>
    </div>
  );
}
