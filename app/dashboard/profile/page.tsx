"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Settings,
  Shield,
  LogOut,
  Edit,
  Save,
  X,
  Check,
  AlertTriangle,
  Eye,
  EyeOff,
  Lock,
  Smartphone,
  Mail,
  Calendar,
  Clock,
  Moon,
  Sun,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { useMobile } from "@/hooks/use-mobile";
import { DeleteAccountDialog } from "@/components/delete-account-dialog";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/react";
import { getClinicInformation } from "@/services/clinic.service";
import {
  updateUserProfile,
  getUserProfileByRole,
} from "@/services/user.service";
import { getClinicByClinicId } from "@/services/clinic.service";
import apiClient from "@/fetch/apiClient";
import { useTheme } from "@/context/ThemeContext";

const SAMPLE_USER_DATA = {
  id: "U-1001",
  name: "Dr. Rebecca Taylor",
  email: "rebecca.taylor@medisync.com",
  phone: "(555) 123-4567",
  role: "Cardiologist",
  department: "Cardiology",
  licenseNumber: "MD-12345-CA",
  physician_specialty: "",
  eps: "",
  address: "",
  joinDate: "2020-06-15",
  lastActive: "2023-05-19T08:30:00",
  avatar: "/placeholder.svg?height=128&width=128&text=RT",
  twoFactorEnabled: true,
  notificationPreferences: {
    email: true,
    sms: false,
    app: true,
    appointments: true,
    updates: true,
    marketing: false,
  },
  displayPreferences: {
    theme: "light",
    colorScheme: "blue",
    compactMode: false,
    animations: true,
  },
  securityInfo: {
    lastPasswordChange: "2023-04-10",
    passwordStrength: 85,
    loginHistory: [
      {
        date: "2023-05-19T08:30:00",
        device: "Chrome / Windows",
        location: "San Francisco, CA",
      },
      {
        date: "2023-05-18T17:45:00",
        device: "Mobile App / iOS",
        location: "San Francisco, CA",
      },
      {
        date: "2023-05-17T09:15:00",
        device: "Chrome / Windows",
        location: "San Francisco, CA",
      },
    ],
  },
};

