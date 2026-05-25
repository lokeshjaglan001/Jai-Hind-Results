// components/admin/EnrollmentTrendChart.tsx
import { Card, CardHeader, CardBody } from "@heroui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// This is the data format we'll expect from the API
interface TrendData {
  date: string;
  Courses: number;
  "Test Series": number;
}

interface EnrollmentTrendChartProps {
  data: TrendData[];
}

export const EnrollmentTrendChart: React.FC<EnrollmentTrendChartProps> = ({ data }) => {
  return (
    <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <CardHeader>
        <h3 className="text-lg font-semibold">Enrollment Trends (Last 30 Days)</h3>
      </CardHeader>
      <CardBody>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: "#ffffff", 
                  borderRadius: "8px", 
                  borderColor: "#e2e8f0" 
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="Courses"
                stroke="#3b82f6"
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="Test Series"
                stroke="#16a34a"
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
};