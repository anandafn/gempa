import BarChartVisualization from './BarChart';
import DonutChartVisualization from './DonutChart';
import LineChartVisualization from './LineChart';

export default function AllChartVisualization() {
  return (
    <div className="chart-container">
      <BarChartVisualization />
      <DonutChartVisualization />
      <LineChartVisualization />
    </div>
  );
}
