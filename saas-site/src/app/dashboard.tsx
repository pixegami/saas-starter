import * as React from "react";

interface DashboardProps {
  path: string;
}

const Dashboard: React.FC<DashboardProps> = (props) => {
  return (
    <div>
      <div className="p-4 border border-gray-200 rounded-md bg-white text-gray-700">
        <h1 className="text-2xl md:text-4xl font-bold mb-2">Dashboard</h1>
        <p>This is the dashboard page. You must be logged in to see it.</p>
      </div>
    </div>
  );
};

export default Dashboard;
