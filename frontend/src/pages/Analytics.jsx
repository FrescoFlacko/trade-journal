import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/apiClient';
import { PnlChart } from '@/components/charts/PnlChart';
import { StrategyChart } from '@/components/charts/StrategyChart';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useToast } from '@/components/ui/use-toast';

const COLORS = ['#88D7BA', '#CD9B93', '#94727E', '#E7DFE2'];

export function Analytics() {
  const [trades, setTrades] = useState([]);
  const [strategies, setStrategies] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tradesData, strategiesData] = await Promise.all([
        apiClient.getTrades(),
        apiClient.getStrategies(),
      ]);
      setTrades(tradesData);
      setStrategies(strategiesData);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter trades by date range
  const filteredTrades = trades.filter(trade => {
    const tradeDate = new Date(trade.trade_date_open);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && tradeDate < start) return false;
    if (end && tradeDate > end) return false;
    return true;
  });

  // Calculate P&L by asset type
  const assetTypeData = {};
  filteredTrades.forEach(trade => {
    if (trade.status === 'closed' && trade.pl !== null) {
      if (!assetTypeData[trade.asset_type]) {
        assetTypeData[trade.asset_type] = 0;
      }
      assetTypeData[trade.asset_type] += trade.pl;
    }
  });

  const pieData = Object.entries(assetTypeData).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2)),
  }));

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-template-dark">Analytics</h1>

      <Card>
        <CardHeader>
          <CardTitle>Date Range Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-8 md:grid-cols-2">
        <PnlChart trades={filteredTrades} />
        <StrategyChart trades={filteredTrades} strategies={strategies} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>P&L by Asset Type</CardTitle>
        </CardHeader>
        <CardContent>
          {pieData.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: $${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Summary Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Total Trades</p>
              <p className="text-2xl font-bold text-template-dark">{filteredTrades.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Closed Trades</p>
              <p className="text-2xl font-bold text-template-dark">
                {filteredTrades.filter(t => t.status === 'closed').length}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Open Trades</p>
              <p className="text-2xl font-bold text-template-dark">
                {filteredTrades.filter(t => t.status === 'open').length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
