import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/lib/apiClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

export function TradeForm({ initialData = null, isEdit = false }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [strategies, setStrategies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    asset_name: '',
    asset_type: 'stocks',
    status: 'open',
    trade_date_open: new Date().toISOString().split('T')[0],
    trade_date_close: '',
    entry_price: '',
    exit_price: '',
    position_size: '',
    reason_for_entry: '',
    notes: '',
    rr: '',
    pl: '',
    is_win: null,
    image_url: '',
    strategy_id: '',
    ...initialData,
  });

  useEffect(() => {
    loadStrategies();
  }, []);

  const loadStrategies = async () => {
    try {
      const data = await apiClient.getStrategies();
      setStrategies(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = formData.image_url;

      // Upload image if selected
      if (imageFile) {
        const uploadResult = await apiClient.uploadImage(imageFile);
        imageUrl = uploadResult.imageUrl;
      }

      // Prepare trade data
      const tradeData = {
        ...formData,
        entry_price: parseFloat(formData.entry_price),
        exit_price: formData.exit_price ? parseFloat(formData.exit_price) : null,
        position_size: parseFloat(formData.position_size),
        rr: formData.rr ? parseFloat(formData.rr) : null,
        pl: formData.pl ? parseFloat(formData.pl) : null,
        trade_date_close: formData.trade_date_close || null,
        strategy_id: formData.strategy_id || null,
        image_url: imageUrl,
      };

      // Determine is_win based on P&L
      if (tradeData.pl !== null) {
        tradeData.is_win = tradeData.pl > 0;
      }

      if (isEdit && initialData?.id) {
        await apiClient.updateTrade(initialData.id, tradeData);
        toast({
          title: 'Success',
          description: 'Trade updated successfully',
        });
      } else {
        await apiClient.createTrade(tradeData);
        toast({
          title: 'Success',
          description: 'Trade created successfully',
        });
      }

      navigate('/log');
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? 'Edit Trade' : 'New Trade'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="asset_name">Asset Name *</Label>
              <Input
                id="asset_name"
                value={formData.asset_name}
                onChange={(e) => handleChange('asset_name', e.target.value)}
                placeholder="e.g., AAPL, BTC/USD"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="asset_type">Asset Type *</Label>
              <Select value={formData.asset_type} onValueChange={(value) => handleChange('asset_type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stocks">Stock Options</SelectItem>
                  <SelectItem value="crypto">Crypto Perps</SelectItem>
                  <SelectItem value="swing">Swing Trade</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="strategy">Strategy</Label>
              <Select value={formData.strategy_id} onValueChange={(value) => handleChange('strategy_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No Strategy</SelectItem>
                  {strategies.map(strategy => (
                    <SelectItem key={strategy.id} value={strategy.id}>
                      {strategy.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="trade_date_open">Entry Date *</Label>
              <Input
                id="trade_date_open"
                type="date"
                value={formData.trade_date_open}
                onChange={(e) => handleChange('trade_date_open', e.target.value)}
                required
              />
            </div>

            {formData.status === 'closed' && (
              <div className="space-y-2">
                <Label htmlFor="trade_date_close">Exit Date</Label>
                <Input
                  id="trade_date_close"
                  type="date"
                  value={formData.trade_date_close}
                  onChange={(e) => handleChange('trade_date_close', e.target.value)}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="entry_price">Entry Price *</Label>
              <Input
                id="entry_price"
                type="number"
                step="0.01"
                value={formData.entry_price}
                onChange={(e) => handleChange('entry_price', e.target.value)}
                required
              />
            </div>

            {formData.status === 'closed' && (
              <div className="space-y-2">
                <Label htmlFor="exit_price">Exit Price</Label>
                <Input
                  id="exit_price"
                  type="number"
                  step="0.01"
                  value={formData.exit_price}
                  onChange={(e) => handleChange('exit_price', e.target.value)}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="position_size">Position Size *</Label>
              <Input
                id="position_size"
                type="number"
                step="0.01"
                value={formData.position_size}
                onChange={(e) => handleChange('position_size', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rr">Risk:Reward Ratio</Label>
              <Input
                id="rr"
                type="number"
                step="0.01"
                value={formData.rr}
                onChange={(e) => handleChange('rr', e.target.value)}
                placeholder="e.g., 2.5"
              />
            </div>

            {formData.status === 'closed' && (
              <div className="space-y-2">
                <Label htmlFor="pl">Profit/Loss ($)</Label>
                <Input
                  id="pl"
                  type="number"
                  step="0.01"
                  value={formData.pl}
                  onChange={(e) => handleChange('pl', e.target.value)}
                  placeholder="e.g., 150.00"
                />
              </div>
            )}

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="reason_for_entry">Reason for Entry</Label>
              <Input
                id="reason_for_entry"
                value={formData.reason_for_entry}
                onChange={(e) => handleChange('reason_for_entry', e.target.value)}
                placeholder="Why did you enter this trade?"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Additional notes"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="image">Chart Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {formData.image_url && !imageFile && (
                <p className="text-sm text-muted-foreground">Current: {formData.image_url}</p>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : isEdit ? 'Update Trade' : 'Create Trade'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/log')}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
