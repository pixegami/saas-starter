import * as React from "react";

interface DashboardProps {
  path: string;
}

const Dashboard: React.FC<DashboardProps> = (props) => {
  return (
    <div>
      <h1>This is the dashboard page. You need to be logged in to see it.</h1>
    </div>
  );
};

export default Dashboard;
