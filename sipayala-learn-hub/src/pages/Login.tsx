 import { Link } from "react-router-dom";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { GraduationCap } from "lucide-react";
 
 const Login = () => (
   <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
     <div className="w-full max-w-md bg-card rounded-2xl shadow-xl p-8">
       <Link to="/" className="flex items-center justify-center gap-2 mb-8">
         <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center"><GraduationCap className="w-6 h-6 text-primary-foreground" /></div>
         <span className="font-display font-bold text-xl">Sipayala Info Tech</span>
       </Link>
       <h1 className="text-2xl font-bold text-center mb-6">Welcome Back</h1>
       <form className="space-y-4">
         <Input type="email" placeholder="Email Address" />
         <Input type="password" placeholder="Password" />
         <Button className="w-full shadow-primary">Sign In</Button>
       </form>
       <p className="text-center text-muted-foreground mt-6">Don't have an account? <Link to="/register" className="text-primary font-medium">Sign Up</Link></p>
     </div>
   </div>
 );
 
 export default Login;