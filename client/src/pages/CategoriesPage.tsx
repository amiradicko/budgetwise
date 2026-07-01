import { useState, useEffect } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import Layout from '../components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import { categoriesService } from '../services/categories.service';
import type { Category, CreateCategoryInput, UpdateCategoryInput } from '@budgetwise/shared';

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [filterType, setFilterType] = useState<'INCOME' | 'EXPENSE' | 'ALL'>('ALL');
  const [formData, setFormData] = useState<CreateCategoryInput>({
    name: '',
    type: 'EXPENSE',
    color: '#10B981',
    icon: '📁',
    parentId: undefined,
    isDefault: false,
    order: 0,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoriesService.getAll();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des catégories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'parentId') {
      setFormData((prev) => ({ ...prev, [name]: value || undefined }));
    } else if (name === 'order') {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        const updateData: UpdateCategoryInput = {
          name: formData.name,
          type: formData.type,
          color: formData.color,
          icon: formData.icon,
          parentId: formData.parentId,
          order: formData.order,
        };
        await categoriesService.update(editingCategory.id, updateData);
      } else {
        await categoriesService.create(formData);
      }
      setIsModalOpen(false);
      resetForm();
      loadCategories();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      setError('Erreur lors de la sauvegarde de la catégorie');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      type: category.type,
      color: category.color || '#10B981',
      icon: category.icon || '📁',
      parentId: category.parentId || undefined,
      isDefault: category.isDefault,
      order: category.order,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return;
    
    try {
      await categoriesService.delete(id);
      loadCategories();
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError('Erreur lors de la suppression de la catégorie');
    }
  };

  const resetForm = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      type: 'EXPENSE',
      color: '#10B981',
      icon: '📁',
      parentId: undefined,
      isDefault: false,
      order: 0,
    });
  };

  const getSubcategories = (categoryId: string) => {
    return categories.filter((c) => c.parentId === categoryId);
  };

  const filteredCategories = categories.filter((category) => {
    if (filterType === 'ALL') return !category.parentId;
    return category.type === filterType && !category.parentId;
  });

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p>Chargement...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Catégories</h1>
          <Button onClick={() => setIsModalOpen(true)}>
            Créer une catégorie
          </Button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant={filterType === 'ALL' ? 'primary' : 'outline'}
            onClick={() => setFilterType('ALL')}
          >
            Toutes
          </Button>
          <Button
            variant={filterType === 'INCOME' ? 'primary' : 'outline'}
            onClick={() => setFilterType('INCOME')}
          >
            Revenus
          </Button>
          <Button
            variant={filterType === 'EXPENSE' ? 'primary' : 'outline'}
            onClick={() => setFilterType('EXPENSE')}
          >
            Dépenses
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((category) => {
            const subcategories = getSubcategories(category.id);

            return (
              <Card key={category.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">{category.icon || '📁'}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span>{category.name}</span>
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color || '#10B981' }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 font-normal mt-1">
                        {category.type === 'INCOME' ? '💰 Revenu' : '💸 Dépense'}
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.icon && (
                      <p className="text-sm text-gray-600 mt-2">
                        Ordre: {category.order}
                      </p>
                    )}

                    {subcategories.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-2">
                          Sous-catégories ({subcategories.length})
                        </p>
                        <div className="space-y-1">
                          {subcategories.map((sub) => (
                            <div
                              key={sub.id}
                              className="flex items-center gap-2 text-sm px-2 py-1 bg-gray-50 rounded"
                            >
                              <span>{sub.icon}</span>
                              <span>{sub.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(category)}
                        className="flex-1"
                      >
                        Modifier
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(category.id)}
                        className="flex-1"
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredCategories.length === 0 && (
          <Card>
            <CardContent>
              <p className="text-center text-gray-500 py-8">
                Aucune catégorie trouvée. Cliquez sur "Créer une catégorie" pour commencer.
              </p>
            </CardContent>
          </Card>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            resetForm();
          }}
          title={editingCategory ? 'Modifier la catégorie' : 'Créer une catégorie'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nom"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />

            <Select
              label="Type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              options={[
                { value: 'INCOME', label: 'Revenu' },
                { value: 'EXPENSE', label: 'Dépense' },
                { value: 'BOTH', label: 'Les deux' },
              ]}
              required
            />

            <Input
              label="Icône (emoji)"
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleInputChange}
              maxLength={2}
            />

            <Input
              label="Couleur"
              type="color"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
            />

            <Select
              label="Catégorie parente (optionnel)"
              name="parentId"
              value={formData.parentId || ''}
              onChange={handleInputChange}
              options={[
                { value: '', label: 'Aucune (catégorie principale)' },
                ...categories
                  .filter((c) => !c.parentId && c.type === formData.type && c.id !== editingCategory?.id)
                  .map((c) => ({
                    value: c.id,
                    label: `${c.icon} ${c.name}`,
                  })),
              ]}
            />

            <Input
              label="Ordre"
              type="number"
              name="order"
              value={formData.order}
              onChange={handleInputChange}
              min="0"
            />

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                {editingCategory ? 'Modifier' : 'Créer'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="flex-1"
              >
                Annuler
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
}
