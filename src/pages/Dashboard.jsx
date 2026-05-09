import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Card,CardTitle, CardContent } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Button } from "@/components/ui/button"

function Dashboard (){
    const datos = [
  { fecha: "01/05", valor: 45 },
  { fecha: "02/05", valor: 52 },
  { fecha: "03/05", valor: 48 },
  { fecha: "04/05", valor: 61 },
]
    return(
        <div className="min-h-screen bg-gray-100 p-8">
        <div className="flex justify-between items-center mb-6 ">
        <h1 className="text-2xl font-bold">Dashboard</h1>
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
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h2 className="text-lg font-bold mb-4">Historial de mediciones</h2>
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={datos}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="valor" stroke="#22c55e" />
            </LineChart>
        </ResponsiveContainer>
        </div>
</div>
    )
}

export default Dashboard