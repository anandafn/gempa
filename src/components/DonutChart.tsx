import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { useStore } from '../hooks';
import { getEarthquakes } from '../api/earthquakes';

export default function DonutChartVisualization() {
  const startTime = useStore((state) => state.startTime);
  const endTime = useStore((state) => state.endTime);
  const [sigData, setSigData] = useState([]);

  const { data: earthquakes } = useQuery(
    ['earthquakes', startTime, endTime],
    () => getEarthquakes(startTime, endTime),
    {
      onSuccess: (data) => {
        // Extract magnitudes and set the state
        const sigs = data.features.map(
          (earthquake: any) => earthquake.properties.sig
        );
        setSigData(sigs);
      }
    }
  );

  useEffect(() => {}, [earthquakes]);

  const calcSigByTime = (dataM: any, floor: number, ceil: number) => {
    return dataM.filter((sig: number) => sig >= floor && sig <= ceil).length;
  };

  const data = [
    {
      name: 'Significant number: 0 - 100',
      value: calcSigByTime(sigData, 0, 100)
    },
    {
      name: 'Significant number: 101 - 200',
      value: calcSigByTime(sigData, 101, 200)
    },
    {
      name: 'Significant number: 201 - 300',
      value: calcSigByTime(sigData, 201, 300)
    },
    {
      name: 'Significant number: 301 - 400',
      value: calcSigByTime(sigData, 301, 400)
    },
    {
      name: 'Significant number: 401 - 500',
      value: calcSigByTime(sigData, 401, 500)
    },
    {
      name: 'Significant number: 501 - 600',
      value: calcSigByTime(sigData, 501, 600)
    },
    {
      name: 'Significant number: 601 - 700',
      value: calcSigByTime(sigData, 601, 700)
    },
    {
      name: 'Significant number: 701 - 800',
      value: calcSigByTime(sigData, 701, 800)
    },
    {
      name: 'Significant number: 801 - 900',
      value: calcSigByTime(sigData, 801, 900)
    },
    {
      name: 'Significant number: 901 - 1000',
      value: calcSigByTime(sigData, 901, 1000)
    }
  ];

  return (
    <div className="chart-content">
      <p>Significant Level of the Earthquake</p>
      <PieChart width={400} height={200}>
        <Pie
          dataKey="value"
          data={data}
          cx={200}
          cy={100}
          innerRadius={30}
          outerRadius={60}
          fill="#FAAE4A"
          label>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} /> // eslint-disable-line
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
}
