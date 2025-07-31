import React from 'react';

const OccupancyChart = () => {
  const data = [
    { day: 'Mon', occupancy: 65 },
    { day: 'Tue', occupancy: 72 },
    { day: 'Wed', occupancy: 78 },
    { day: 'Thu', occupancy: 85 },
    { day: 'Fri', occupancy: 92 },
    { day: 'Sat', occupancy: 88 },
    { day: 'Sun', occupancy: 75 }
  ];

  return (
    <div className="h-64">
      <div className="flex items-end justify-between h-full space-x-2">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className="w-full flex items-end justify-center h-40">
              <div
                className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t"
                style={{ height: `${item.occupancy}%` }}
              />
            </div>
            <div className="mt-2 text-xs text-gray-600">{item.day}</div>
            <div className="text-xs font-medium text-gray-900">{item.occupancy}%</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OccupancyChart;