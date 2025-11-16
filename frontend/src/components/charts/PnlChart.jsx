import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

export function PnlChart({ trades }) {
  // Calculate cumulative P&L over time
  const data = trades
    .filter(trade => trade.status === 'closed' && trade.pl !== null)
    .sort((a, b) => new Date(a.trade_date_close) - new Date(b.trade_date_close))
    .reduce((acc, trade, index) => {
      const prevPL = index > 0 ? acc[index - 1].cumulativePL : 0;
      acc.push({
        date: format(new Date(trade.trade_date_close), 'MMM dd'),
        pl: trade.pl,
        cumulativePL: prevPL + trade.pl,
      });
      return acc;
    }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cumulative P&L</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E7DFE2" />
            <XAxis dataKey="date" stroke="#94727E" />
            <YAxis stroke="#94727E" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #94727E33',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="cumulativePL"
              stroke="#88D7BA"
              strokeWidth={2}
              name="Cumulative P&L"
              dot={{ fill: '#88D7BA' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
