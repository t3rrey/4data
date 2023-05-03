const upload = [
  {
    name: "Australian Super",
    date: "17-Mar-2020",
    sector: "Healthcare",
    status: "Pending",
  },
  {
    name: "Hostplus",
    date: "05-Jun-2019",
    sector: "Financials",
    status: "Approved",
  },
  {
    name: "REST",
    date: "22-Sep-2021",
    sector: "Information Technology",
    status: "Pending",
  },
  {
    name: "Sunsuper",
    date: "12-Dec-2018",
    sector: "Materials",
    status: "Approved",
  },
  {
    name: "Cbus",
    date: "28-Jan-2022",
    sector: "Consumer Discretionary",
    status: "Pending",
  },
  {
    name: "UniSuper",
    date: "19-Oct-2017",
    sector: "Utilities",
    status: "Approved",
  },
  {
    name: "First State Super",
    date: "14-Apr-2022",
    sector: "Real Estate",
    status: "Pending",
  },
  {
    name: "QSuper",
    date: "30-Nov-2020",
    sector: "Industrials",
    status: "Approved",
  },
  {
    name: "Hesta",
    date: "07-Aug-2019",
    sector: "Consumer Staples",
    status: "Pending",
  },
  {
    name: "LUCRF Super",
    date: "08-Feb-2021",
    sector: "Energy",
    status: "Approved",
  },
  {
    name: "EquipSuper",
    date: "23-May-2018",
    sector: "Materials",
    status: "Pending",
  },
  {
    name: "CareSuper",
    date: "11-Jul-2019",
    sector: "Healthcare",
    status: "Approved",
  },
  {
    name: "NGS Super",
    date: "04-Sep-2020",
    sector: "Financials",
    status: "Pending",
  },
  {
    name: "Australian Catholic Super",
    date: "16-Jun-2021",
    sector: "Information Technology",
    status: "Approved",
  },
  {
    name: "Mine Wealth + Wellbeing",
    date: "27-Dec-2017",
    sector: "Consumer Discretionary",
    status: "Pending",
  },
];

export default function RecentUploads() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Recent Uploads
          </h1>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Sector
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {upload.map((u, idx) => (
                    <tr key={idx}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {u.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {u.date}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {u.sector}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {u.status}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <a
                          href="#"
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit<span className="sr-only">, {u.name}</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
