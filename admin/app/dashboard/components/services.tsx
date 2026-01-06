import { Service, api, API_URL } from '@/lib/api';
import { Star, Tag, DollarSign, Edit, Trash2, Plus, Image as ImageIcon, Grid, Check, X, Loader2 } from 'lucide-react';
import { useState, FormEvent } from 'react';

interface ServicesProps {
  services: Service[];
}

export default function ServicesPage({ services: initialServices }: ServicesProps) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    image: '',
    available: true,
    rating: 0,
    features: [] as string[],
  });
  const [featureInput, setFeatureInput] = useState('');
  const categories = ['Room', 'Food'];

  const getImageUrl = (url: string) => {
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    const cleanPath = url.startsWith('/') ? url.substring(1) : url;
    return `${API_URL}${cleanPath}`;
  };


  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await api.deleteService(id);
      setServices(services.filter(s => s.id !== id));
    } catch (error) {
      console.error('Failed to delete service:', error);
    }
  };

  const handleEdit = async () => {
    if (!editingService) return;
    setLoading(true);
    try {
      const updated = await api.updateService(editingService.id, editingService);
      setServices(services.map(s => s.id === updated.id ? updated : s));
      setEditingService(null);
    } catch (error) {
      console.error('Failed to update service:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleCreate = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const serviceData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: Number(formData.price),
        available: formData.available,
        rating: formData.rating || 0,
        features: formData.features,
      };

      const created = await api.createService(serviceData, selectedFile!);

      setServices([created, ...services]);
      setIsCreating(false);
      resetForm();
    } catch (err) {
      console.error('Failed to create service:', err);
    } finally {
      setLoading(false);
    }
  };


  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      category: '',
      image: '',
      available: true,
      rating: 0,
      features: [],
    });
    setFeatureInput('');
    setSelectedFile(null);
  };

  const addFeature = () => {
    if (featureInput.trim() && !formData.features.includes(featureInput.trim())) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput.trim()]
      });
      setFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  const totalOrders = services.reduce((sum, service) =>
    sum + (service.orders?.reduce((orderSum, order) => orderSum + order.total, 0) || 0), 0
  );

  if (services.length === 0) {
    return (
      <div className="p-0">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h1 className="text-xl font-bold text-gray-800">Services Catalog</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all your services</p>
        </div>

        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-24 h-24 bg-[#FF4A1C]/10 rounded-full flex items-center justify-center mb-6">
            <Grid className="w-12 h-12 text-[#FF4A1C]" />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-3">No Services Yet</h2>
          <p className="text-gray-500 text-center max-w-md mb-8">
            You haven't created any services yet. Start by adding your first service to offer to customers.
          </p>

          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#FF4A1C] text-white rounded-lg hover:bg-[#FF4A1C]/90 transition-colors font-medium shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Create Your First Service
          </button>
        </div>

        {isCreating && <CreateServiceModal
          isCreating={isCreating}
          setIsCreating={setIsCreating}
          formData={formData}
          setFormData={setFormData}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          featureInput={featureInput}
          setFeatureInput={setFeatureInput}
          categories={categories}
          addFeature={addFeature}
          removeFeature={removeFeature}
          loading={loading}
          handleCreate={handleCreate}
          resetForm={resetForm}
          getImageUrl={getImageUrl}
        />}
      </div>
    );
  }

  return (
    <div className="p-0">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Services Catalog</h1>
            <p className="text-sm text-gray-500 mt-1">
              {services.length} services • {totalOrders.toLocaleString()} Frw total revenue
            </p>
          </div>

          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#FF4A1C] text-white rounded-lg hover:bg-[#FF4A1C]/90 transition-colors font-medium shadow-sm self-start sm:self-center"
          >
            <Plus className="w-5 h-5" />
            Add New Service
          </button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(service => (
            <div
              key={service.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 group"
            >
              <div className="relative h-48 overflow-hidden bg-gray-100">
                {service.image ? (
                  <img
                    src={getImageUrl(service.image)}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${service.available
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-red-100 text-red-800'
                    }`}>
                    <div className={`w-2 h-2 rounded-full ${service.available ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    {service.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>

              {/* Service Content */}
              <div className="p-5">
                {/* Title and Category */}
                <div className="mb-3">
                  <h2 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">{service.title}</h2>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">{service.category}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>

                {/* Features */}
                {service.features && service.features.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1.5">
                      {service.features.slice(0, 3).map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
                        >
                          {feature}
                        </span>
                      ))}
                      {service.features.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                          +{service.features.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Stats and Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-bold text-[#FF4A1C]">{service.price.toFixed(2)} Frw</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="text-sm font-medium text-gray-800">{service.rating}/5</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingService(service)}
                      className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                      title="Edit service"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                      title="Delete service"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Revenue */}
                {service.orders && service.orders.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Revenue from orders:</span>
                      <span className="text-sm font-medium text-gray-800">
                        {service.orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()} Frw
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isCreating && <CreateServiceModal
        isCreating={isCreating}
        setIsCreating={setIsCreating}
        formData={formData}
        setFormData={setFormData}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        featureInput={featureInput}
        setFeatureInput={setFeatureInput}
        categories={categories}
        addFeature={addFeature}
        removeFeature={removeFeature}
        loading={loading}
        handleCreate={handleCreate}
        resetForm={resetForm}
        getImageUrl={getImageUrl}
      />}

      {editingService && <EditServiceModal
        editingService={editingService}
        setEditingService={setEditingService}
        loading={loading}
        handleEdit={handleEdit}
        getImageUrl={getImageUrl}
      />}
    </div>
  );
}

interface CreateServiceModalProps {
  isCreating: boolean;
  setIsCreating: (value: boolean) => void;
  formData: any;
  setFormData: (data: any) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  featureInput: string;
  setFeatureInput: (value: string) => void;
  categories: string[];
  addFeature: () => void;
  removeFeature: (index: number) => void;
  loading: boolean;
  handleCreate: (e?: FormEvent) => Promise<void>;
  resetForm: () => void;
  getImageUrl: (url: string) => string;
}

function CreateServiceModal({
  setIsCreating,
  formData,
  setFormData,
  setSelectedFile,
  featureInput,
  setFeatureInput,
  categories,
  addFeature,
  removeFeature,
  loading,
  handleCreate,
  resetForm,
  getImageUrl
}: CreateServiceModalProps) {

  const handleFormSubmit = (e: FormEvent) => {
    handleCreate(e);
  };

  const handleClose = () => {
    setIsCreating(false);
    resetForm();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Create New Service</h2>
              <p className="text-sm text-gray-500 mt-1">Add a new service to your catalog</p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Deluxe Room"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4A1C]/20 focus:border-[#FF4A1C] outline-none transition"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4A1C]/20 focus:border-[#FF4A1C] outline-none transition"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (Frw) *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <span className="text-gray-500 font-medium">Frw</span>
                  </div>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full pl-14 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4A1C]/20 focus:border-[#FF4A1C] outline-none transition"
                    required
                    min="0"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#FF4A1C] transition-colors cursor-pointer">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedFile(file);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData({ ...formData, image: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Click to upload an image
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Or URL Input */}
                <div className="mt-3">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">Or enter URL</span>
                    </div>
                  </div>
                  <div className="relative mt-3">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <ImageIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => {
                        setFormData({ ...formData, image: e.target.value });
                        setSelectedFile(null);
                      }}
                      placeholder="https://example.com/image.jpg"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4A1C]/20 focus:border-[#FF4A1C] outline-none transition"
                    />
                  </div>
                </div>

                {/* Image Preview */}
                {formData.image && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={getImageUrl(formData.image)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>


            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your service in detail..."
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4A1C]/20 focus:border-[#FF4A1C] outline-none transition resize-none"
                  required
                />
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Features
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    placeholder="Add a feature..."
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4A1C]/20 focus:border-[#FF4A1C] outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#FF4A1C]/10 text-[#FF4A1C] rounded-full text-sm"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="hover:text-[#FF4A1C]/70 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Availability
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.available}
                      onChange={() => setFormData({ ...formData, available: true })}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-3 ${formData.available ? 'border-[#FF4A1C]' : 'border-gray-300'}`}>
                      {formData.available && (
                        <div className="w-3 h-3 bg-[#FF4A1C] rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      )}
                    </div>
                    <span className="text-gray-700">Available</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={!formData.available}
                      onChange={() => setFormData({ ...formData, available: false })}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-3 ${!formData.available ? 'border-[#FF4A1C]' : 'border-gray-300'}`}>
                      {!formData.available && (
                        <div className="w-3 h-3 bg-[#FF4A1C] rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      )}
                    </div>
                    <span className="text-gray-700">Unavailable</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-8 mt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title || !formData.category || !formData.price || !formData.description}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#FF4A1C] text-white rounded-lg hover:bg-[#FF4A1C]/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Create Service
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}




// ==================== EDIT MODAL COMPONENT ====================
interface EditServiceModalProps {
  editingService: Service | null;
  setEditingService: (service: Service | null) => void;
  loading: boolean;
  handleEdit: () => Promise<void>;
  getImageUrl: (url: string) => string;
}

function EditServiceModal({
  editingService,
  setEditingService,
  loading,
  handleEdit,
  getImageUrl
}: EditServiceModalProps) {
  if (!editingService) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Edit Service</h2>
              <p className="text-sm text-gray-500 mt-1">Update service details</p>
            </div>
            <button
              onClick={() => setEditingService(null)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4A1C]/20 focus:border-[#FF4A1C] outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <input
                  type="text"
                  value={editingService.category}
                  onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4A1C]/20 focus:border-[#FF4A1C] outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={editingService.description}
                onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4A1C]/20 focus:border-[#FF4A1C] outline-none transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (Frw)</label>
                <input
                  type="number"
                  value={editingService.price}
                  onChange={(e) => setEditingService({ ...editingService, price: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4A1C]/20 focus:border-[#FF4A1C] outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={Number.isFinite(editingService.rating) ? editingService.rating : ''}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      rating: e.target.value === '' ? 0 : Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
              <input
                type="text"
                value={editingService.image}
                onChange={(e) => setEditingService({ ...editingService, image: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4A1C]/20 focus:border-[#FF4A1C] outline-none transition"
              />
            </div>

            {editingService.image && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Preview</p>
                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={getImageUrl(editingService.image)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                    }}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Availability</label>
              <select
                value={editingService.available.toString()}
                onChange={(e) => setEditingService({ ...editingService, available: e.target.value === 'true' })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4A1C]/20 focus:border-[#FF4A1C] outline-none transition"
              >
                <option value="true">Available</option>
                <option value="false">Unavailable</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-8 mt-6 border-t border-gray-200">
            <button
              onClick={() => setEditingService(null)}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleEdit}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#FF4A1C] text-white rounded-lg hover:bg-[#FF4A1C]/90 transition-colors font-medium disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}