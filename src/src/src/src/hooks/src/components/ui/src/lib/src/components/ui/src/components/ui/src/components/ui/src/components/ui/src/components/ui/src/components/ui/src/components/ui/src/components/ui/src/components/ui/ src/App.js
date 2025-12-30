import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { createClient } from '@supabase/supabase-js';
import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./components/ui/dialog";
import { Textarea } from "./components/ui/textarea";
import { Badge } from "./components/ui/badge";
import { Separator } from "./components/ui/separator";
import { Toaster } from "./components/ui/toaster";
import { toast } from "./hooks/use-toast";
import { Heart, Gift, Share2, ShoppingBag, Plus, Edit, Trash2, LogOut, Users, Calendar } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import "./App.css";

const supabaseUrl = 'https://rdgluzubmhhgbgogvapy.supabase.co';
const supabaseKey = 'sb_publishable_4NO0O7CXQ31ZkPWVqVfqAA_gW5F_h2A';
const supabase = createClient(supabaseUrl, supabaseKey);

const hashPassword = async (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

const HomePage = ({ gifts, onSelectGift }) => {
  const [showGiftSelection, setShowGiftSelection] = useState(null);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    fetchSiteSettings();
  }, []);

  const fetchSiteSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching site settings:', error);
        return;
      }
      
      setSiteSettings(data || {
        couple_photo_url: "https://images.unsplash.com/photo-1724812773350-a7d0bf664417"
      });
    } catch (error) {
      console.error('Error fetching site settings:', error);
    }
  };

  const handleSelectGift = async (giftId) => {
    if (!guestName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe seu nome",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('gifts')
        .update({
          is_selected: true,
          selected_by_name: guestName,
          selected_by_email: guestEmail || null,
          selected_at: new Date().toISOString()
        })
        .eq('id', giftId)
        .eq('is_selected', false);
      
      if (error) throw error;
      
      setShowGiftSelection(null);
      setShowThankYou(true);
      onSelectGift();
      
      setTimeout(() => {
        setShowThankYou(false);
        setGuestName("");
        setGuestEmail("");
      }, 5000);
    } catch (error) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao selecionar presente",
        variant: "destructive"
      });
    }
  };

  const shareWhatsApp = () => {
    const message = "Olha que legal! Lista de presentes do Guilherme & Elizabeth 💍";
    const url = window.location.href;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message + " " + url)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (showThankYou) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100">
        <Card className="w-full max-w-2xl mx-4 text-center border-rose-200 shadow-xl">
          <CardContent className="p-12">
            <div className="mb-6">
              <Heart className="w-16 h-16 text-rose-500 mx-auto mb-4 animate-pulse" />
              <h2 className="text-3xl font-serif text-rose-800 mb-4">Muito Obrigado! 💕</h2>
              <p className="text-lg text-rose-600 leading-relaxed">
                Obrigado por compartilhar esse momento especial com a gente!
              </p>
              <p className="text-rose-500 font-medium mt-2">– Guilherme & Elizabeth</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100">
      <div className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <img 
              src={siteSettings?.couple_photo_url || "https://images.unsplash.com/photo-1724812773350-a7d0bf664417"}
              alt="Guilherme & Elizabeth"
              className="w-80 h-80 rounded-full mx-auto object-cover shadow-2xl border-8 border-white"
            />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-serif text-rose-800 mb-6">
            Lista de Presentes
          </h1>
          <h2 className="text-3xl md:text-4xl font-serif text-rose-600 mb-8">
            Guilherme & Elizabeth 💍
          </h2>
          
          <p className="text-xl text-rose-700 max-w-2xl mx-auto leading-relaxed mb-12">
            Estamos muito felizes em compartilhar este momento especial com vocês. 
            Escolham um presente que nos ajudará a construir nosso lar com muito amor.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              onClick={shareWhatsApp}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
            >
              <Share2 className="mr-2 h-5 w-5" />
              Compartilhar no WhatsApp
            </Button>
          </div>
        </div>
      </div>

      <div className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Gift className="w-12 h-12 text-rose-600 mx-auto mb-4" />
            <h3 className="text-4xl font-serif text-rose-800 mb-4">Nossa Lista de Presentes</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gifts.map((gift) => (
              <Card key={gift.id} className="group hover:shadow-xl transition-all duration-300 border-rose-200 bg-white/80">
                <div className="relative overflow-hidden">
                  <img 
                    src={gift.image_url} 
                    alt={gift.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-rose-600 text-white">
                      R$ {gift.price.toFixed(2).replace('.', ',')}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-rose-800 font-serif text-xl">{gift.name}</CardTitle>
                  <CardDescription className="text-rose-600">
                    {gift.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex gap-2 flex-wrap">
                    <Dialog open={showGiftSelection === gift.id} onOpenChange={(open) => setShowGiftSelection(open ? gift.id : null)}>
                      <DialogTrigger asChild>
                        <Button className="flex-1 bg-rose-600 hover:bg-rose-700 text-white">
                          <Heart className="mr-2 h-4 w-4" />
                          Escolher este presente
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-rose-800">Escolher Presente</DialogTitle>
                          <DialogDescription>
                            Você está escolhendo: <strong>{gift.name}</strong>
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Seu nome *</Label>
                            <Input 
                              value={guestName}
                              onChange={(e) => setGuestName(e.target.value)}
                              placeholder="Digite seu nome"
                            />
                          </div>
                          <div>
                            <Label>Seu e-mail (opcional)</Label>
                            <Input 
                              type="email"
                              value={guestEmail}
                              onChange={(e) => setGuestEmail(e.target.value)}
                              placeholder="seuemail@exemplo.com"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={() => handleSelectGift(gift.id)} className="bg-rose-600 hover:bg-rose-700">
                            Confirmar Escolha
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(gift.product_link, '_blank')}
                      className="border-rose-300 text-rose-700 hover:bg-rose-50"
                    >
                      Ver Produto
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {gifts.length === 0 && (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-rose-300 mx-auto mb-4" />
              <p className="text-xl text-rose-600">Em breve, novos presentes serão adicionados!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
const AdminPanel = ({ onLogout }) => {
  const [gifts, setGifts] = useState([]);
  const [showAddGift, setShowAddGift] = useState(false);
  const [showSelectedGifts, setShowSelectedGifts] = useState(false);
  const [selectedGifts, setSelectedGifts] = useState([]);
  const [editingGift, setEditingGift] = useState(null);
  const [giftForm, setGiftForm] = useState({
    name: "",
    description: "",
    image_url: "",
    product_link: "",
    price: ""
  });

  useEffect(() => {
    fetchAllGifts();
  }, []);

  const fetchAllGifts = async () => {
    try {
      const { data, error } = await supabase
        .from('gifts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setGifts(data || []);
      const selected = (data || []).filter(gift => gift.is_selected);
      setSelectedGifts(selected);
    } catch (error) {
      console.error('Error fetching gifts:', error);
    }
  };

  const handleSubmitGift = async (e) => {
    e.preventDefault();
    
    try {
      const giftData = {
        ...giftForm,
        price: parseFloat(giftForm.price)
      };

      if (editingGift) {
        const { error } = await supabase
          .from('gifts')
          .update(giftData)
          .eq('id', editingGift.id);
        
        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Presente atualizado com sucesso"
        });
      } else {
        const { error } = await supabase
          .from('gifts')
          .insert([{ ...giftData, id: uuidv4() }]);
        
        if (error) throw error;
        
        toast({
          title: "Sucesso", 
          description: "Presente adicionado com sucesso"
        });
      }
      
      setGiftForm({ name: "", description: "", image_url: "", product_link: "", price: "" });
      setShowAddGift(false);
      setEditingGift(null);
      fetchAllGifts();
    } catch (error) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar presente",
        variant: "destructive"
      });
    }
  };

  const handleDeleteGift = async (giftId) => {
    if (window.confirm("Tem certeza que deseja excluir este presente?")) {
      try {
        const { error } = await supabase
          .from('gifts')
          .delete()
          .eq('id', giftId);
        
        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Presente removido com sucesso"
        });
        fetchAllGifts();
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao remover presente",
          variant: "destructive"
        });
      }
    }
  };

  const handleResetGift = async (giftId) => {
    try {
      const { error } = await supabase
        .from('gifts')
        .update({
          is_selected: false,
          selected_by_name: null,
          selected_by_email: null,
          selected_at: null
        })
        .eq('id', giftId);
      
      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Presente foi tornado disponível novamente"
      });
      fetchAllGifts();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao resetar presente",
        variant: "destructive"
      });
    }
  };

  const startEdit = (gift) => {
    setEditingGift(gift);
    setGiftForm({
      name: gift.name,
      description: gift.description,
      image_url: gift.image_url,
      product_link: gift.product_link,
      price: gift.price.toString()
    });
    setShowAddGift(true);
  };

  const resetForm = () => {
    setGiftForm({ name: "", description: "", image_url: "", product_link: "", price: "" });
    setEditingGift(null);
    setShowAddGift(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-serif text-rose-800">Painel Administrativo</h1>
            <p className="text-rose-600">Gerenciar lista de presentes</p>
          </div>
          <div className="flex gap-4 flex-wrap">
            <Dialog open={showSelectedGifts} onOpenChange={setShowSelectedGifts}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-rose-300 text-rose-700">
                  <Users className="mr-2 h-4 w-4" />
                  Ver Presentes Escolhidos ({selectedGifts.length})
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-4xl">
                <DialogHeader>
                  <DialogTitle className="text-rose-800">Relatório de Presentes Escolhidos</DialogTitle>
                </DialogHeader>
                <div className="max-h-96 overflow-y-auto">
                  {selectedGifts.length === 0 ? (
                    <div className="text-center py-8">
                      <Gift className="w-12 h-12 text-rose-300 mx-auto mb-4" />
                      <p className="text-rose-600">Nenhum presente foi escolhido ainda</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedGifts.map((gift) => (
                        <Card key={gift.id} className="border-rose-200">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <img 
                                src={gift.image_url} 
                                alt={gift.name}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <h4 className="font-semibold text-rose-800">{gift.name}</h4>
                                <p className="text-sm text-rose-600 mb-2">R$ {gift.price.toFixed(2).replace('.', ',')}</p>
                                <div className="flex items-center gap-4 text-sm">
                                  <span className="font-medium">{gift.selected_by_name}</span>
                                  {gift.selected_by_email && <span className="text-rose-600">{gift.selected_by_email}</span>}
                                  <span className="text-rose-500">
                                    {new Date(gift.selected_at).toLocaleDateString('pt-BR')}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog open={showAddGift} onOpenChange={(open) => open ? setShowAddGift(true) : resetForm()}>
              <DialogTrigger asChild>
                <Button className="bg-rose-600 hover:bg-rose-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Presente
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingGift ? 'Editar' : 'Adicionar'} Presente</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmitGift} className="space-y-4">
                  <div>
                    <Label>Nome do Presente</Label>
                    <Input 
                      value={giftForm.name}
                      onChange={(e) => setGiftForm({...giftForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label>Descrição</Label>
                    <Textarea 
                      value={giftForm.description}
                      onChange={(e) => setGiftForm({...giftForm, description: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label>URL da Imagem</Label>
                    <Input 
                      value={giftForm.image_url}
                      onChange={(e) => setGiftForm({...giftForm, image_url: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label>Link do Produto</Label>
                    <Input 
                      value={giftForm.product_link}
                      onChange={(e) => setGiftForm({...giftForm, product_link: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label>Preço (R$)</Label>
                    <Input 
                      type="number"
                      step="0.01"
                      value={giftForm.price}
                      onChange={(e) => setGiftForm({...giftForm, price: e.target.value})}
                      required
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="bg-rose-600 hover:bg-rose-700">
                      {editingGift ? 'Atualizar' : 'Adicionar'} Presente
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" onClick={onLogout} className="border-rose-300 text-rose-700">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gifts.map((gift) => (
            <Card key={gift.id} className="bg-white/80 border-rose-200">
              <div className="relative">
                <img 
                  src={gift.image_url} 
                  alt={gift.name}
                  className="w-full h-48 object-cover"
                />
                {gift.is_selected && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-green-600">
                      Escolhido por {gift.selected_by_name}
                    </Badge>
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <Badge className="bg-rose-600 text-white">
                    R$ {gift.price.toFixed(2).replace('.', ',')}
                  </Badge>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="text-rose-800 font-serif">{gift.name}</CardTitle>
                <CardDescription className="text-rose-600">{gift.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => startEdit(gift)}
                    className="flex-1"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                  {gift.is_selected && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleResetGift(gift.id)}
                      className="text-orange-600 hover:bg-orange-50"
                    >
                      <Gift className="mr-2 h-4 w-4" />
                      Tornar Disponível
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteGift(gift.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

const LoginPage = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isLogin) {
        const { data: admin, error } = await supabase
          .from('admins')
          .select('*')
          .eq('email', email)
          .single();
        
        if (error) throw new Error('Credenciais inválidas');
        
        const hashedPassword = await hashPassword(password);
        if (admin.password_hash !== hashedPassword) {
          throw new Error('Credenciais inválidas');
        }
        
        localStorage.setItem('adminToken', 'authenticated');
        localStorage.setItem('adminEmail', admin.email);
        
        toast({
          title: "Sucesso",
          description: "Login realizado com sucesso"
        });
        
        onLogin({ email: admin.email });
      } else {
        const hashedPassword = await hashPassword(password);
        
        const { error } = await supabase
          .from('admins')
          .insert([{
            email,
            password_hash: hashedPassword
          }]);
        
        if (error) {
          if (error.code === '23505') {
            throw new Error('Admin já existe');
          }
          throw error;
        }
        
        localStorage.setItem('adminToken', 'authenticated');
        localStorage.setItem('adminEmail', email);
        
        toast({
          title: "Sucesso",
          description: "Conta criada com sucesso"
        });
        
        onLogin({ email });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: error.message || "Erro na autenticação",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100">
      <Card className="w-full max-w-md mx-4 border-rose-200 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-serif text-rose-800">
            {isLogin ? 'Login' : 'Cadastro'} Administrativo
          </CardTitle>
          <CardDescription className="text-rose-600">
            Lista de Presentes - Guilherme & Elizabeth 💍
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>E-mail</Label>
              <Input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label>Senha</Label>
              <Input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700">
              {isLogin ? 'Entrar' : 'Criar Conta'}
            </Button>
          </form>
          
          <Separator className="my-4" />
          
          <Button 
            variant="outline" 
            onClick={() => setIsLogin(!isLogin)}
            className="w-full border-rose-300 text-rose-700"
          >
            {isLogin ? 'Criar conta administrativa' : 'Já tenho conta'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

function App() {
  const [admin, setAdmin] = useState(null);
  const [gifts, setGifts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const email = localStorage.getItem('adminEmail');
    if (token && email) {
      setAdmin({ token, email });
    }

    fetchAvailableGifts();
  }, []);

  const fetchAvailableGifts = async () => {
    try {
      const { data, error } = await supabase
        .from('gifts')
        .select('*')
        .eq('is_selected', false)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setGifts(data || []);
    } catch (error) {
      console.error('Error fetching gifts:', error);
    }
  };

  const handleLogin = (adminData) => {
    setAdmin(adminData);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    setAdmin(null);
  };

  const handleGiftSelection = () => {
    fetchAvailableGifts();
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={<HomePage gifts={gifts} onSelectGift={handleGiftSelection} />} 
          />
          <Route 
            path="/admin" 
            element={admin ? <AdminPanel onLogout={handleLogout} /> : <LoginPage onLogin={handleLogin} />} 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;
