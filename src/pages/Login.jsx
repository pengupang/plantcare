import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function Login (){
    return(
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col gap-4 bg-white p-8 rounded-lg shadow-md w-80">
            <h1 className="text-2xl font-bold">PlantCare</h1>
            <p>Inicia sesión</p>
            <Input type="email" placeholder="Email" className="h-11 rounded-lg border border-gray-300 p-2"/>
            <Input type="password" placeholder="Contraseña" className="h-11 rounded-lg border border-gray-300 p-2"/>
            <Button className="bg-green-500 text-slate-50 p-2">Entrar</Button>
        </div>
    </div>
    )
}

export default Login