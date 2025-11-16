import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function StrategyChart({ trades, strategies }) {
  // Calculate P&L by strategy
  const strategyMap = {};

  trades.forEach(trade => {
    if (trade.status === 'closed' && trade.pl !== null && trade.strategy_id) {
      const strategy = strategies.find(s => s.id === trade.strategy_id);
      const strategyName = strategy ? strategy.name : 'Unknown';

      if (!strategyMap[strategyName]) {
        strategyMap[strategyName] = 0;
      }
      strategyMap[strategyName] += trade.pl;
    }
  });

  const data = Object.entries(strategyMap).map(([name, pl]) => ({
    name,
    pl: parseFloat(pl.toFixed(2)),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>P&L by Strategy</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E7DFE2" />
            <XAxis dataKey="name" stroke="#94727E" />
            <YAxis stroke="#94727E" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #94727E33',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="pl" fill="#88D7BA" name="P&L" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
