import { useState, useEffect } from 'react';
import { Tag, Plus, Search, Edit, Trash2, ToggleLeft, ToggleRight, Copy, TrendingUp } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { offersAPI, offerRedemptionsAPI } from '../../utils/api';
import type { Offer, OfferRedemption } from '../../types';

export function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [redemptions, setRedemptions] = useState<Record<number, OfferRedemption[]>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    setLoading(true);
    try {
      const result = await offersAPI.getAllAdmin();
      setOffers(result.data || []);

      // Load redemptions for each offer
      for (const offer of result.data || []) {
        if (offer.id) {
          const redemptionResult = await offerRedemptionsAPI.getByOfferId(offer.id);
          setRedemptions(prev => ({ ...prev, [offer.id!]: redemptionResult.data || [] }));
        }
      }
    } catch (error) {
      console.error('Failed to load offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: number, currentStatus: boolean) => {
    try {
      await offersAPI.toggleActive(id, !currentStatus);
      await loadOffers();
    } catch (error) {
      console.error('Failed to toggle offer status:', error);
    }
  };

  const deleteOffer = async (id: number) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;

    try {
      await offersAPI.delete(id);
      await loadOffers();
    } catch (error) {
      console.error('Failed to delete offer:', error);
    }
  };

  const copyOfferCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`Offer code "${code}" copied to clipboard!`);
  };

  const isExpired = (validUntil: string | null) => {
    if (!validUntil) return false;
    return new Date(validUntil) < new Date();
  };

  const isUsageLimitReached = (offer: Offer) => {
    if (!offer.usage_limit) return false;
    return offer.usage_count >= offer.usage_limit;
  };

  const filteredOffers = offers.filter(offer =>
    offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.offer_code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeOffers = filteredOffers.filter(o => o.is_active && !isExpired(o.valid_until) && !isUsageLimitReached(o));
  const inactiveOffers = filteredOffers.filter(o => !o.is_active || isExpired(o.valid_until) || isUsageLimitReached(o));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy">Offer Management</h1>
          <p className="text-gray-600 mt-1">Create and manage promotional offers</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-gold hover:bg-gold/90 text-navy"
        >
          <Plus size={20} />
          Create Offer
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search offers by title or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-gold">
          <p className="text-gray-600 text-sm">Total Offers</p>
          <p className="text-3xl font-bold text-navy">{offers.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Active Offers</p>
          <p className="text-3xl font-bold text-navy">{activeOffers.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Total Redemptions</p>
          <p className="text-3xl font-bold text-navy">
            {offers.reduce((sum, offer) => sum + (offer.usage_count || 0), 0)}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
          <p className="text-gray-600 text-sm">Expired/Inactive</p>
          <p className="text-3xl font-bold text-navy">{inactiveOffers.length}</p>
        </div>
      </div>

      {/* Offers List */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-gray-600">Loading offers...</p>
        </div>
      ) : filteredOffers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Tag size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No offers found. Create your first offer to get started.</p>
          <Button onClick={() => setShowAddModal(true)} className="mt-4">
            Create Offer
          </Button>
        </div>
      ) : (
        <>
          {/* Active Offers */}
          {activeOffers.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-navy mb-4">Active Offers</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {activeOffers.map((offer) => (
                  <OfferCard
                    key={offer.id}
                    offer={offer}
                    redemptions={redemptions[offer.id!] || []}
                    onToggleActive={toggleActive}
                    onEdit={setEditingOffer}
                    onDelete={deleteOffer}
                    onCopyCode={copyOfferCode}
                    onViewDetails={setSelectedOffer}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Inactive/Expired Offers */}
          {inactiveOffers.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-500 mb-4">Inactive/Expired Offers</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {inactiveOffers.map((offer) => (
                  <OfferCard
                    key={offer.id}
                    offer={offer}
                    redemptions={redemptions[offer.id!] || []}
                    onToggleActive={toggleActive}
                    onEdit={setEditingOffer}
                    onDelete={deleteOffer}
                    onCopyCode={copyOfferCode}
                    onViewDetails={setSelectedOffer}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {(showAddModal || editingOffer) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-navy">
                {editingOffer ? 'Edit Offer' : 'Create New Offer'}
              </h2>
            </div>
            <div className="p-6">
              <p className="text-center text-gray-600 py-8">
                Offer form coming soon. For now, you can toggle active/inactive and delete offers.
              </p>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddModal(false);
                  setEditingOffer(null);
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Offer Details Modal */}
      {selectedOffer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-navy">{selectedOffer.title}</h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Offer Details */}
              <div>
                <h3 className="font-bold text-navy mb-3">Offer Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Discount</p>
                    <p className="font-bold text-navy">{selectedOffer.discount_percent}% OFF</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Offer Code</p>
                    <p className="font-bold text-navy">{selectedOffer.offer_code}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Valid Until</p>
                    <p className="font-bold text-navy">
                      {selectedOffer.valid_until ? new Date(selectedOffer.valid_until).toLocaleDateString() : 'No expiry'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Usage</p>
                    <p className="font-bold text-navy">
                      {selectedOffer.usage_count} / {selectedOffer.usage_limit || '∞'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Redemptions */}
              <div>
                <h3 className="font-bold text-navy mb-3">Recent Redemptions</h3>
                {redemptions[selectedOffer.id!]?.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {redemptions[selectedOffer.id!].map((redemption) => (
                      <div key={redemption.id} className="p-3 border border-gray-200 rounded-lg">
                        <p className="font-medium text-navy">{redemption.customer_name || 'Anonymous'}</p>
                        <p className="text-sm text-gray-600">{redemption.customer_email}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(redemption.redeemed_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No redemptions yet</p>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <Button variant="outline" onClick={() => setSelectedOffer(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Offer Card Component
function OfferCard({
  offer,
  redemptions,
  onToggleActive,
  onEdit,
  onDelete,
  onCopyCode,
  onViewDetails,
}: {
  offer: Offer;
  redemptions: OfferRedemption[];
  onToggleActive: (id: number, currentStatus: boolean) => void;
  onEdit: (offer: Offer) => void;
  onDelete: (id: number) => void;
  onCopyCode: (code: string) => void;
  onViewDetails: (offer: Offer) => void;
}) {
  const isExpired = offer.valid_until && new Date(offer.valid_until) < new Date();
  const isUsageLimitReached = offer.usage_limit && offer.usage_count >= offer.usage_limit;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-gold hover:shadow-xl transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-navy mb-1">{offer.title}</h3>
            <p className="text-sm text-gray-600">{offer.description}</p>
          </div>
          <Badge className={offer.is_active && !isExpired && !isUsageLimitReached ? 'bg-green-500' : 'bg-gray-500'}>
            {isExpired ? 'Expired' : isUsageLimitReached ? 'Limit Reached' : offer.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </div>

        {/* Offer Code */}
        {offer.offer_code && (
          <div className="mb-4 p-3 bg-gold/10 border border-gold/30 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Offer Code</p>
              <p className="text-xl font-bold text-navy font-mono">{offer.offer_code}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCopyCode(offer.offer_code!)}
            >
              <Copy size={16} />
            </Button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-navy">{offer.discount_percent}%</p>
            <p className="text-xs text-gray-600">Discount</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-navy">{offer.usage_count}</p>
            <p className="text-xs text-gray-600">Used</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-navy">{offer.usage_limit || '∞'}</p>
            <p className="text-xs text-gray-600">Limit</p>
          </div>
        </div>

        {/* Validity */}
        {offer.valid_until && (
          <div className="mb-4 text-sm text-gray-600">
            Valid until: <span className="font-medium">{new Date(offer.valid_until).toLocaleDateString()}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleActive(offer.id!, offer.is_active)}
            className="flex-1"
          >
            {offer.is_active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(offer)}
            className="flex-1"
          >
            <TrendingUp size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(offer)}
            className="flex-1"
          >
            <Edit size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(offer.id!)}
            className="flex-1 text-red-500 hover:text-red-700"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
