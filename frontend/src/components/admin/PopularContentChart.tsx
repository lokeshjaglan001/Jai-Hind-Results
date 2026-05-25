import { Card, CardHeader, CardBody } from "@heroui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface PopularData {
  name: string; 
  enrollments: number;
}

interface PopularContentChartProps {
  data: PopularData[];
  title: string;
}

export const PopularContentChart: React.FC<PopularContentChartProps> = ({ data, title }) => {

const formatYAxis = (tickItem: any) => {
  if (typeof tickItem === 'string' && tickItem.length > 12) {
    return `${tickItem.substring(0, 12)}...`;
  }
  return tickItem;
};

  return (
    <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <CardHeader>
        <h3 className="text-lg font-semibold">{title}</h3>
      </CardHeader>
      <CardBody>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" horizontal={false} />
              <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                type="category"
                dataKey="name"
                width={100}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatYAxis}
              />
              <Tooltip
                cursor={{ fill: "#f3f4f6" }}
                contentStyle={{ 
                  backgroundColor: "#ffffff", 
                  borderRadius: "8px", 
                  borderColor: "#e2e8f0" 
                }}
              />
              <Bar dataKey="enrollments" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
};