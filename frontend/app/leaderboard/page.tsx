'use client';

export default function Leaderboard() {
  const topReferrers = [
    { address: '0x123...abc', volume: '10000', commission: '200' },
    { address: '0x456...def', volume: '8000', commission: '160' },
    // Add more
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-4">Leaderboard</h1>
      <h2>Top Referrers</h2>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th>Address</th>
            <th>Volume</th>
            <th>Commission</th>
          </tr>
        </thead>
        <tbody>
          {topReferrers.map((r, i) => (
            <tr key={i}>
              <td>{r.address}</td>
              <td>{r.volume}</td>
              <td>{r.commission}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}