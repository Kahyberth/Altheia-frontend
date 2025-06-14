"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Shield,
  Clock,
  BarChart3,
  Users,
  CheckCircle2,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMobile } from "@/hooks/use-mobile";
import { AuthModal } from "@/components/auth-modal";
import apiClient from "@/fetch/apiClient";

export default function LandingPage() {
  const isMobile = useMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);


  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
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

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerFeatures = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const featureItem = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 100, damping: 10 },
    },
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm dark:border-slate-700">
        <div className="container flex h-16 items-center justify-between mx-auto">
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/" className="flex items-center">
                <div className="relative h-8 w-8 mr-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600">
                  <Shield className="absolute inset-0 m-auto text-white h-5 w-5" />
                </div>
                <span className="font-bold text-xl text-slate-900 dark:text-white">
                  Altheia
                </span>
              </Link>
            </motion.div>
          </div>

          {/* Desktop Navigation */}
          <motion.nav
            className="hidden md:flex items-center gap-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="#features"
              className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Características
            </Link>
            <Link
              href="#contact"
              className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Contacto
            </Link>
          </motion.nav>

          <div className="flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="hidden md:block"
            >
              <Button onClick={() => setAuthModalOpen(true)}>
                Iniciar Sesión
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </motion.div>

            {/* Mobile menu button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-slate-700 dark:text-slate-300" />
              ) : (
                <Menu className="h-6 w-6 text-slate-700 dark:text-slate-300" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t dark:border-slate-700"
          >
            <div className="container py-4 space-y-4">
              <Link
                href="#features"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                Características
              </Link>
              <Link
                href="#contact"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contacto
              </Link>
              <div className="pt-4 flex flex-col gap-2">
                <Button
                  className="w-full justify-center"
                  onClick={() => setAuthModalOpen(true)}
                >
                  Iniciar Sesión
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-28 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <motion.div
                initial="hidden"
                animate="show"
                variants={container}
                className="space-y-6"
              >
                <motion.div variants={item}>
                  <span className="inline-block rounded-full bg-blue-100 dark:bg-blue-900 px-3 py-1 text-sm font-medium text-blue-800 dark:text-blue-200">
                    Next-Generation EHR
                  </span>
                </motion.div>
                <motion.h1
                  variants={item}
                  className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-200 dark:to-slate-300"
                >
                  Altheia, tu aliado en la salud
                </motion.h1>
                <motion.p
                  variants={item}
                  className="max-w-[600px] text-slate-600 dark:text-slate-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                >
                  Altheia es una plataforma de salud que te ayuda a gestionar tu clínica de manera eficiente y segura.
                </motion.p>
                <motion.div
                  variants={item}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                    onClick={() => setAuthModalOpen(true)}
                  >
                    Únete a Altheia
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative"
              >
                <div className="relative mx-auto aspect-video max-w-[600px] overflow-hidden rounded-xl bg-slate-100 shadow-2xl">
                  <Image
                    src="/background.jpg"
                    alt="EHR Dashboard"
                    width={1000}
                    height={600}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent"></div>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="absolute -bottom-6 -right-6 rounded-lg bg-white dark:bg-slate-800 p-4 shadow-lg md:bottom-8 md:right-8"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-green-100 p-2">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium dark:text-white">Seguridad</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Seguridad de datos y privacidad
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-28 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <span className="inline-block rounded-full bg-blue-100 dark:bg-blue-900 px-3 py-1 text-sm font-medium text-blue-800 dark:text-blue-200">
                Características
              </span>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl dark:text-white">
                Todo lo que necesitas en una sola plataforma
              </h2>
              <p className="max-w-[700px] text-slate-600 dark:text-slate-400 md:text-xl/relaxed">
                Altheia combina características poderosas con una interfaz intuitiva para transformar cómo gestionas la atención médica.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerFeatures}
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
              {[
                {
                  icon: <Shield className="h-6 w-6 text-blue-600" />,
                  title: "Seguridad",
                  description:
                    "Infraestructura de seguridad de nivel empresarial con cifrado de extremo a extremo y controles de acceso avanzados.",
                },
                {
                  icon: <Clock className="h-6 w-6 text-blue-600" />,
                  title: "Colaboración en tiempo real",
                  description:
                    "Colabora en tiempo real con tu equipo para una coordinación mejorada y cuidado del paciente.",
                },
                {
                  icon: <BarChart3 className="h-6 w-6 text-blue-600" />,
                  title: "Análisis avanzados",
                  description:
                    "Obtén insights de análisis y reportes para mejorar los resultados del paciente.",
                },
                {
                  icon: <Users className="h-6 w-6 text-blue-600" />,
                  title: "Portal de pacientes",
                  description:
                    "Empodera a los pacientes con acceso seguro a sus historiales médicos y herramientas de comunicación.",
                },
                {
                  icon: <CheckCircle2 className="h-6 w-6 text-blue-600" />,
                  title: "Flujos automatizados",
                  description:
                    "Optimiza los flujos clínicos con automatización inteligente y plantillas personalizables.",
                },
                {
                  icon: <ArrowRight className="h-6 w-6 text-blue-600" />,
                  title: "Integración sin complicaciones",
                  description:
                    "Conecta con tus sistemas y aplicaciones de terceros a través de nuestra API.",
                },
              ].map((feature, i) => (
                <motion.div key={i} variants={featureItem}>
                  <Card className="h-full overflow-hidden transition-all hover:shadow-lg">
                    <CardContent className="p-6">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                        className="mb-4 rounded-full bg-blue-50 dark:bg-blue-900/20 p-3 w-fit"
                      >
                        {feature.icon}
                      </motion.div>
                      <h3 className="text-xl font-bold dark:text-white">{feature.title}</h3>
                      <p className="mt-2 text-slate-600 dark:text-slate-400">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Interface Showcase */}
        <section className="border-t border-b bg-slate-50 dark:bg-slate-800 dark:border-slate-700 py-20 md:py-28 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <span className="inline-block rounded-full bg-blue-100 dark:bg-blue-900 px-3 py-1 text-sm font-medium text-blue-800 dark:text-blue-200">
                  Interfaz Premium
                </span>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl dark:text-white">
                  Diseñada para eficiencia y claridad
                </h2>
                <p className="text-slate-600 dark:text-slate-400 md:text-lg">
                  Nuestra interfaz intuitiva reduce la carga cognitiva y ayuda a los proveedores de atención médica a enfocarse en lo que importa: el cuidado del paciente.
                </p>
                <ul className="space-y-4">
                  {[
                    "Tableros personalizables para diferentes roles",
                    "Búsqueda inteligente en todos los datos del paciente",
                    "Modo oscuro para reducir la fatiga ocular",
                    "Diseño responsivo para todos los dispositivos",
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.4 }}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="dark:text-slate-300">{item}</span>
                    </motion.li>
                  ))}
                </ul>
                <div>
                  <Button variant="outline" className="mt-2">
                    Ver la interfaz en acción
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="relative"
              >
                <div className="relative mx-auto overflow-hidden rounded-xl bg-white shadow-2xl">
                  <Image
                    src="/interfaz.png"
                    alt="EHR Interface"
                    width={800}
                    height={600}
                    className="h-full w-full object-cover"
                  />
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="absolute -bottom-6 -left-6 rounded-lg bg-white dark:bg-slate-800 p-4 shadow-lg md:bottom-8 md:left-8"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-blue-100 p-2">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium dark:text-white">
                        Diseño Centrado en el Usuario
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Desarrollada con proveedores de atención médica
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="py-20 md:py-28 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mx-auto max-w-3xl text-center"
            >
              <span className="inline-block rounded-full bg-blue-100 dark:bg-blue-900 px-3 py-1 text-sm font-medium text-blue-800 dark:text-blue-200">
                Únete a Altheia
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl dark:text-white">
                Listo para transformar tu práctica?
              </h2>
              <p className="mt-4 max-w-[700px] mx-auto text-slate-600 dark:text-slate-400 md:text-xl/relaxed">
                Únete a cientos de proveedores de atención médica que han elevado su atención al paciente con Altheia. Agenda una demostración para ver cómo podemos ayudarte a tu práctica.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                    onClick={() => setAuthModalOpen(true)}
                  >
                    Únete a Altheia
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
        <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      </main>

      {/* Footer */}
      <footer className="border-t bg-white dark:bg-slate-900 dark:border-slate-700 py-12 md:py-16">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <Link href="/" className="flex items-center">
                <div className="relative h-8 w-8 mr-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600">
                  <Shield className="absolute inset-0 m-auto text-white h-5 w-5" />
                </div>
                <span className="font-bold text-xl text-slate-900 dark:text-white">
                  Altheia
                </span>
              </Link>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Altheia es una plataforma de salud que te ayuda a gestionar tu clínica de manera eficiente y segura.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
                  <span className="sr-only">Twitter</span>
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
                    className="h-5 w-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
