
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LoginPage = () => {
  // Login state
  const [loginName, setLoginName] = useState('');
  
  // Registration state
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('spectator');
  const [bandId, setBandId] = useState('');
  const [instrument, setInstrument] = useState('');
  const [section, setSection] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast.error('Please enter your name');
      return;
    }
    
    // For demo purposes only - in a real app, this would involve proper authentication
    const userData = {
      id: Date.now().toString(),
      name,
      role,
      ...(role !== 'spectator' && { bandId, instrument, section }),
    };
    
    login(userData);
    toast.success(`Welcome, ${name}! Your account has been created.`);
    navigate('/schedule');
  };
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginName) {
      toast.error('Please enter your name');
      return;
    }
    
    // Quick login for demo purposes
    const userData = {
      id: Date.now().toString(),
      name: loginName,
      role: 'spectator' as UserRole,
    };
    
    login(userData);
    toast.success(`Welcome back, ${loginName}!`);
    navigate('/schedule');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-navy-900 to-navy-800 p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Performance Coordinator</h1>
          <p className="text-gold-500">Your ultimate event management companion</p>
        </div>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Enter your name to access the app</CardDescription>
              </CardHeader>
              
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="loginName">Name</Label>
                    <Input 
                      id="loginName" 
                      placeholder="Enter your name" 
                      value={loginName}
                      onChange={(e) => setLoginName(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                    Login
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="signup">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>Create a new account</CardDescription>
              </CardHeader>
              
              <form onSubmit={handleSignUp}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name" 
                      placeholder="Enter your name" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Select your role</Label>
                    <RadioGroup 
                      value={role} 
                      onValueChange={(value) => setRole(value as UserRole)}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="spectator" id="spectator" />
                        <Label htmlFor="spectator" className="cursor-pointer">Spectator</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="performer" id="performer" />
                        <Label htmlFor="performer" className="cursor-pointer">Performer</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="organizer" id="organizer" />
                        <Label htmlFor="organizer" className="cursor-pointer">Event Organizer</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {role !== 'spectator' && (
                    <div className="space-y-4 border-t pt-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="bandId">Band/Organization</Label>
                        <Input 
                          id="bandId" 
                          placeholder="Your band or organization name" 
                          value={bandId}
                          onChange={(e) => setBandId(e.target.value)}
                        />
                      </div>
                      
                      {role === 'performer' && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="instrument">Instrument</Label>
                            <Input 
                              id="instrument" 
                              placeholder="What instrument do you play?" 
                              value={instrument}
                              onChange={(e) => setInstrument(e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="section">Section</Label>
                            <Input 
                              id="section" 
                              placeholder="Your section (e.g., Brass, Percussion)" 
                              value={section}
                              onChange={(e) => setSection(e.target.value)}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </CardContent>
                
                <CardFooter>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                    Sign Up
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LoginPage;
