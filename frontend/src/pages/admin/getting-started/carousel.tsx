import { useEffect, useState } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Pencil, Trash2 } from 'lucide-react';

import { Button, Card, CardHeader, CardBody, CardFooter, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Switch} from "@heroui/react";

type CarouselItem = {
  id: string;
  text: string;
  link?: string | null;
  is_active: boolean;
};

const CarouselPage: NextPage = () => {
  const { token } = useAuth();
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load items when the component mounts and when token changes
  useEffect(() => {
    const fetchItems = async () => {
      try {
        if (token) {
          const fetchedItems = await api.get('/carousel/all', token);
          setItems(fetchedItems);
        }
      } catch (error) {
        console.error('Failed to fetch carousel items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [token]);

  // State for the "Add New" form
  const [newText, setNewText] = useState('');
  const [newLink, setNewLink] = useState('');
  const [newIsActive, setNewIsActive] = useState(false);

  // State for the "Edit" dialog
  const [editingItem, setEditingItem] = useState<CarouselItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Function to handle creating a new item
  const handleCreateItem = async () => {
    try {
      const response = await api.post('/carousel', {
        text: newText,
        link: newLink || undefined,
        is_active: newIsActive
      }, token || undefined);

      setItems([...items, response]);
      setNewText('');
      setNewLink('');
      setNewIsActive(false);
    } catch (error) {
      console.error('Failed to create carousel item:', error);
    }
  };

  // Function to handle updating an item
  const handleUpdateItem = async () => {
    if (!editingItem) return;

    try {
      const response = await api.put(`/carousel/${editingItem.id}`, {
        text: editingItem.text,
        link: editingItem.link || undefined,
        is_active: editingItem.is_active
      }, token || undefined);

      setItems(items.map(item => 
        item.id === editingItem.id ? response : item
      ));
      setIsEditDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Failed to update carousel item:', error);
    }
  };

  // Function to handle deleting an item
  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await api.delete(`/carousel/${id}`, token || undefined);

      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Failed to delete carousel item:', error);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-6">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl bg-[#f5f7fb] min-h-screen space-y-8">

    {/* PAGE HEADER */}

    <div>

      <h1 className="text-3xl font-bold tracking-tight text-[#1e293b]">
        Carousel Management
      </h1>

      <p className="text-sm text-gray-500 mt-1">
        Manage homepage carousel announcements and links
      </p>

    </div>

    {/* ADD NEW ITEM */}

    <Card className="bg-white border border-gray-200 rounded-2xl shadow-md">

      <CardHeader className="pb-2">

        <div>

          <h1 className="text-xl font-semibold text-[#0f172a]">
            Add New Carousel Item
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Create announcements for the homepage carousel
          </p>

        </div>

      </CardHeader>

      <CardBody>

        <div className="space-y-5">

          {/* TEXT */}

          <div className="space-y-2">

            <Input
              id="text"
              label="Text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Enter carousel text"
              classNames={{
                inputWrapper:
                  "border border-gray-200 shadow-sm rounded-xl bg-[#f8fafc]",
              }}
            />

          </div>

          {/* LINK */}

          <div className="space-y-2">

            <Input
              id="link"
              label="Link (Optional)"
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              placeholder="Enter URL"
              classNames={{
                inputWrapper:
                  "border border-gray-200 shadow-sm rounded-xl bg-[#f8fafc]",
              }}
            />

          </div>

          {/* ACTIVE SWITCH */}

          <div className="flex items-center space-x-2">

            <Switch
              checked={newIsActive}
              onValueChange={setNewIsActive}
              id="active"
              defaultSelected
            >
              Active
            </Switch>

          </div>

          {/* BUTTON */}

          <Button
            onPress={handleCreateItem}
            isDisabled={!newText}
            className="bg-[#0f766e] hover:bg-[#115e59] text-white rounded-xl shadow-md w-fit"
          >
            Add Item
          </Button>

        </div>

      </CardBody>

    </Card>

    {/* ITEMS LIST */}

    <Card className="bg-white border border-gray-200 rounded-2xl shadow-md">

      <CardHeader className="pb-2">

        <div>

          <h1 className="text-xl font-semibold text-[#0f172a]">
            Carousel Items
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Edit or remove existing carousel announcements
          </p>

        </div>

      </CardHeader>

      <CardBody>

        <div className="space-y-4">

          {items.length === 0 ? (

            <div className="text-center py-8 text-gray-500">
              No carousel items found
            </div>

          ) : (

            items.map((item) => (

              <div
                key={item.id}
                className="flex items-center justify-between bg-[#f8fafc] border border-gray-200 p-4 rounded-2xl shadow-sm hover:bg-gray-50 transition-all"
              >

                {/* LEFT */}

                <div className="space-y-2">

                  <p className="font-medium text-[#0f172a]">
                    {item.text}
                  </p>

                  {item.link && (

                    <p className="text-sm text-gray-500 break-all">
                      {item.link}
                    </p>

                  )}

                  <div className="flex items-center space-x-2">

                    <div
                      className={`
                        h-2.5
                        w-2.5
                        rounded-full
                        ${
                          item.is_active
                            ? 'bg-emerald-500'
                            : 'bg-gray-300'
                        }
                      `}
                    />

                    <span className="text-sm text-gray-500">

                      {item.is_active
                        ? 'Active'
                        : 'Inactive'}

                    </span>

                  </div>

                </div>

                {/* ACTIONS */}

                <div className="flex items-center gap-2">

                  <Button
                    isIconOnly
                    variant="ghost"
                    className="rounded-xl hover:bg-gray-100"
                    onPress={() => {
                      setEditingItem(item);
                      setIsEditDialogOpen(true);
                    }}
                    aria-label="Edit carousel item"
                  >
                    <Pencil className="h-4 w-4 text-[#0f766e]" />
                  </Button>

                  <Button
                    isIconOnly
                    variant="ghost"
                    className="rounded-xl hover:bg-red-100"
                    onPress={() => handleDeleteItem(item.id)}
                    aria-label="Delete carousel item"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>

                </div>

              </div>

            ))

          )}

        </div>

      </CardBody>

    </Card>

    {/* EDIT MODAL */}

    <Modal
      isOpen={isEditDialogOpen}
      onOpenChange={setIsEditDialogOpen}
      className="bg-[#f8fafc] border border-gray-200 rounded-3xl shadow-2xl p-2"
    >

      <ModalContent className="rounded-3xl">

        <ModalHeader className="flex flex-col">

          <h1 className="text-2xl font-bold text-[#1e293b]">
            Edit Carousel Item
          </h1>

          <p className="text-sm text-gray-500">
            Update carousel announcement details
          </p>

        </ModalHeader>

        <ModalBody>

          <div className="space-y-5">

            {/* TEXT */}

            <div className="space-y-2">

              <Input
                id="edit-text"
                label="Text"
                value={editingItem?.text ?? ''}
                onChange={(e) =>
                  setEditingItem(
                    prev =>
                      prev
                        ? {
                            ...prev,
                            text: e.target.value
                          }
                        : null
                  )
                }
                classNames={{
                  inputWrapper:
                    "border border-gray-200 shadow-sm rounded-xl bg-white",
                }}
              />

            </div>

            {/* LINK */}

            <div className="space-y-2">

              <Input
                id="edit-link"
                label="Link (Optional)"
                value={editingItem?.link ?? ''}
                onChange={(e) =>
                  setEditingItem(
                    prev =>
                      prev
                        ? {
                            ...prev,
                            link: e.target.value
                          }
                        : null
                  )
                }
                classNames={{
                  inputWrapper:
                    "border border-gray-200 shadow-sm rounded-xl bg-white",
                }}
              />

            </div>

            {/* ACTIVE SWITCH */}

            <div className="flex items-center space-x-2">

              <Switch
                checked={editingItem?.is_active ?? false}
                onValueChange={(checked) =>
                  setEditingItem(
                    prev =>
                      prev
                        ? {
                            ...prev,
                            is_active: checked
                          }
                        : null
                  )
                }
                id="edit-active"
                defaultSelected
              >
                Active
              </Switch>

            </div>

          </div>

        </ModalBody>

        <ModalFooter>

          <Button
            onPress={() => setIsEditDialogOpen(false)}
            className="bg-white border border-gray-200 rounded-xl"
          >
            Cancel
          </Button>

          <Button
            onPress={handleUpdateItem}
            className="bg-[#0f766e] hover:bg-[#115e59] text-white rounded-xl shadow-md"
          >
            Save Changes
          </Button>

        </ModalFooter>

      </ModalContent>

    </Modal>

  </div>
  );
};

export default CarouselPage;
