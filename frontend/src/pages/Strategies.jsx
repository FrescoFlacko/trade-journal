import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/apiClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

export function Strategies() {
  const [strategies, setStrategies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStrategy, setEditingStrategy] = useState(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    asset_types: '',
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (strategy = null) => {
    if (strategy) {
      setEditingStrategy(strategy);
      setFormData({
        name: strategy.name,
        description: strategy.description || '',
        asset_types: strategy.asset_types.join(', '),
      });
    } else {
      setEditingStrategy(null);
      setFormData({
        name: '',
        description: '',
        asset_types: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingStrategy(null);
    setFormData({
      name: '',
      description: '',
      asset_types: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const strategyData = {
      name: formData.name,
      description: formData.description,
      asset_types: formData.asset_types.split(',').map(t => t.trim()).filter(Boolean),
    };

    try {
      if (editingStrategy) {
        const updated = await apiClient.updateStrategy(editingStrategy.id, strategyData);
        setStrategies(strategies.map(s => s.id === updated.id ? updated : s));
        toast({
          title: 'Success',
          description: 'Strategy updated successfully',
        });
      } else {
        const created = await apiClient.createStrategy(strategyData);
        setStrategies([...strategies, created]);
        toast({
          title: 'Success',
          description: 'Strategy created successfully',
        });
      }
      handleCloseDialog();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this strategy?')) return;

    try {
      await apiClient.deleteStrategy(id);
      setStrategies(strategies.filter(s => s.id !== id));
      toast({
        title: 'Success',
        description: 'Strategy deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-template-dark">Strategies</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              New Strategy
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingStrategy ? 'Edit Strategy' : 'New Strategy'}</DialogTitle>
              <DialogDescription>
                {editingStrategy ? 'Update your trading strategy' : 'Create a new trading strategy'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Strategy Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Breakout Strategy"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your strategy"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="asset_types">Asset Types (comma-separated)</Label>
                <Input
                  id="asset_types"
                  value={formData.asset_types}
                  onChange={(e) => setFormData({ ...formData, asset_types: e.target.value })}
                  placeholder="e.g., stocks, crypto, swing"
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingStrategy ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {strategies.length === 0 ? (
          <Card className="md:col-span-2 lg:col-span-3">
            <CardContent className="py-8">
              <p className="text-muted-foreground text-center">
                No strategies yet. Create your first strategy to get started!
              </p>
            </CardContent>
          </Card>
        ) : (
          strategies.map((strategy) => (
            <Card key={strategy.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{strategy.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {strategy.description || 'No description'}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(strategy)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(strategy.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-template-dark">Asset Types:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {strategy.asset_types.map((type, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-template-primary/10 text-template-primary rounded text-xs"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Created: {format(new Date(strategy.created_at), 'MMM dd, yyyy')}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
