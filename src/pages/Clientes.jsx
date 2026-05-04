import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

function Clientes() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <Button className="bg-green-500">Agregar cliente</Button>
      </div>
      <div className="rounded-lg overflow-hidden border border-gray-200">
        <Table className="border border-gray-200 rounded-lg">
            <TableHeader >
            <TableRow className="bg-gray-300 ">
                <TableHead>Nombre</TableHead>
                <TableHead>RUT</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Acciones</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            <TableRow>
                <TableCell>Juan Pérez</TableCell>
                <TableCell>12.345.678-9</TableCell>
                <TableCell>+56 9 1234 5678</TableCell>
                <TableCell>Ver</TableCell>
            </TableRow>
            </TableBody>
        </Table>
    </div>
    </div>
  )
}

export default Clientes