import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@components/ui/Dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { marcasService } from '@/services/marcasService';
import { MarcaForm } from '@/components/marcas/MarcaForm';
import { useToast } from '@/hooks/use-toast';
import { Marca, CreateMarcaRequest, UpdateMarcaRequest } from '@/types/marca';

export function MarcasPage() {
  const [search, setSearch] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingMarca, setEditingMarca] = useState<Marca | null>(null);
  const [deletingMarca, setDeletingMarca] = useState<Marca | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Queries
  
  const { data: marcas, isLoading } = useQuery({
    queryKey: ['marcas', search],
    queryFn: () => marcasService.getAll(search),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: CreateMarcaRequest) => marcasService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marcas'] });
      setIsCreateDialogOpen(false);
      toast('Marca creada exitosamente', 'success');
    },
    onError: (error: any) => {
      toast(error.response?.data?.message || 'Error al crear la marca', 'error');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateMarcaRequest }) =>
      marcasService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marcas'] });
      setEditingMarca(null);
      toast('Marca actualizada exitosamente', 'success');
    },
    onError: (error: any) => {
      toast(error.response?.data?.message || 'Error al actualizar la marca', 'error');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => marcasService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marcas'] });
      setDeletingMarca(null);
      toast('Marca desactivada exitosamente', 'success');
    },
    onError: (error: any) => {
      toast(error.response?.data?.message || 'Error al desactivar la marca', 'error');
    },
  });

  const handleCreate = (data: CreateMarcaRequest) => {
    createMutation.mutate(data);
  };

  const handleUpdate = (data: UpdateMarcaRequest) => {
    if (editingMarca) {
      updateMutation.mutate({ id: editingMarca.MarcaID, data });
    }
  };

  const handleDelete = () => {
    if (deletingMarca) {
      deleteMutation.mutate(deletingMarca.MarcaID);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Marcas</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Marca
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Marcas</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar marcas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Cargando marcas...</div>
          ) : marcas && marcas.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Marca</TableHead>
                  <TableHead>País de Origen</TableHead>
                  <TableHead>Fecha Creación</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {marcas.map((marca) => (
                  <TableRow key={marca.MarcaID}>
                    <TableCell>{marca.MarcaID}</TableCell>
                    <TableCell className="font-medium">{marca.Marca}</TableCell>
                    <TableCell>{marca.PaisOrigen || '-'}</TableCell>
                    <TableCell>
                      {new Date(marca.FechaCreacion).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingMarca(marca)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingMarca(marca)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron marcas
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva Marca</DialogTitle>
            <DialogDescription>
              Completa los datos para crear una nueva marca.
            </DialogDescription>
          </DialogHeader>
          <MarcaForm
            onSubmit={handleCreate}
            onCancel={() => setIsCreateDialogOpen(false)}
            isLoading={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingMarca} onOpenChange={() => setEditingMarca(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Marca</DialogTitle>
            <DialogDescription>
              Modifica los datos de la marca.
            </DialogDescription>
          </DialogHeader>
          {editingMarca && (
            <MarcaForm
              marca={editingMarca}
              onSubmit={handleUpdate}
              onCancel={() => setEditingMarca(null)}
              isLoading={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      <AlertDialog
        open={!!deletingMarca}
        onOpenChange={() => setDeletingMarca(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Desactivar marca?</AlertDialogTitle>
            <AlertDialogDescription>
              La marca <strong>{deletingMarca?.Marca}</strong> será desactivada.
              No podrás eliminarla si tiene modelos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Desactivar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
