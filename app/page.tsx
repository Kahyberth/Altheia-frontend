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
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-sm">
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
                <span className="font-bold text-xl text-slate-900">
                  MediSync
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
              className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
            >
              Testimonials
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#contact"
              className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
            >
              Contact
            </Link>
          </motion.nav>

          <div className="flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="hidden md:block"
            >
              <Button variant="outline" className="mr-2">
                Log in
              </Button>
              <Button onClick={() => setAuthModalOpen(true)}>
                Get Started
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
                <X className="h-6 w-6 text-slate-700" />
              ) : (
                <Menu className="h-6 w-6 text-slate-700" />
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
            className="md:hidden border-t"
          >
            <div className="container py-4 space-y-4">
              <Link
                href="#features"
                className="block text-sm font-medium text-slate-700 hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#testimonials"
                className="block text-sm font-medium text-slate-700 hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonials
              </Link>
              <Link
                href="#pricing"
                className="block text-sm font-medium text-slate-700 hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="#contact"
                className="block text-sm font-medium text-slate-700 hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="pt-4 flex flex-col gap-2">
                <Button variant="outline" className="w-full justify-center">
                  Log in
                </Button>
                <Button
                  className="w-full justify-center"
                  onClick={() => setAuthModalOpen(true)}
                >
                  Get Started
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
                  <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                    Next-Generation EHR
                  </span>
                </motion.div>
                <motion.h1
                  variants={item}
                  className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700"
                >
                  Elevate Patient Care with Intelligent Health Records
                </motion.h1>
                <motion.p
                  variants={item}
                  className="max-w-[600px] text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                >
                  MediSync delivers a premium Electronic Health Record system
                  designed for modern healthcare providers. Streamline
                  workflows, enhance patient outcomes, and transform your
                  practice.
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
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline">
                    View Features
                  </Button>
                </motion.div>
                <motion.div
                  variants={item}
                  className="flex items-center gap-4 text-sm"
                >
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-white overflow-hidden bg-slate-300"
                      >
                        <Image
                          src={`/placeholder.svg?height=32&width=32&text=${i}`}
                          alt={`User ${i}`}
                          width={32}
                          height={32}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-slate-600">
                    <span className="font-medium text-slate-900">500+</span>{" "}
                    healthcare providers trust MediSync
                  </p>
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
                    src="/placeholder.svg?height=600&width=1000&text=EHR+Dashboard"
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
                  className="absolute -bottom-6 -right-6 rounded-lg bg-white p-4 shadow-lg md:bottom-8 md:right-8"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-green-100 p-2">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">HIPAA Compliant</p>
                      <p className="text-xs text-slate-500">
                        Enterprise-grade security
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
              <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                Powerful Features
              </span>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Everything you need in one platform
              </h2>
              <p className="max-w-[700px] text-slate-600 md:text-xl/relaxed">
                MediSync combines powerful features with an intuitive interface
                to transform how you manage patient care.
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
                  title: "Enterprise Security",
                  description:
                    "HIPAA-compliant infrastructure with end-to-end encryption and advanced access controls.",
                },
                {
                  icon: <Clock className="h-6 w-6 text-blue-600" />,
                  title: "Real-time Collaboration",
                  description:
                    "Seamlessly collaborate with your team in real-time for better coordination and care.",
                },
                {
                  icon: <BarChart3 className="h-6 w-6 text-blue-600" />,
                  title: "Advanced Analytics",
                  description:
                    "Gain insights from comprehensive analytics and reporting to improve patient outcomes.",
                },
                {
                  icon: <Users className="h-6 w-6 text-blue-600" />,
                  title: "Patient Portal",
                  description:
                    "Empower patients with secure access to their health records and communication tools.",
                },
                {
                  icon: <CheckCircle2 className="h-6 w-6 text-blue-600" />,
                  title: "Automated Workflows",
                  description:
                    "Streamline clinical workflows with intelligent automation and customizable templates.",
                },
                {
                  icon: <ArrowRight className="h-6 w-6 text-blue-600" />,
                  title: "Seamless Integration",
                  description:
                    "Connect with your existing systems and third-party applications through our API.",
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
                        className="mb-4 rounded-full bg-blue-50 p-3 w-fit"
                      >
                        {feature.icon}
                      </motion.div>
                      <h3 className="text-xl font-bold">{feature.title}</h3>
                      <p className="mt-2 text-slate-600">
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
        <section className="border-t border-b bg-slate-50 py-20 md:py-28 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                  Premium Interface
                </span>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Designed for efficiency and clarity
                </h2>
                <p className="text-slate-600 md:text-lg">
                  Our intuitive interface reduces cognitive load and helps
                  healthcare providers focus on what matters most—patient care.
                </p>
                <ul className="space-y-4">
                  {[
                    "Customizable dashboards for different roles",
                    "Intelligent search across all patient data",
                    "Dark mode support for reduced eye strain",
                    "Responsive design for all devices",
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
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
                <div>
                  <Button variant="outline" className="mt-2">
                    See the interface in action
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
                    src="/placeholder.svg?height=600&width=800&text=EHR+Interface"
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
                  className="absolute -bottom-6 -left-6 rounded-lg bg-white p-4 shadow-lg md:bottom-8 md:left-8"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-blue-100 p-2">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        User-Centered Design
                      </p>
                      <p className="text-xs text-slate-500">
                        Developed with healthcare providers
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
              <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                Get Started Today
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to transform your practice?
              </h2>
              <p className="mt-4 max-w-[700px] mx-auto text-slate-600 md:text-xl/relaxed">
                Join hundreds of healthcare providers who have elevated their
                patient care with MediSync. Schedule a demo to see how we can
                help your practice.
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
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
                <Button size="lg" variant="outline">
                  Contact Sales
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
        <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-12 md:py-16">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <Link href="/" className="flex items-center">
                <div className="relative h-8 w-8 mr-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600">
                  <Shield className="absolute inset-0 m-auto text-white h-5 w-5" />
                </div>
                <span className="font-bold text-xl text-slate-900">
                  MediSync
                </span>
              </Link>
              <p className="text-sm text-slate-600">
                Transforming healthcare with intelligent electronic health
                records.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-slate-600 hover:text-blue-600">
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
