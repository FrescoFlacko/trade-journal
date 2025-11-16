import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '@/lib/apiClient';
import { StatCard } from '@/components/StatCard';
import { PnlChart } from '@/components/charts/PnlChart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Target, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

export function Dashboard() {
  const [trades, setTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadTrades();
  }, []);

  const loadTrades = async () => {
    try {
      const data = await apiClient.getTrades();
      setTrades(data);
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

  // Calculate statistics
  const closedTrades = trades.filter(t => t.status === 'closed' && t.pl !== null);
  const totalPL = closedTrades.reduce((sum, t) => sum + t.pl, 0);
  const winningTrades = closedTrades.filter(t => t.is_win);
  const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0;
  const avgRR = closedTrades.filter(t => t.rr).length > 0
    ? closedTrades.filter(t => t.rr).reduce((sum, t) => sum + t.rr, 0) / closedTrades.filter(t => t.rr).length
    : 0;

  // Get recent trades
  const recentTrades = [...trades]
    .sort((a, b) => new Date(b.trade_date_open) - new Date(a.trade_date_open))
    .slice(0, 5);

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-template-dark">Dashboard</h1>
        <Link to="/new-trade">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Trade
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total P&L"
          value={`$${totalPL.toFixed(2)}`}
          icon={DollarSign}
          description={`From ${closedTrades.length} closed trades`}
        />
        <StatCard
          title="Win Rate"
          value={`${winRate.toFixed(1)}%`}
          icon={TrendingUp}
          description={`${winningTrades.length} wins out of ${closedTrades.length}`}
        />
        <StatCard
          title="Avg Risk:Reward"
          value={avgRR.toFixed(2)}
          icon={Target}
          description="Average R:R ratio"
        />
      </div>

      <PnlChart trades={trades} />

      <Card>
        <CardHeader>
          <CardTitle>Recent Trades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTrades.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No trades yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-template-dark/20">
                      <th className="text-left py-2 px-4 font-medium text-template-dark">Asset</th>
                      <th className="text-left py-2 px-4 font-medium text-template-dark">Type</th>
                      <th className="text-left py-2 px-4 font-medium text-template-dark">Status</th>
                      <th className="text-left py-2 px-4 font-medium text-template-dark">Date</th>
                      <th className="text-right py-2 px-4 font-medium text-template-dark">P&L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTrades.map((trade) => (
                      <tr key={trade.id} className="border-b border-template-dark/10">
                        <td className="py-2 px-4">{trade.asset_name}</td>
                        <td className="py-2 px-4">{trade.asset_type}</td>
                        <td className="py-2 px-4">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              trade.status === 'closed'
                                ? 'bg-template-dark/10 text-template-dark'
                                : 'bg-template-primary/10 text-template-primary'
                            }`}
                          >
                            {trade.status}
                          </span>
                        </td>
                        <td className="py-2 px-4">
                          {format(new Date(trade.trade_date_open), 'MMM dd, yyyy')}
                        </td>
                        <td className={`py-2 px-4 text-right font-medium ${
                          trade.pl > 0 ? 'text-green-600' : trade.pl < 0 ? 'text-red-600' : ''
                        }`}>
                          {trade.pl !== null ? `$${trade.pl.toFixed(2)}` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