export default function ProfilePage() {
  const isMobile = useMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("personal");
  const [editMode, setEditMode] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [userData, setUserData] = useState(SAMPLE_USER_DATA);
  const [formData, setFormData] = useState({
    name: SAMPLE_USER_DATA.name,
    email: SAMPLE_USER_DATA.email,
    phone: SAMPLE_USER_DATA.phone,
    department: SAMPLE_USER_DATA.department,
    licenseNumber: SAMPLE_USER_DATA.licenseNumber,
    physician_specialty: SAMPLE_USER_DATA.physician_specialty,
    eps: SAMPLE_USER_DATA.eps,
    address: SAMPLE_USER_DATA.address,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      if (!user.clinic_id) {
        const fallbackProfile = {
          ...SAMPLE_USER_DATA,
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: "",
          physician_specialty: "",
          eps: "",
          address: "",
          joinDate: SAMPLE_USER_DATA.joinDate,
          lastActive: new Date().toISOString(),
        };

        setUserData(fallbackProfile);
        setFormData((prev) => ({
          ...prev,
          name: user.name,
          email: user.email,
          phone: "",
          department: "",
          licenseNumber: "",
          physician_specialty: "",
          eps: "",
          address: "",
        }));

        setIsLoading(false);
        return;
      }

      try {
        const clinicRes = await getClinicByClinicId(user.clinic_id);
        const clinicData = clinicRes.data || clinicRes;

        let profileData = null;
        let roleSpecificData = null;

        switch (user.role.toLowerCase()) {
          case "patient":
            const patientData = clinicData.clinic?.patients?.find(
              (p: any) => p.user_id === user.id
            );
            if (patientData) {
              profileData = patientData.user;
              roleSpecificData = {
                address: patientData.address,
                eps: patientData.eps,
                blood_type: patientData.blood_type,
                date_of_birth: patientData.date_of_birth,
              };
            }
            break;
          case "owner":
          case "clinic_owner":
            if (clinicData.owner?.id === user.id) {
              profileData = clinicData.owner;
            }
            break;

          default:
            profileData = null;
        }

        if (profileData) {
          const updatedProfile = {
            ...SAMPLE_USER_DATA,
            id: profileData.id,
            name: profileData.name,
            email: profileData.email,
            role: profileData.rol || user.role,
            phone: profileData.phone || "",
            physician_specialty:
              profileData.physician?.physician_specialty || "",
            eps: roleSpecificData?.eps || "",
            address: roleSpecificData?.address || "",
            blood_type: roleSpecificData?.blood_type || "",
            date_of_birth: roleSpecificData?.date_of_birth || "",
            joinDate: profileData.createdAt
              ? String(profileData.createdAt)
              : SAMPLE_USER_DATA.joinDate,
            lastActive: profileData.lastLogin
              ? String(profileData.lastLogin)
              : new Date().toISOString(),
          };

          setUserData(updatedProfile);
          setFormData((prev) => ({
            ...prev,
            name: updatedProfile.name,
            email: updatedProfile.email,
            phone: updatedProfile.phone,
            department: updatedProfile.department || "",
            licenseNumber: updatedProfile.licenseNumber || "",
            physician_specialty: updatedProfile.physician_specialty,
            eps: updatedProfile.eps,
            address: updatedProfile.address,
          }));
        } else {
          throw new Error("No se encontraron datos del usuario en la clínica");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);

        const fallbackProfile = {
          ...SAMPLE_USER_DATA,
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: "",
          physician_specialty: "",
          eps: "",
          address: "",
          joinDate: SAMPLE_USER_DATA.joinDate,
          lastActive: new Date().toISOString(),
        };

        setUserData(fallbackProfile);
        setFormData((prev) => ({
          ...prev,
          name: user.name,
          email: user.email,
          phone: "",
          department: "",
          licenseNumber: "",
          physician_specialty: "",
          eps: "",
          address: "",
        }));

        addToast({
          title: "Información parcial",
          description:
            "Se cargó información básica del perfil. Algunos datos pueden no estar disponibles.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id, user?.name, user?.email, user?.role, user?.clinic_id]);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSavePersonalInfo = async () => {
    if (!user) return;

    try {
      const updateData = (() => {
        const baseData = {
          name: formData.name,
          phone: formData.phone,
        };

        const userRole = user.role.toLowerCase();

        switch (userRole) {
          case "patient":
            return {
              ...baseData,
              eps: formData.eps,
              address: formData.address,
            };
          case "physician":
            return {
              ...baseData,
              physician_specialty: formData.physician_specialty,
            };
          case "receptionist":
          case "lab_technician":
          case "owner":
          case "clinic_owner":
            return baseData;
          default:
            return baseData;
        }
      })();

      await updateUserProfile(user.id, user.role, updateData);

      setUserData((prev) => ({
        ...prev,
        name: formData.name,
        phone: formData.phone,
        physician_specialty: formData.physician_specialty,
        eps: formData.eps,
        address: formData.address,
      }));

      setEditMode(false);
      addToast({
        title: "Perfil actualizado",
        description: "Se guardaron los cambios de tu perfil.",
      });
    } catch (err) {
      console.error(err);
      addToast({
        title: "Error",
        description: "No se pudo actualizar tu perfil.",
      });
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      ...formData,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      department: userData.department,
      licenseNumber: userData.licenseNumber,
      physician_specialty: userData.physician_specialty,
      eps: userData.eps,
      address: userData.address,
    });
    setEditMode(false);
  };

  const handlePasswordChange = async () => {
    if (!user) return;

    try {
      await apiClient.post("/auth/change-password", {
        user_id: user.id,
        current_password: formData.currentPassword,
        new_password: formData.newPassword,
      });

      addToast({
        title: "Contraseña actualizada",
        description: "Tu contraseña se ha actualizado correctamente.",
      });
    } catch (err) {
      console.error(err);
      addToast({
        title: "Error",
        description: "No se pudo actualizar la contraseña.",
      });
    } finally {
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    }
  };

  const calculatePasswordStrength = (password: string) => {
    if (!password) return 0;

    let strength = 0;

    if (password.length >= 8) strength += 25;

    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;

    return strength;
  };

  const passwordStrength = calculatePasswordStrength(formData.newPassword);

  const displayRole = (() => {
    const role = (userData.role || "").toLowerCase();
    console.log(role);
    if (role === "owner" || role === "clinic_owner")
      return "Creador de la clínica";
    if (role === "patient") return "Paciente";
    if (role === "physician") {
      return userData.physician_specialty || userData.department || "Médico";
    }
    return role.charAt(0).toUpperCase() + role.slice(1);
  })();

  const getPasswordStrengthLabel = () => {
    if (passwordStrength <= 25) return { label: "Weak", color: "text-red-500" };
    if (passwordStrength <= 50)
      return { label: "Fair", color: "text-amber-500" };
    if (passwordStrength <= 75)
      return { label: "Good", color: "text-blue-500" };
    return { label: "Strong", color: "text-green-500" };
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 25) return "bg-red-500";
    if (passwordStrength <= 50) return "bg-amber-500";
    if (passwordStrength <= 75) return "bg-blue-500";
    return "bg-green-500";
  };

  const getFieldsForRole = (role: string) => {
    const normalizedRole = role.toLowerCase();
    const baseFields = ["name", "phone"];

    switch (normalizedRole) {
      case "patient":
        return [...baseFields, "eps", "address"];
      case "physician":
        return [...baseFields, "physician_specialty"];
      case "receptionist":
      case "lab_technician":
      case "owner":
      case "clinic_owner":
        return baseFields;
      default:
        return baseFields;
    }
  };

  const fieldsToShow = user ? getFieldsForRole(user.role) : ["name", "phone"];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <div className="relative h-12 w-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600">
            <User className="absolute inset-0 m-auto text-white h-6 w-6" />
          </div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 150 }}
            transition={{ delay: 0.5, duration: 1, ease: "easeInOut" }}
            className="mt-6 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
          />
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            Loading your profile...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header is included in the DashboardSidebar component */}

        {/* Profile Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <motion.div
            initial="hidden"
            animate="show"
            variants={container}
            className="mx-auto max-w-4xl space-y-6"
          >
            {/* Page Title */}
            <motion.div variants={item} className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold tracking-tight dark:text-white">
                My Profile
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Manage your account settings and preferences
              </p>
            </motion.div>

            {/* Profile Header */}
            <motion.div variants={item}>
              <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
                    <div className="relative">
                      <Avatar className="h-24 w-24 border-4 border-white dark:border-slate-700 shadow-md">
                        <AvatarImage
                          src={userData.avatar || "/placeholder.svg"}
                          alt={userData.name}
                        />
                        <AvatarFallback className="text-lg dark:bg-slate-700 dark:text-white">
                          {userData.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="icon"
                            className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700"
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Change avatar</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="dark:bg-slate-800 dark:border-slate-700">
                          <DialogHeader>
                            <DialogTitle className="dark:text-white">
                              Change Profile Picture
                            </DialogTitle>
                            <DialogDescription className="dark:text-slate-400">
                              Upload a new profile picture. The image should be
                              at least 400x400 pixels.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="flex flex-col items-center gap-4">
                              <Avatar className="h-32 w-32 border-4 border-white dark:border-slate-700 shadow-md">
                                <AvatarImage
                                  src={userData.avatar || "/placeholder.svg"}
                                  alt={userData.name}
                                />
                                <AvatarFallback className="text-2xl dark:bg-slate-700 dark:text-white">
                                  {userData.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="grid w-full gap-2">
                                <Label
                                  htmlFor="picture"
                                  className="dark:text-white"
                                >
                                  Upload Picture
                                </Label>
                                <Input
                                  id="picture"
                                  type="file"
                                  accept="image/*"
                                  className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                />
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              className="dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:hover:bg-slate-600"
                            >
                              Cancel
                            </Button>
                            <Button>Save Changes</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
                      <h2 className="text-xl font-bold dark:text-white">
                        {userData.name}
                      </h2>
                      <p className="text-slate-500 dark:text-slate-400">
                        {displayRole}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {displayRole !== "Creador de la clínica" &&
                          displayRole !== "Paciente" &&
                          userData.department && (
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700"
                            >
                              {userData.department}
                            </Badge>
                          )}
                        <Badge
                          variant="outline"
                          className="bg-slate-100 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600"
                        >
                          License: {userData.licenseNumber}
                        </Badge>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Joined{" "}
                            {new Date(userData.joinDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            Last active{" "}
                            {new Date(userData.lastActive).toLocaleString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 md:self-start">
                      <Button
                        variant="outline"
                        className="gap-2 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:hover:bg-slate-600"
                        onClick={() => {
                          setEditMode(!editMode);
                          if (!editMode) {
                            setActiveTab("personal");
                          }
                        }}
                      >
                        {editMode ? (
                          <>
                            <X className="h-4 w-4" /> Cancel Editing
                          </>
                        ) : (
                          <>
                            <Edit className="h-4 w-4" /> Edit Profile
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        className="gap-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 dark:bg-slate-700 dark:border-slate-600 dark:hover:bg-slate-600"
                        onClick={async () => {
                          await logout();
                          router.push("/");
                        }}
                      >
                        <LogOut className="h-4 w-4" /> Sign Out
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Profile Tabs */}
            <motion.div variants={item}>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4 dark:bg-slate-800">
                  <TabsTrigger
                    value="personal"
                    className="flex gap-2 dark:text-slate-400 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Personal Info</span>
                    <span className="sm:hidden">Info</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="security"
                    className="flex gap-2 dark:text-slate-400 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white"
                  >
                    <Shield className="h-4 w-4" />
                    <span className="hidden sm:inline">Security</span>
                    <span className="sm:hidden">Security</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="preferences"
                    className="flex gap-2 dark:text-slate-400 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white"
                  >
                    <Settings className="h-4 w-4" />
                    <span className="hidden sm:inline">Preferences</span>
                    <span className="sm:hidden">Prefs</span>
                  </TabsTrigger>
                </TabsList>

                {/* Personal Information Tab */}
                <TabsContent value="personal">
                  <Card className="dark:bg-slate-800 dark:border-slate-700">
                    <CardHeader>
                      <CardTitle className="dark:text-white">
                        Personal Information
                      </CardTitle>
                      <CardDescription className="dark:text-slate-400">
                        Manage your personal information and contact details
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        {/* Always show name */}
                        {fieldsToShow.includes("name") && (
                          <div className="space-y-2">
                            <Label htmlFor="name" className="dark:text-white">
                              Nombre completo
                            </Label>
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              disabled={!editMode}
                              className={`${
                                editMode
                                  ? "border-blue-300 dark:border-blue-600"
                                  : ""
                              } dark:bg-slate-700 dark:border-slate-600 dark:text-white`}
                            />
                          </div>
                        )}

                        {/* Show email for reference (not editable through profile for security) */}
                        <div className="space-y-2">
                          <Label htmlFor="email" className="dark:text-white">
                            Correo electrónico
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            disabled={true}
                            className="dark:bg-slate-700 dark:border-slate-600 dark:text-white opacity-60"
                          />
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            El email no se puede modificar desde aquí por
                            seguridad
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        {/* Always show phone */}
                        {fieldsToShow.includes("phone") && (
                          <div className="space-y-2">
                            <Label htmlFor="phone" className="dark:text-white">
                              Número de teléfono
                            </Label>
                            <Input
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              disabled={!editMode}
                              className={`${
                                editMode
                                  ? "border-blue-300 dark:border-blue-600"
                                  : ""
                              } dark:bg-slate-700 dark:border-slate-600 dark:text-white`}
                            />
                          </div>
                        )}

                        {/* Show physician specialty for physicians */}
                        {fieldsToShow.includes("physician_specialty") && (
                          <div className="space-y-2">
                            <Label
                              htmlFor="physician_specialty"
                              className="dark:text-white"
                            >
                              Especialidad médica
                            </Label>
                            <Input
                              id="physician_specialty"
                              name="physician_specialty"
                              value={formData.physician_specialty}
                              onChange={handleInputChange}
                              disabled={!editMode}
                              className={`${
                                editMode
                                  ? "border-blue-300 dark:border-blue-600"
                                  : ""
                              } dark:bg-slate-700 dark:border-slate-600 dark:text-white`}
                            />
                          </div>
                        )}

                        {/* Show EPS for patients */}
                        {fieldsToShow.includes("eps") && (
                          <div className="space-y-2">
                            <Label htmlFor="eps" className="dark:text-white">
                              EPS
                            </Label>
                            <Input
                              id="eps"
                              name="eps"
                              value={formData.eps}
                              onChange={handleInputChange}
                              disabled={!editMode}
                              className={`${
                                editMode
                                  ? "border-blue-300 dark:border-blue-600"
                                  : ""
                              } dark:bg-slate-700 dark:border-slate-600 dark:text-white`}
                            />
                          </div>
                        )}
                      </div>

                      {/* Show address for patients */}
                      {fieldsToShow.includes("address") && (
                        <div className="space-y-2">
                          <Label htmlFor="address" className="dark:text-white">
                            Dirección
                          </Label>
                          <Input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            className={`${
                              editMode
                                ? "border-blue-300 dark:border-blue-600"
                                : ""
                            } dark:bg-slate-700 dark:border-slate-600 dark:text-white`}
                          />
                        </div>
                      )}
                    </CardContent>
                    <AnimatePresence>
                      {editMode && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <CardFooter className="flex justify-end gap-2 border-t bg-slate-50 dark:bg-slate-700 dark:border-slate-600 px-6 py-4">
                            <Button
                              variant="outline"
                              onClick={handleCancelEdit}
                              className="dark:bg-slate-600 dark:border-slate-500 dark:text-white dark:hover:bg-slate-500"
                            >
                              Cancel
                            </Button>
                            <Button onClick={handleSavePersonalInfo}>
                              <Save className="mr-2 h-4 w-4" />
                              Save Changes
                            </Button>
                          </CardFooter>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="dark:bg-slate-800 dark:border-slate-700">
                      <CardHeader>
                        <CardTitle className="dark:text-white">
                          Password
                        </CardTitle>
                        <CardDescription className="dark:text-slate-400">
                          Change your password and manage your account security
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor="currentPassword"
                              className="dark:text-white"
                            >
                              Current Password
                            </Label>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              Last changed:{" "}
                              {new Date(
                                userData.securityInfo.lastPasswordChange
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="relative">
                            <Input
                              id="currentPassword"
                              name="currentPassword"
                              type={showPassword ? "text" : "password"}
                              value={formData.currentPassword}
                              onChange={handleInputChange}
                              className="pr-10 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3 py-2 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                              <span className="sr-only">
                                {showPassword
                                  ? "Hide password"
                                  : "Show password"}
                              </span>
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="newPassword"
                            className="dark:text-white"
                          >
                            New Password
                          </Label>
                          <div className="relative">
                            <Input
                              id="newPassword"
                              name="newPassword"
                              type={showPassword ? "text" : "password"}
                              value={formData.newPassword}
                              onChange={handleInputChange}
                              className="pr-10 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3 py-2 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                              <span className="sr-only">
                                {showPassword
                                  ? "Hide password"
                                  : "Show password"}
                              </span>
                            </Button>
                          </div>
                          {formData.newPassword && (
                            <div className="mt-2 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-xs dark:text-slate-400">
                                  Password Strength
                                </span>
                                <span
                                  className={`text-xs font-medium ${
                                    getPasswordStrengthLabel().color
                                  }`}
                                >
                                  {getPasswordStrengthLabel().label}
                                </span>
                              </div>
                              <Progress
                                value={passwordStrength}
                                className="h-1"
                                indicatorClassName={getPasswordStrengthColor()}
                              />
                              <ul className="mt-2 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                                <li className="flex items-center gap-1">
                                  <Check
                                    className={`h-3 w-3 ${
                                      formData.newPassword.length >= 8
                                        ? "text-green-500"
                                        : "text-slate-300 dark:text-slate-600"
                                    }`}
                                  />
                                  <span>At least 8 characters</span>
                                </li>
                                <li className="flex items-center gap-1">
                                  <Check
                                    className={`h-3 w-3 ${
                                      /[A-Z]/.test(formData.newPassword)
                                        ? "text-green-500"
                                        : "text-slate-300 dark:text-slate-600"
                                    }`}
                                  />
                                  <span>At least one uppercase letter</span>
                                </li>
                                <li className="flex items-center gap-1">
                                  <Check
                                    className={`h-3 w-3 ${
                                      /[0-9]/.test(formData.newPassword)
                                        ? "text-green-500"
                                        : "text-slate-300 dark:text-slate-600"
                                    }`}
                                  />
                                  <span>At least one number</span>
                                </li>
                                <li className="flex items-center gap-1">
                                  <Check
                                    className={`h-3 w-3 ${
                                      /[^A-Za-z0-9]/.test(formData.newPassword)
                                        ? "text-green-500"
                                        : "text-slate-300 dark:text-slate-600"
                                    }`}
                                  />
                                  <span>At least one special character</span>
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="confirmPassword"
                            className="dark:text-white"
                          >
                            Confirm New Password
                          </Label>
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                          />
                          {formData.newPassword &&
                            formData.confirmPassword &&
                            formData.newPassword !==
                              formData.confirmPassword && (
                              <p className="mt-1 text-xs text-red-500">
                                Passwords do not match
                              </p>
                            )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t px-6 py-4 dark:border-slate-600">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              currentPassword: "",
                              newPassword: "",
                              confirmPassword: "",
                            });
                          }}
                          className="dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:hover:bg-slate-600"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handlePasswordChange}
                          disabled={
                            !formData.currentPassword ||
                            !formData.newPassword ||
                            !formData.confirmPassword ||
                            formData.newPassword !== formData.confirmPassword ||
                            passwordStrength < 50
                          }
                        >
                          Update Password
                        </Button>
                      </CardFooter>
                    </Card>

                    <div className="space-y-4">
                      <Card className="dark:bg-slate-800 dark:border-slate-700">
                        <CardHeader>
                          <CardTitle className="dark:text-white">
                            Two-Factor Authentication
                          </CardTitle>
                          <CardDescription className="dark:text-slate-400">
                            Add an extra layer of security to your account
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <div className="font-medium dark:text-white">
                                Two-Factor Authentication
                              </div>
                              <div className="text-sm text-slate-500 dark:text-slate-400">
                                Require a verification code when signing in
                              </div>
                            </div>
                            <Switch checked={userData.twoFactorEnabled} />
                          </div>
                          <Separator className="dark:bg-slate-600" />
                          <div className="space-y-2">
                            <h4 className="font-medium dark:text-white">
                              Verification Methods
                            </h4>
                            <div className="rounded-lg border p-3 dark:border-slate-600 dark:bg-slate-700">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2">
                                    <Smartphone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                  </div>
                                  <div>
                                    <div className="font-medium dark:text-white">
                                      Authenticator App
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">
                                      Use an authenticator app to get
                                      verification codes
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="dark:bg-slate-600 dark:border-slate-500 dark:text-white dark:hover:bg-slate-500"
                                >
                                  Setup
                                </Button>
                              </div>
                            </div>
                            <div className="rounded-lg border p-3 dark:border-slate-600 dark:bg-slate-700">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="rounded-full bg-slate-100 dark:bg-slate-600 p-2">
                                    <Mail className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                  </div>
                                  <div>
                                    <div className="font-medium dark:text-white">
                                      Email
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">
                                      Receive verification codes via email
                                    </div>
                                  </div>
                                </div>
                                <Badge
                                  variant="outline"
                                  className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300 dark:border-green-700"
                                >
                                  Active
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="dark:bg-slate-800 dark:border-slate-700">
                        <CardHeader>
                          <CardTitle className="dark:text-white">
                            Recent Login Activity
                          </CardTitle>
                          <CardDescription className="dark:text-slate-400">
                            Monitor where your account is being accessed
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {userData.securityInfo.loginHistory.map(
                              (login, index) => (
                                <div
                                  key={index}
                                  className="flex items-start gap-3"
                                >
                                  <div className="rounded-full bg-slate-100 dark:bg-slate-700 p-2">
                                    <Lock className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-medium dark:text-white">
                                      {login.device}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                      <span>{login.location}</span>
                                      <span>•</span>
                                      <span>
                                        {new Date(login.date).toLocaleString(
                                          "en-US",
                                          {
                                            month: "short",
                                            day: "numeric",
                                            hour: "numeric",
                                            minute: "2-digit",
                                          }
                                        )}
                                      </span>
                                      {index === 0 && (
                                        <>
                                          <span>•</span>
                                          <Badge
                                            variant="outline"
                                            className="bg-blue-50 text-blue-700 text-xs dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700"
                                          >
                                            Current Session
                                          </Badge>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4 dark:border-slate-600">
                          <Button
                            variant="outline"
                            className="w-full dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:hover:bg-slate-600"
                          >
                            View All Activity
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                {/* Preferences Tab */}
                <TabsContent value="preferences">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="dark:bg-slate-800 dark:border-slate-700">
                      <CardHeader>
                        <CardTitle className="dark:text-white">
                          Display Preferences
                        </CardTitle>
                        <CardDescription className="dark:text-slate-400">
                          Customize how the dashboard appears to you
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="font-medium dark:text-white">Theme</h3>
                          <RadioGroup
                            value={theme}
                            onValueChange={(val) => setTheme(val as any)}
                            className="grid grid-cols-3 gap-4"
                          >
                            <div>
                              <RadioGroupItem
                                value="light"
                                id="theme-light"
                                className="sr-only peer"
                              />
                              <Label
                                htmlFor="theme-light"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-slate-200 bg-white p-4 hover:bg-slate-50 hover:text-slate-900 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:text-blue-600 dark:border-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600 dark:hover:text-white"
                              >
                                <Sun className="mb-3 h-6 w-6" />
                                <span>Light</span>
                              </Label>
                            </div>
                            <div>
                              <RadioGroupItem
                                value="dark"
                                id="theme-dark"
                                className="sr-only peer"
                              />
                              <Label
                                htmlFor="theme-dark"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-slate-200 bg-white p-4 hover:bg-slate-50 hover:text-slate-900 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:text-blue-600 dark:border-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600 dark:hover:text-white"
                              >
                                <Moon className="mb-3 h-6 w-6" />
                                <span>Dark</span>
                              </Label>
                            </div>
                            <div>
                              <RadioGroupItem
                                value="system"
                                id="theme-system"
                                className="sr-only peer"
                              />
                              <Label
                                htmlFor="theme-system"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-slate-200 bg-white p-4 hover:bg-slate-50 hover:text-slate-900 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:text-blue-600 dark:border-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600 dark:hover:text-white"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="mb-3 h-6 w-6"
                                >
                                  <rect
                                    x="2"
                                    y="3"
                                    width="20"
                                    height="14"
                                    rx="2"
                                  />
                                  <line x1="8" x2="16" y1="21" y2="21" />
                                  <line x1="12" x2="12" y1="17" y2="21" />
                                </svg>
                                <span>System</span>
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <Separator className="dark:bg-slate-600" />

                        <div className="space-y-4">
                          <h3 className="font-medium dark:text-white">
                            Color Scheme
                          </h3>
                          <RadioGroup
                            defaultValue={
                              userData.displayPreferences.colorScheme
                            }
                            className="grid grid-cols-3 gap-4"
                          >
                            <div>
                              <RadioGroupItem
                                value="blue"
                                id="color-blue"
                                className="sr-only peer"
                              />
                              <Label
                                htmlFor="color-blue"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-slate-200 bg-white p-4 hover:bg-slate-50 hover:text-slate-900 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:text-blue-600 dark:border-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600 dark:hover:text-white"
                              >
                                <div className="mb-3 h-6 w-6 rounded-full bg-blue-600" />
                                <span>Blue</span>
                              </Label>
                            </div>
                            <div>
                              <RadioGroupItem
                                value="green"
                                id="color-green"
                                className="sr-only peer"
                              />
                              <Label
                                htmlFor="color-green"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-slate-200 bg-white p-4 hover:bg-slate-50 hover:text-slate-900 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:text-blue-600 dark:border-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600 dark:hover:text-white"
                              >
                                <div className="mb-3 h-6 w-6 rounded-full bg-green-600" />
                                <span>Green</span>
                              </Label>
                            </div>
                            <div>
                              <RadioGroupItem
                                value="purple"
                                id="color-purple"
                                className="sr-only peer"
                              />
                              <Label
                                htmlFor="color-purple"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-slate-200 bg-white p-4 hover:bg-slate-50 hover:text-slate-900 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:text-blue-600 dark:border-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600 dark:hover:text-white"
                              >
                                <div className="mb-3 h-6 w-6 rounded-full bg-purple-600" />
                                <span>Purple</span>
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <Separator className="dark:bg-slate-600" />

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <div className="font-medium dark:text-white">
                                Compact Mode
                              </div>
                              <div className="text-sm text-slate-500 dark:text-slate-400">
                                Reduce spacing and padding throughout the
                                interface
                              </div>
                            </div>
                            <Switch
                              checked={userData.displayPreferences.compactMode}
                            />
                          </div>
                          <Separator className="dark:bg-slate-600" />
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <div className="font-medium dark:text-white">
                                Enable Animations
                              </div>
                              <div className="text-sm text-slate-500 dark:text-slate-400">
                                Show animations and transitions in the interface
                              </div>
                            </div>
                            <Switch
                              checked={userData.displayPreferences.animations}
                            />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end border-t px-6 py-4 dark:border-slate-600">
                        <Button>Save Preferences</Button>
                      </CardFooter>
                    </Card>

                    <Card className="dark:bg-slate-800 dark:border-slate-700">
                      <CardHeader>
                        <CardTitle className="dark:text-white">
                          Account Management
                        </CardTitle>
                        <CardDescription className="dark:text-slate-400">
                          Manage your account settings and data
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="font-medium dark:text-white">
                            Data & Privacy
                          </h3>
                          <div className="rounded-lg border p-4 dark:border-slate-600 dark:bg-slate-700">
                            <div className="flex items-center gap-3">
                              <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="text-blue-600 dark:text-blue-400"
                                >
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                  <polyline points="7 10 12 15 17 10" />
                                  <line x1="12" x2="12" y1="15" y2="3" />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <div className="font-medium dark:text-white">
                                  Download Your Data
                                </div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                  Get a copy of your personal data in a
                                  machine-readable format
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="dark:bg-slate-600 dark:border-slate-500 dark:text-white dark:hover:bg-slate-500"
                              >
                                Request
                              </Button>
                            </div>
                          </div>
                        </div>

                        <Separator className="dark:bg-slate-600" />

                        <div className="space-y-4">
                          <h3 className="font-medium dark:text-white">
                            Danger Zone
                          </h3>
                          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                            <div className="flex items-center gap-3">
                              <div className="rounded-full bg-red-100 dark:bg-red-900 p-2">
                                <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium dark:text-white">
                                  Delete Account
                                </div>
                                <div className="text-sm text-slate-700 dark:text-slate-300">
                                  Permanently delete your account and all
                                  associated data
                                </div>
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setShowDeleteDialog(true)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300 dark:bg-slate-700 dark:border-slate-600"
                              >
                                <AlertTriangle className="mr-2 h-4 w-4" />
                                Deactivate Account
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="dark:bg-slate-800 dark:border-slate-700">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="dark:text-white">
                                  Deactivate Your Account?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="dark:text-slate-400">
                                  Your account will be temporarily deactivated.
                                  You can reactivate it at any time by signing
                                  in again. During deactivation, your profile
                                  will not be visible to others.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:hover:bg-slate-600">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                                  Deactivate
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </motion.div>
        </main>
      </div>

      {/* Delete Account Dialog */}
      <DeleteAccountDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </div>
  );
}
