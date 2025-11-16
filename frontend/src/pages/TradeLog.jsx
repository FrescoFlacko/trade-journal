import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '@/lib/apiClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

export function TradeLog() {
  const [trades, setTrades] = useState([]);
  const [strategies, setStrategies] = useState([]);
  const [filterAssetType, setFilterAssetType] = useState('all');
  const [filterStrategy, setFilterStrategy] = useState('all');
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

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this trade?')) return;

    try {
      await apiClient.deleteTrade(id);
      setTrades(trades.filter(t => t.id !== id));
      toast({
        title: 'Success',
        description: 'Trade deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  // Filter trades
  const filteredTrades = trades.filter(trade => {
    if (filterAssetType !== 'all' && trade.asset_type !== filterAssetType) return false;
    if (filterStrategy !== 'all' && trade.strategy_id !== filterStrategy) return false;
    return true;
  });

  // Get unique asset types
  const assetTypes = [...new Set(trades.map(t => t.asset_type))];

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-template-dark">Trade Log</h1>
        <Link to="/new-trade">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Trade
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Select value={filterAssetType} onValueChange={setFilterAssetType}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by asset type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Asset Types</SelectItem>
                  {assetTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={filterStrategy} onValueChange={setFilterStrategy}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Strategies</SelectItem>
                  {strategies.map(strategy => (
                    <SelectItem key={strategy.id} value={strategy.id}>
                      {strategy.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Trades ({filteredTrades.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTrades.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No trades found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-template-dark/20">
                    <th className="text-left py-2 px-4 font-medium text-template-dark">Asset</th>
                    <th className="text-left py-2 px-4 font-medium text-template-dark">Type</th>
                    <th className="text-left py-2 px-4 font-medium text-template-dark">Status</th>
                    <th className="text-left py-2 px-4 font-medium text-template-dark">Entry</th>
                    <th className="text-left py-2 px-4 font-medium text-template-dark">Exit</th>
                    <th className="text-left py-2 px-4 font-medium text-template-dark">Size</th>
                    <th className="text-left py-2 px-4 font-medium text-template-dark">Date</th>
                    <th className="text-right py-2 px-4 font-medium text-template-dark">P&L</th>
                    <th className="text-center py-2 px-4 font-medium text-template-dark">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrades.map((trade) => (
                    <tr key={trade.id} className="border-b border-template-dark/10 hover:bg-template-light/50">
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
                      <td className="py-2 px-4">${trade.entry_price.toFixed(2)}</td>
                      <td className="py-2 px-4">
                        {trade.exit_price ? `$${trade.exit_price.toFixed(2)}` : '-'}
                      </td>
                      <td className="py-2 px-4">{trade.position_size}</td>
                      <td className="py-2 px-4">
                        {format(new Date(trade.trade_date_open), 'MMM dd, yyyy')}
                      </td>
                      <td className={`py-2 px-4 text-right font-medium ${
                        trade.pl > 0 ? 'text-green-600' : trade.pl < 0 ? 'text-red-600' : ''
                      }`}>
                        {trade.pl !== null ? `$${trade.pl.toFixed(2)}` : '-'}
                      </td>
                      <td className="py-2 px-4">
                        <div className="flex justify-center gap-2">
                          <Link to={`/edit-trade/${trade.id}`}>
                            <Button variant="ghost" size="sm">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(trade.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
