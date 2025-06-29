import React from 'react';

const ActivityFeed: React.FC = () => {
  const feedData = [
    {
      location: 'Seattle, WA',
      date: 'January 2022',
      details: {
        "sender_name": "NWS Philadelphia - Mount Holly (New Jersey, Delaware, Southeastern Pennsylvania)",
        "event": "Small Craft Advisory",
        "start": 1684952747,
        "end": 1684988747,
        "description": "...SMALL CRAFT ADVISORY REMAINS IN EFFECT FROM 5 PM THIS\nAFTERNOON TO 3 AM EST FRIDAY...\n* WHAT...North winds 15 to 20 kt with gusts up to 25 kt and seas\n3 to 5 ft expected.\n* WHERE...Coastal waters from Little Egg Inlet to Great Egg\nInlet NJ out 20 nm, Coastal waters from Great Egg Inlet to\nCape May NJ out 20 nm and Coastal waters from Manasquan Inlet\nto Little Egg Inlet NJ out 20 nm.\n* WHEN...From 5 PM this afternoon to 3 AM EST Friday.\n* IMPACTS...Conditions will be hazardous to small craft.",
        "tags": []
      }
    },
    {
      location: 'Alpharetta, GA',
      date: 'January 2022',
      
    }
  ];

  return (
  <>
    <time className="text-3xl mt-10 text-gray-900 dark:text-white text-center block">
      Alerts
    </time>

    {feedData.map((alert, index) => (
      <ol
        key={index}
        className="relative mx-6 mt-10 border-s border-gray-200 dark:border-gray-700"
      >
        <li className="mb-10 ms-6">
          <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 dark:bg-blue-900">
            <svg className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
            </svg>
        </span>
        <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">{alert.location}</h3>
        <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">{alert.date}</time>
        <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
            {alert.details ? (
              <>
              <div className="mt-4 text-gray-700 dark:text-gray-300">
                <p className="font-medium">⚠️ {alert.details.event}</p>
                </div>
                <a href="#" className="inline-flex items-center mt-2 px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700">Learn more <svg className="w-3 h-3 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                </svg></a>
                </>
                ) : (
                <p className="text-sm italic text-gray-400 mt-2">No active alerts</p>
                )}
          </p>
    </li>
      </ol>
    ))}
  </>
);



};

export default ActivityFeed;
