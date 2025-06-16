"use client";

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Button, 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell,
  Chip,
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Tabs,
  Tab,
  Avatar,
  Tooltip,
  Input,
  Spinner,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection
} from "@heroui/react";
import { 
  Users, 
  UserCheck, 
  UserX, 
  Trash2, 
  Eye, 
  Search,
  Crown,
  Shield,
  Activity,
  Database,
  AlertTriangle,
  CheckCircle,
  LogOut,
  Settings,
  ChevronDown,
  TrendingUp,
  Zap,
  Star
} from "lucide-react";
import { superAdminService } from "@/services/super-admin.service";
import { DeactivatedUser, ClinicOwner } from "@/types/auth";
import { SuperAdminOnly } from "@/guard/RoleGuard";
import { useAuth } from "@/context/AuthContext";

interface UserAction {
  user: DeactivatedUser | ClinicOwner | null;
  action: 'activate' | 'deactivate' | 'delete' | 'view';
}

export default function SuperDashboard() {
  const { user, logout } = useAuth();
  const [deactivatedUsers, setDeactivatedUsers] = useState<DeactivatedUser[]>([]);
  const [clinicOwners, setClinicOwners] = useState<ClinicOwner[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("overview");
  
  // Pagination states
  const [deactivatedPage, setDeactivatedPage] = useState(1);
  const [ownersPage, setOwnersPage] = useState(1);
  const [deactivatedTotal, setDeactivatedTotal] = useState(0);
  const [ownersTotal, setOwnersTotal] = useState(0);
  const limit = 10;

  // Modal states
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userAction, setUserAction] = useState<UserAction>({ user: null, action: 'view' });
  const [userDetails, setUserDetails] = useState<any>(null);
  

  // Search states
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadData();
  }, [deactivatedPage, ownersPage]);

  const handleLogout = async () => {
    try {
      await logout();
      // El redirect se maneja automáticamente en el AuthContext
    } catch (error) {
      console.error('Error during logout:', error);
      alert('Error al cerrar sesión');
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [deactivatedResponse, ownersResponse] = await Promise.all([
        superAdminService.getDeactivatedUsers(deactivatedPage, limit),
        superAdminService.getClinicOwners(ownersPage, limit)
      ]);

      setDeactivatedUsers(deactivatedResponse.data?.data?.result || []);
      setDeactivatedTotal(deactivatedResponse.data?.data?.total || 0);
      
      setClinicOwners(ownersResponse.data?.data?.result || []);
      setOwnersTotal(ownersResponse.data?.data?.total || 0);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Error al cargar los datos');
      // Set empty arrays on error to prevent filter errors
      setDeactivatedUsers([]);
      setClinicOwners([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (user: DeactivatedUser | ClinicOwner, action: 'activate' | 'deactivate' | 'delete' | 'view') => {
    setUserAction({ user, action });
    
    if (action === 'view') {
      try {
        const response = await superAdminService.getUserDetails(user.id);
        setUserDetails(response.data || response);
      } catch (error) {
        console.error('Error fetching user details:', error);
        alert('Error al obtener detalles del usuario');
        return;
      }
    }
    
    onOpen();
  };

  const executeAction = async () => {
    if (!userAction.user) return;

    try {
      setLoading(true);
      
      switch (userAction.action) {
        case 'activate':
          await superAdminService.reactivateUser(userAction.user.id);
          alert('Usuario activado correctamente');
          break;
        case 'deactivate':
          await superAdminService.deactivateUser(userAction.user.id);
          alert('Usuario desactivado correctamente');
          break;
        case 'delete':
          await superAdminService.deleteUser(userAction.user.id);
          alert('Usuario eliminado correctamente');
          break;
      }
      
      loadData();
      onClose();
    } catch (error) {
      console.error('Error executing action:', error);
      alert('Error al ejecutar la acción');
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string): "primary" | "success" | "warning" | "secondary" | "default" | "danger" => {
    const colors: Record<string, "primary" | "success" | "warning" | "secondary" | "default" | "danger"> = {
      patient: 'primary',
      physician: 'success', 
      owner: 'warning',
      receptionist: 'secondary',
      lab_technician: 'default'
    };
    return colors[role] || 'default';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredDeactivatedUsers = (deactivatedUsers || []).filter(user => {
    return user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           user.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const filteredClinicOwners = (clinicOwners || []).filter(owner => {
    return owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           owner.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading && deactivatedUsers.length === 0 && clinicOwners.length === 0) {
    return (
      <SuperAdminOnly fallback={<div className="p-6 text-center">No tienes permisos para acceder a esta sección</div>}>
        <div className="flex items-center justify-center h-screen">
          <Spinner
            classNames={{ label: "text-foreground mt-4" }}
            label="Cargando Super Dashboard..."
            variant="wave"
          />
        </div>
      </SuperAdminOnly>
    );
  }

  return (
    <SuperAdminOnly fallback={<div className="p-6 text-center">No tienes permisos para acceder a esta sección</div>}>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 dark:from-purple-800 dark:via-blue-800 dark:to-indigo-800">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="relative px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg">
                  <Crown className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    Super Dashboard
                  </h1>
                  <p className="text-blue-100 text-lg flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Panel de administración central del sistema
                  </p>
                </div>
              </div>
              
              {/* User Dropdown */}
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-3 text-white/90">
                  <Star className="h-5 w-5 text-yellow-300" />
                  <span className="text-sm font-medium">Super Administrador</span>
                </div>
                
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <Button 
                      variant="light" 
                      className="h-auto p-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar 
                          size="sm" 
                          name={user?.name || "Super Admin"} 
                          className="ring-2 ring-white/30"
                        />
                        <div className="hidden sm:block text-left">
                          <p className="text-white font-semibold text-sm">{user?.name || "Super Admin"}</p>
                          <p className="text-blue-100 text-xs">{user?.email}</p>
                        </div>
                        <ChevronDown className="h-4 w-4 text-white/70" />
                      </div>
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu 
                    aria-label="User Actions"
                    className="w-64"
                    classNames={{
                      base: "bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700",
                    }}
                  >
                    <DropdownSection title="Cuenta" showDivider>
                      <DropdownItem 
                        key="profile" 
                        startContent={<Settings className="h-4 w-4" />}
                        className="text-gray-700 dark:text-gray-300"
                      >
                        Mi Perfil
                      </DropdownItem>
                    </DropdownSection>
                    <DropdownSection title="Sesión">
                      <DropdownItem 
                        key="logout" 
                        color="danger"
                        startContent={<LogOut className="h-4 w-4" />}
                        onPress={handleLogout}
                        className="text-danger"
                      >
                        Cerrar Sesión
                      </DropdownItem>
                    </DropdownSection>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 -mt-4 relative z-10">

        {/* Enhanced Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-600 dark:text-red-400 text-sm font-medium mb-1">Usuarios Desactivados</p>
                  <p className="text-3xl font-bold text-red-700 dark:text-red-300">{deactivatedTotal}</p>
                  <p className="text-xs text-red-500 dark:text-red-400 mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Requiere atención
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl shadow-lg">
                  <UserX className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-600 dark:text-amber-400 text-sm font-medium mb-1">Creadores de Clínicas</p>
                  <p className="text-3xl font-bold text-amber-700 dark:text-amber-300">{ownersTotal}</p>
                  <p className="text-xs text-amber-500 dark:text-amber-400 mt-1 flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Clínicas activas
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-1">Sistema Activo</p>
                  <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">Online</p>
                  <p className="text-xs text-emerald-500 dark:text-emerald-400 mt-1 flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    100% operativo
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-lg">
                  <Activity className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-1">Gestión Total</p>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">Completa</p>
                  <p className="text-xs text-blue-500 dark:text-blue-400 mt-1 flex items-center gap-1">
                    <Database className="h-3 w-3" />
                    Control total
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl shadow-lg">
                  <Database className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Enhanced Main Content */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-none shadow-xl">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg shadow-lg">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Gestión de Sistema</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Control centralizado de usuarios y clínicas</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Input
                  placeholder="Buscar usuarios..."
                  startContent={<Search className="h-4 w-4 text-gray-400" />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-72"
                  classNames={{
                    base: "bg-white dark:bg-gray-700",
                    input: "text-gray-700 dark:text-gray-200",
                    inputWrapper: "bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 shadow-sm hover:border-purple-400 dark:hover:border-purple-500"
                  }}
                />
              </div>
            </div>
          </CardHeader>
          <CardBody className="p-6 bg-white dark:bg-gray-800">
            <Tabs 
              selectedKey={selectedTab} 
              onSelectionChange={(key) => setSelectedTab(key as string)}
              classNames={{
                base: "w-full",
                tabList: "gap-6 w-full relative rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 p-1",
                cursor: "w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg",
                tab: "max-w-fit px-6 py-3 h-12 font-medium",
                tabContent: "group-data-[selected=true]:text-purple-600 dark:group-data-[selected=true]:text-purple-400 text-gray-600 dark:text-gray-400"
              }}
              variant="solid"
              color="primary"
            >
              <Tab 
                key="overview" 
                title={
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>Resumen</span>
                  </div>
                }
              >
                                  <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/10 dark:to-pink-900/10 border border-red-200 dark:border-red-800 shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardHeader className="pb-3">
                        <h3 className="text-lg font-bold flex items-center gap-2 text-red-700 dark:text-red-300">
                          <div className="p-2 bg-red-500 rounded-lg shadow-md">
                            <UserX className="h-5 w-5 text-white" />
                          </div>
                          Usuarios Desactivados Recientes
                        </h3>
                      </CardHeader>
                      <CardBody>
                        <div className="space-y-2">
                          {filteredDeactivatedUsers.slice(0, 5).map((user) => (
                            <div key={user.id} className="flex items-center justify-between p-2 bg-default-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <Avatar size="sm" name={user.name} />
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-sm text-default-600">{user.email}</p>
                                </div>
                              </div>
                              <Chip color={getRoleColor(user.role)} size="sm">
                                {user.role}
                              </Chip>
                            </div>
                          ))}
                          {filteredDeactivatedUsers.length === 0 && !loading && (
                            <p className="text-center text-default-500 py-4">No hay usuarios desactivados</p>
                          )}
                        </div>
                      </CardBody>
                    </Card>

                    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-200 dark:border-amber-800 shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardHeader className="pb-3">
                        <h3 className="text-lg font-bold flex items-center gap-2 text-amber-700 dark:text-amber-300">
                          <div className="p-2 bg-amber-500 rounded-lg shadow-md">
                            <Shield className="h-5 w-5 text-white" />
                          </div>
                          Creadores de Clínicas
                        </h3>
                      </CardHeader>
                      <CardBody>
                        <div className="space-y-2">
                          {filteredClinicOwners.slice(0, 5).map((owner) => (
                            <div key={owner.id} className="flex items-center justify-between p-2 bg-default-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <Avatar size="sm" name={owner.name} />
                                <div>
                                  <p className="font-medium">{owner.name}</p>
                                  <p className="text-sm text-default-600">{owner.email}</p>
                                </div>
                              </div>
                              <Chip 
                                color={owner.status ? "success" : "danger"} 
                                size="sm"
                                startContent={owner.status ? <CheckCircle className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                              >
                                {owner.status ? 'Activo' : 'Inactivo'}
                              </Chip>
                            </div>
                          ))}
                          {filteredClinicOwners.length === 0 && !loading && (
                            <p className="text-center text-default-500 py-4">No hay creadores de clínicas</p>
                          )}
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                </div>
              </Tab>

              <Tab 
                key="deactivated" 
                title={
                  <div className="flex items-center space-x-2">
                    <UserX className="h-4 w-4" />
                    <span>Usuarios Desactivados</span>
                    <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs px-2 py-1 rounded-full font-semibold">
                      {deactivatedTotal}
                    </span>
                  </div>
                }
              >
                <div className="space-y-4">
                  <Table aria-label="Usuarios desactivados">
                    <TableHeader>
                      <TableColumn>USUARIO</TableColumn>
                      <TableColumn>ROL</TableColumn>
                      <TableColumn>CONTACTO</TableColumn>
                      <TableColumn>ÚLTIMA CONEXIÓN</TableColumn>
                      <TableColumn>ACCIONES</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {filteredDeactivatedUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar size="sm" name={user.name} />
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-default-600">{user.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Chip color={getRoleColor(user.role)} size="sm">
                              {user.role}
                            </Chip>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm">{user.phone}</p>
                              <p className="text-xs text-default-600">{user.document_number}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">{formatDate(user.last_login)}</p>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Tooltip content="Ver detalles">
                                <Button
                                  isIconOnly
                                  size="sm"
                                  variant="light"
                                  onPress={() => handleUserAction(user, 'view')}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Tooltip>
                              <Tooltip content="Activar usuario" color="success">
                                <Button
                                  isIconOnly
                                  size="sm"
                                  color="success"
                                  variant="light"
                                  onPress={() => handleUserAction(user, 'activate')}
                                >
                                  <UserCheck className="h-4 w-4" />
                                </Button>
                              </Tooltip>
                              <Tooltip content="Eliminar usuario" color="danger">
                                <Button
                                  isIconOnly
                                  size="sm"
                                  color="danger"
                                  variant="light"
                                  onPress={() => handleUserAction(user, 'delete')}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </Tooltip>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {Math.ceil(deactivatedTotal / limit) > 1 && (
                    <div className="flex justify-center">
                      <Pagination
                        total={Math.ceil(deactivatedTotal / limit)}
                        page={deactivatedPage}
                        onChange={setDeactivatedPage}
                      />
                    </div>
                  )}
                </div>
              </Tab>

              <Tab 
                key="clinic-owners" 
                title={
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Creadores de Clínicas</span>
                    <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs px-2 py-1 rounded-full font-semibold">
                      {ownersTotal}
                    </span>
                  </div>
                }
              >
                <div className="space-y-4">
                  <Table aria-label="Creadores de clínicas">
                    <TableHeader>
                      <TableColumn>PROPIETARIO</TableColumn>
                      <TableColumn>CLÍNICA</TableColumn>
                      <TableColumn>CONTACTO</TableColumn>
                      <TableColumn>ESTADO</TableColumn>
                      <TableColumn>ÚLTIMA CONEXIÓN</TableColumn>
                      <TableColumn>ACCIONES</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {filteredClinicOwners.map((owner) => (
                        <TableRow key={owner.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar size="sm" name={owner.name} />
                              <div>
                                <p className="font-medium">{owner.name}</p>
                                <p className="text-sm text-default-600">{owner.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm font-medium">ID: {owner.clinic_id}</p>
                              <p className="text-xs text-default-600">Owner ID: {owner.clinic_owner_id}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm">{owner.phone}</p>
                              <p className="text-xs text-default-600">{owner.document_number}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              color={owner.status ? "success" : "danger"} 
                              size="sm"
                              startContent={owner.status ? <CheckCircle className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                            >
                              {owner.status ? 'Activo' : 'Inactivo'}
                            </Chip>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">{formatDate(owner.last_login)}</p>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Tooltip content="Ver detalles">
                                <Button
                                  isIconOnly
                                  size="sm"
                                  variant="light"
                                  onPress={() => handleUserAction(owner, 'view')}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Tooltip>
                              {!owner.status ? (
                                <Tooltip content="Activar cuenta" color="success">
                                  <Button
                                    isIconOnly
                                    size="sm"
                                    color="success"
                                    variant="light"
                                    onPress={() => handleUserAction(owner, 'activate')}
                                  >
                                    <UserCheck className="h-4 w-4" />
                                  </Button>
                                </Tooltip>
                              ) : (
                                <Tooltip content="Desactivar cuenta" color="warning">
                                  <Button
                                    isIconOnly
                                    size="sm"
                                    color="warning"
                                    variant="light"
                                    onPress={() => handleUserAction(owner, 'deactivate')}
                                  >
                                    <UserX className="h-4 w-4" />
                                  </Button>
                                </Tooltip>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {Math.ceil(ownersTotal / limit) > 1 && (
                    <div className="flex justify-center">
                      <Pagination
                        total={Math.ceil(ownersTotal / limit)}
                        page={ownersPage}
                        onChange={setOwnersPage}
                      />
                    </div>
                  )}
                </div>
              </Tab>
            </Tabs>
          </CardBody>
        </Card>

        {/* Action Modal */}
        <Modal 
          isOpen={isOpen} 
          onClose={onClose}
          size={userAction.action === 'view' ? '2xl' : 'md'}
          backdrop="opaque"
          classNames={{
            base: "bg-white dark:bg-gray-900",
            backdrop: "bg-black/50",
            header: "border-b border-gray-200 dark:border-gray-700",
            body: "bg-white dark:bg-gray-900",
            footer: "border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
          }}
        >
          <ModalContent className="bg-white dark:bg-gray-900">
            <ModalHeader className="flex flex-col gap-1 text-gray-900 dark:text-white bg-white dark:bg-gray-900">
              {userAction.action === 'view' && 'Detalles del Usuario'}
              {userAction.action === 'activate' && 'Activar Usuario'}
              {userAction.action === 'deactivate' && 'Desactivar Usuario'}
              {userAction.action === 'delete' && 'Eliminar Usuario'}
            </ModalHeader>
            <ModalBody className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
              {userAction.action === 'view' && userDetails && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar size="lg" name={userDetails.name} />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{userDetails.name}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{userDetails.email}</p>
                      <Chip color={getRoleColor(userDetails.role)} size="sm">
                        {userDetails.role}
                      </Chip>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Teléfono</p>
                      <p className="text-gray-900 dark:text-white">{userDetails.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Documento</p>
                      <p className="text-gray-900 dark:text-white">{userDetails.document_number}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Género</p>
                      <p className="text-gray-900 dark:text-white">{userDetails.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Estado</p>
                      <Chip color={userDetails.status ? "success" : "danger"} size="sm">
                        {userDetails.status ? 'Activo' : 'Inactivo'}
                      </Chip>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Última Conexión</p>
                      <p className="text-gray-900 dark:text-white">{formatDate(userDetails.last_login)}</p>
                    </div>
                    {userDetails.clinic_id && (
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">ID Clínica</p>
                        <p className="text-gray-900 dark:text-white">{userDetails.clinic_id}</p>
                      </div>
                    )}
                  </div>

                  {userDetails.role_details && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Detalles del Rol</p>
                      <Card className="bg-gray-50 dark:bg-gray-800">
                        <CardBody>
                          <pre className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded whitespace-pre-wrap">
                            {JSON.stringify(userDetails.role_details, null, 2)}
                          </pre>
                        </CardBody>
                      </Card>
                    </div>
                  )}
                </div>
              )}
              
              {userAction.action !== 'view' && userAction.user && (
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    {userAction.action === 'activate' && <UserCheck className="h-12 w-12 text-success" />}
                    {userAction.action === 'deactivate' && <UserX className="h-12 w-12 text-warning" />}
                    {userAction.action === 'delete' && <Trash2 className="h-12 w-12 text-danger" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                      {userAction.action === 'activate' && '¿Activar este usuario?'}
                      {userAction.action === 'deactivate' && '¿Desactivar este usuario?'}
                      {userAction.action === 'delete' && '¿Eliminar este usuario?'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Usuario: <strong className="text-gray-900 dark:text-white">{userAction.user.name}</strong>
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      Email: <strong className="text-gray-900 dark:text-white">{userAction.user.email}</strong>
                    </p>
                    {userAction.action === 'delete' && (
                      <p className="text-danger text-sm mt-2 font-medium">
                        ⚠️ Esta acción no se puede deshacer
                      </p>
                    )}
                  </div>
                </div>
              )}
            </ModalBody>
            <ModalFooter className="bg-white dark:bg-gray-900">
              <Button variant="light" onPress={onClose} className="text-gray-600 dark:text-gray-300">
                Cancelar
              </Button>
              {userAction.action !== 'view' && (
                <Button
                  color={
                    userAction.action === 'activate' ? 'success' :
                    userAction.action === 'deactivate' ? 'warning' : 'danger'
                  }
                  onPress={executeAction}
                  isLoading={loading}
                >
                  {userAction.action === 'activate' && 'Activar'}
                  {userAction.action === 'deactivate' && 'Desactivar'}
                  {userAction.action === 'delete' && 'Eliminar'}
                </Button>
              )}
            </ModalFooter>
          </ModalContent>
        </Modal>
        </div>
      </div>
    </SuperAdminOnly>
  );
}