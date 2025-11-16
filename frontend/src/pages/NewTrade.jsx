import { TradeForm } from '@/components/TradeForm';

export function NewTrade() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-template-dark">New Trade</h1>
      <TradeForm />
    </div>
  );
}
