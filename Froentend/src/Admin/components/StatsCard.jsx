export default function StatsCard({ title, value }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 w-60">
      <h2 className="text-gray-600">{title}</h2>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
