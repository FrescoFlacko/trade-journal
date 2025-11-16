import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient } from '@/lib/apiClient';
import { TradeForm } from '@/components/TradeForm';
import { useToast } from '@/components/ui/use-toast';

export function EditTrade() {
  const { tradeId } = useParams();
  const [trade, setTrade] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadTrade();
  }, [tradeId]);

  const loadTrade = async () => {
    try {
      const data = await apiClient.getTrade(tradeId);
      // Convert dates to YYYY-MM-DD format for input fields
      const formattedData = {
        ...data,
        trade_date_open: data.trade_date_open ? new Date(data.trade_date_open).toISOString().split('T')[0] : '',
        trade_date_close: data.trade_date_close ? new Date(data.trade_date_close).toISOString().split('T')[0] : '',
      };
      setTrade(formattedData);
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

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!trade) {
    return <div className="text-center py-8">Trade not found</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-template-dark">Edit Trade</h1>
      <TradeForm initialData={trade} isEdit={true} />
    </div>
  );
}
