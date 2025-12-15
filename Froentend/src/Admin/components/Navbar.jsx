export default function Navbar() {
  return (
    <div className="w-full px-6 py-4 bg-white/30 backdrop-blur-lg shadow-md flex justify-between items-center">
      <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      <button className="px-4 py-2 bg-red-500 text-white rounded-lg">Logout</button>
    </div>
  );
}
