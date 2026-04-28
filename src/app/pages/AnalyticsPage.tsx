import { AuthoritySidebar } from '../components/AuthoritySidebar';
import { WireframePlaceholder } from '../components/WireframePlaceholder';

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen bg-white">
      <AuthoritySidebar />

      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-mono font-bold mb-2">ANALYTICS</h1>
          <p className="text-gray-600 font-mono text-sm">Environmental monitoring trends and insights</p>
        </div>

        {/* Date Range Filter */}
        <div className="mb-8 border-2 border-black p-4 bg-gray-50 flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-xs font-mono font-bold mb-2">START DATE</label>
            <input
              type="date"
              className="w-full border-2 border-black p-2 font-mono text-sm bg-white"
              defaultValue="2026-01-01"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-mono font-bold mb-2">END DATE</label>
            <input
              type="date"
              className="w-full border-2 border-black p-2 font-mono text-sm bg-white"
              defaultValue="2026-03-30"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-mono font-bold mb-2">REGION</label>
            <select className="w-full border-2 border-black p-2 font-mono text-sm bg-white">
              <option>All Regions</option>
              <option>North</option>
              <option>South</option>
              <option>East</option>
              <option>West</option>
            </select>
          </div>
          <button className="border-2 border-black px-6 py-2 font-mono font-bold hover:bg-black hover:text-white transition-colors">
            APPLY
          </button>
        </div>

        {/* Charts Grid */}
        <div className="space-y-8">
          {/* Forest Risk Trends */}
          <div className="border-4 border-black p-6 bg-gray-50">
            <h2 className="text-xl font-mono font-bold mb-4">FOREST RISK TRENDS</h2>
            <WireframePlaceholder label="LINE CHART: Forest Risk Over Time" height="300px" />
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xs font-mono text-gray-600">CURRENT RISK</div>
                <div className="text-lg font-mono font-bold">HIGH</div>
              </div>
              <div>
                <div className="text-xs font-mono text-gray-600">AVG RISK (90d)</div>
                <div className="text-lg font-mono font-bold">MEDIUM</div>
              </div>
              <div>
                <div className="text-xs font-mono text-gray-600">TREND</div>
                <div className="text-lg font-mono font-bold">↑ INCREASING</div>
              </div>
            </div>
          </div>

          {/* Water Level Trends */}
          <div className="border-4 border-black p-6 bg-gray-50">
            <h2 className="text-xl font-mono font-bold mb-4">WATER LEVEL TRENDS</h2>
            <WireframePlaceholder label="AREA CHART: Water Levels Over Time" height="300px" />
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xs font-mono text-gray-600">CURRENT LEVEL</div>
                <div className="text-lg font-mono font-bold">NORMAL</div>
              </div>
              <div>
                <div className="text-xs font-mono text-gray-600">AVG LEVEL (90d)</div>
                <div className="text-lg font-mono font-bold">NORMAL</div>
              </div>
              <div>
                <div className="text-xs font-mono text-gray-600">TREND</div>
                <div className="text-lg font-mono font-bold">→ STABLE</div>
              </div>
            </div>
          </div>

          {/* Incident Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-4 border-black p-6 bg-gray-50">
              <h2 className="text-xl font-mono font-bold mb-4">INCIDENTS BY TYPE</h2>
              <WireframePlaceholder label="PIE CHART: Incident Types" height="250px" />
            </div>
            <div className="border-4 border-black p-6 bg-gray-50">
              <h2 className="text-xl font-mono font-bold mb-4">INCIDENTS BY REGION</h2>
              <WireframePlaceholder label="BAR CHART: Regional Distribution" height="250px" />
            </div>
          </div>

          {/* Monthly Comparison */}
          <div className="border-4 border-black p-6 bg-gray-50">
            <h2 className="text-xl font-mono font-bold mb-4">MONTHLY INCIDENT COMPARISON</h2>
            <WireframePlaceholder label="BAR CHART: Incidents per Month" height="300px" />
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="border-2 border-black p-4 bg-white">
              <div className="text-xs font-mono text-gray-600 mb-1">RESPONSE TIME (AVG)</div>
              <div className="text-xl font-mono font-bold">2.3 days</div>
            </div>
            <div className="border-2 border-black p-4 bg-white">
              <div className="text-xs font-mono text-gray-600 mb-1">RESOLUTION RATE</div>
              <div className="text-xl font-mono font-bold">85%</div>
            </div>
            <div className="border-2 border-black p-4 bg-white">
              <div className="text-xs font-mono text-gray-600 mb-1">ACTIVE USERS</div>
              <div className="text-xl font-mono font-bold">1,247</div>
            </div>
            <div className="border-2 border-black p-4 bg-white">
              <div className="text-xs font-mono text-gray-600 mb-1">THIS MONTH</div>
              <div className="text-xl font-mono font-bold">23 reports</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
