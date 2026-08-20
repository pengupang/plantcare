import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardTitle} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
function Mediciones() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mediciones</h1>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">Seleccionar cliente</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>Juan Pérez</DropdownMenuItem>
                <DropdownMenuItem>María González</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="outline">Seleccionar Terreno</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuItem>papas</DropdownMenuItem>
            <DropdownMenuItem>Maiz</DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <Card>
            <CardTitle className="p-4">
                Nitrógeno
            </CardTitle>
            <CardContent>
                n/a
            </CardContent>
        </Card>
        <Card>
            <CardTitle className="p-4">
                Fósforo
            </CardTitle>
            <CardContent>
                n/a
            </CardContent>
        </Card>
        <Card>
            <CardTitle className="p-4">
                Potasio
            </CardTitle>
            <CardContent>
                n/a
            </CardContent>
        </Card>
        <Card>
            <CardTitle className="p-4">
                pH
            </CardTitle>
            <CardContent>
                n/a
            </CardContent>
        </Card>
        <Card>
            <CardTitle className="p-4">
                Humedad
            </CardTitle>
            <CardContent>
                n/a
            </CardContent>
        </Card>
        <Card>
            <CardTitle className="p-4">
                Temperatura
            </CardTitle>
            <CardContent>
                n/a
            </CardContent>
        </Card>

    </div>
    <div className="flex flex-col gap-4 mt-4">
        <Input type="text" placeholder="Observaciones" className="h-11 rounded-lg border border-gray-300 p-2"/>
        <Button className="bg-green-500 text-slate-50 p-2">Guardar</Button>

    </div>
    </div>
  )
}

export default Mediciones