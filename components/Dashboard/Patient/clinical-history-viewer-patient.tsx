"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import {
  FileText,
  Download,
  Printer,
  Calendar,
  User,
  Stethoscope,
  Pill,
  AlertTriangle,
  FileIcon as FileUser,
  Activity,
  Heart,
  ChevronDown,
  ChevronRight,
  Eye,
  Users,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useRole } from "@/hooks/useRole";
import { getMedicalHistoryByPatientId } from "@/services/medical.service";
import { Data } from "@/types/medical";

interface ClinicalHistoryViewerProps {
  patientId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClinicalHistoryViewerPatient({
  patientId,
  open,
  onOpenChange,
}: ClinicalHistoryViewerProps) {
  const [expandedConsultations, setExpandedConsultations] = useState<string[]>(
    []
  );
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [data, setData] = useState<Data | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const { user } = useRole();

  useEffect(() => {
    if (open && (patientId || user?.id)) {
      loadMedicalHistory();
    }
  }, [open, patientId, user?.id]);

  const loadMedicalHistory = async () => {
    const targetPatientId = patientId || user?.id;
    if (!targetPatientId) {
      setError("No se pudo obtener el ID del paciente");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("Loading medical history for patient ID:", targetPatientId);
      const axiosResponse = await getMedicalHistoryByPatientId(targetPatientId);
      const response = axiosResponse.data;

      console.log("API Response:", response);

      if (response.success && response.data) {
        const processedData = {
          ...response.data,
          total_consultations:
            response.data.consultations?.length ||
            response.data.total_consultations ||
            0,
        };
        setData(processedData);
      } else {
        setError("No se encontró historial médico para este paciente");
      }
    } catch (err: any) {
      console.error("Error loading medical history:", err);

      if (err.response?.status === 404) {
        setError(
          "No tienes historial médico registrado aún. Tu primera consulta médica creará automáticamente tu historial."
        );
      } else if (err.response?.status === 403) {
        setError("No tienes permisos para acceder a este historial.");
      } else if (err.response?.status === 500) {
        setError(
          "Error del servidor. Por favor, inténtalo de nuevo en unos minutos."
        );
      } else {
        setError(
          "Error al cargar el historial médico. Verifica tu conexión e inténtalo de nuevo."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleConsultation = (consultationId: string) => {
    setExpandedConsultations((prev) =>
      prev.includes(consultationId)
        ? prev.filter((id) => id !== consultationId)
        : [...prev, consultationId]
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!data) return;

    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let yPosition = margin;
      let pageNumber = 1;

      pdf.setProperties({
        title: `Historial Clínico - ${data.patient_name}`,
        subject: "Historial Médico Completo",
        author: "Sistema Médico Altheia",
        creator: "Altheia Medical Center",
      });

      const primaryColor = [41, 128, 185];
      const secondaryColor = [52, 73, 94];
      const accentColor = [231, 76, 60];
      const lightGray = [236, 240, 241];

      const addPageHeader = () => {
        pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.rect(0, 0, pageWidth, 8, "F");

        pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text("ALTHEIA EHR", margin, 15);

        pdf.setTextColor(
          secondaryColor[0],
          secondaryColor[1],
          secondaryColor[2]
        );
        pdf.setFontSize(8);
        pdf.setFont("helvetica", "normal");
        pdf.text(`Página ${pageNumber}`, pageWidth - margin - 15, 15);

        pdf.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
        pdf.setLineWidth(0.5);
        pdf.line(margin, 20, pageWidth - margin, 20);

        return 30;
      };

      const addPageFooter = () => {
        pdf.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
        pdf.setLineWidth(0.5);
        pdf.line(margin, pageHeight - 25, pageWidth - margin, pageHeight - 25);

        pdf.setTextColor(
          secondaryColor[0],
          secondaryColor[1],
          secondaryColor[2]
        );
        pdf.setFontSize(7);
        pdf.setFont("helvetica", "italic");
        const footerText = `Documento generado digitalmente el ${new Date().toLocaleDateString(
          "es-ES",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }
        )} | Sistema Médico Altheia`;
        pdf.text(footerText, pageWidth / 2, pageHeight - 15, {
          align: "center",
        });

        pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.rect(0, pageHeight - 8, pageWidth, 8, "F");
      };

      const addStyledText = (
        text: string,
        x: number,
        y: number,
        maxWidth: number,
        options: {
          fontSize?: number;
          font?: "normal" | "bold" | "italic";
          color?: number[];
          align?: "left" | "center" | "right";
          background?: boolean;
        } = {}
      ) => {
        const {
          fontSize = 10,
          font = "normal",
          color = [0, 0, 0],
          align = "left",
          background = false,
        } = options;

        pdf.setFontSize(fontSize);
        pdf.setFont("helvetica", font);
        pdf.setTextColor(color[0], color[1], color[2]);

        if (background) {
          const textWidth = pdf.getTextWidth(text);
          const textHeight = fontSize * 0.5;
          pdf.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
          pdf.rect(x - 2, y - textHeight, textWidth + 4, textHeight + 2, "F");
        }

        const lines = pdf.splitTextToSize(text, maxWidth);
        if (align === "center") {
          pdf.text(lines, x + maxWidth / 2, y, { align: "center" });
        } else if (align === "right") {
          pdf.text(lines, x + maxWidth, y, { align: "right" });
        } else {
          pdf.text(lines, x, y);
        }

        return y + lines.length * (fontSize * 0.4) + 2;
      };

      const addProfessionalTable = (
        headers: string[],
        rows: string[][],
        startY: number,
        options: {
          headerColor?: number[];
          alternateRows?: boolean;
          columnWidths?: number[];
          minRowHeight?: number;
        } = {}
      ) => {
        const {
          headerColor = primaryColor,
          alternateRows = true,
          columnWidths,
          minRowHeight = 6,
        } = options;

        const colWidths =
          columnWidths ||
          headers.map(() => (pageWidth - 2 * margin) / headers.length);
        let currentY = startY;

        pdf.setFillColor(headerColor[0], headerColor[1], headerColor[2]);
        pdf.rect(margin, currentY, pageWidth - 2 * margin, 8, "F");

        let currentX = margin;
        headers.forEach((header, index) => {
          pdf.setTextColor(255, 255, 255);
          pdf.setFontSize(9);
          pdf.setFont("helvetica", "bold");
          pdf.text(header, currentX + 2, currentY + 5.5);
          currentX += colWidths[index];
        });
        currentY += 8;

        rows.forEach((row, rowIndex) => {
          let maxLines = 1;
          row.forEach((cell, cellIndex) => {
            const cellLines = pdf.splitTextToSize(
              cell,
              colWidths[cellIndex] - 4
            );
            maxLines = Math.max(maxLines, cellLines.length);
          });

          const rowHeight = Math.max(minRowHeight, maxLines * 3 + 2);

          if (alternateRows && rowIndex % 2 === 0) {
            pdf.setFillColor(250, 250, 250);
            pdf.rect(margin, currentY, pageWidth - 2 * margin, rowHeight, "F");
          }

          currentX = margin;
          row.forEach((cell, cellIndex) => {
            pdf.setTextColor(
              secondaryColor[0],
              secondaryColor[1],
              secondaryColor[2]
            );
            pdf.setFontSize(8);
            pdf.setFont("helvetica", "normal");
            const cellText = pdf.splitTextToSize(
              cell,
              colWidths[cellIndex] - 4
            );
            pdf.text(cellText, currentX + 2, currentY + 4);
            currentX += colWidths[cellIndex];
          });
          currentY += rowHeight;
        });

        pdf.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
        pdf.setLineWidth(0.3);
        pdf.rect(margin, startY, pageWidth - 2 * margin, currentY - startY);

        return currentY + 5;
      };

      const checkNewPage = (requiredHeight: number) => {
        if (yPosition + requiredHeight > pageHeight - 35) {
          addPageFooter();
          pdf.addPage();
          pageNumber++;
          yPosition = addPageHeader();
        }
      };

      yPosition = addPageHeader();

      pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.rect(margin - 5, yPosition, pageWidth - 2 * margin + 10, 25, "F");

      yPosition = addStyledText(
        "HISTORIAL CLÍNICO MÉDICO",
        margin,
        yPosition + 8,
        pageWidth - 2 * margin,
        {
          fontSize: 20,
          font: "bold",
          color: [255, 255, 255],
          align: "center",
        }
      );

      yPosition = addStyledText(
        "Registro Médico Completo",
        margin,
        yPosition + 2,
        pageWidth - 2 * margin,
        {
          fontSize: 12,
          font: "italic",
          color: [255, 255, 255],
          align: "center",
        }
      );

      yPosition += 15;

      checkNewPage(60);
      yPosition = addStyledText(
        "INFORMACIÓN DEL PACIENTE",
        margin,
        yPosition,
        pageWidth - 2 * margin,
        {
          fontSize: 14,
          font: "bold",
          color: primaryColor,
        }
      );
      yPosition += 5;

      const patientHeaders = ["Campo", "Información"];
      const patientRows = [
        ["Nombre Completo", data.patient_name],
        ["Identificación del Paciente", data.patient_id],
        ["Motivo Principal de Consulta", data.consult_reason],
        [
          "Total de Consultas Registradas",
          `${data.total_consultations} consulta${
            data.total_consultations !== 1 ? "s" : ""
          }`,
        ],
        [
          "Historial Creado",
          new Date(data.created_at).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        ],
        [
          "Última Actualización",
          new Date(data.last_update).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        ],
      ];

      yPosition = addProfessionalTable(patientHeaders, patientRows, yPosition, {
        headerColor: primaryColor,
      });
      yPosition += 10;

      checkNewPage(40);
      yPosition = addStyledText(
        "INFORMACIÓN PERSONAL Y ANTECEDENTES",
        margin,
        yPosition,
        pageWidth - 2 * margin,
        {
          fontSize: 14,
          font: "bold",
          color: primaryColor,
        }
      );
      yPosition += 8;

      pdf.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
      const personalInfoHeight = 25;
      pdf.rect(
        margin,
        yPosition - 3,
        pageWidth - 2 * margin,
        personalInfoHeight,
        "F"
      );
      pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.setLineWidth(0.8);
      pdf.rect(
        margin,
        yPosition - 3,
        pageWidth - 2 * margin,
        personalInfoHeight
      );

      yPosition = addStyledText(
        "Información Personal:",
        margin + 5,
        yPosition + 3,
        pageWidth - 2 * margin - 10,
        {
          fontSize: 11,
          font: "bold",
          color: secondaryColor,
        }
      );
      yPosition = addStyledText(
        data.personal_info,
        margin + 5,
        yPosition + 2,
        pageWidth - 2 * margin - 10,
        {
          fontSize: 9,
          color: secondaryColor,
        }
      );
      yPosition += 15;

      checkNewPage(30);
      pdf.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
      const familyInfoHeight = 25;
      pdf.rect(
        margin,
        yPosition - 3,
        pageWidth - 2 * margin,
        familyInfoHeight,
        "F"
      );
      pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.setLineWidth(0.8);
      pdf.rect(margin, yPosition - 3, pageWidth - 2 * margin, familyInfoHeight);

      yPosition = addStyledText(
        "Antecedentes Familiares:",
        margin + 5,
        yPosition + 3,
        pageWidth - 2 * margin - 10,
        {
          fontSize: 11,
          font: "bold",
          color: secondaryColor,
        }
      );
      yPosition = addStyledText(
        data.family_info,
        margin + 5,
        yPosition + 2,
        pageWidth - 2 * margin - 10,
        {
          fontSize: 9,
          color: secondaryColor,
        }
      );
      yPosition += 15;

      checkNewPage(30);
      yPosition = addStyledText(
        "ALERGIAS Y CONTRAINDICACIONES",
        margin,
        yPosition,
        pageWidth - 2 * margin,
        {
          fontSize: 14,
          font: "bold",
          color: accentColor,
        }
      );
      yPosition += 5;

      pdf.setFillColor(255, 245, 245);
      const allergiesHeight = 20;
      pdf.rect(
        margin,
        yPosition - 3,
        pageWidth - 2 * margin,
        allergiesHeight,
        "F"
      );
      pdf.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
      pdf.setLineWidth(1);
      pdf.rect(margin, yPosition - 3, pageWidth - 2 * margin, allergiesHeight);

      yPosition = addStyledText(
        "IMPORTANTE - Alergias conocidas:",
        margin + 5,
        yPosition + 3,
        pageWidth - 2 * margin - 10,
        {
          fontSize: 10,
          font: "bold",
          color: accentColor,
        }
      );
      yPosition = addStyledText(
        data.allergies,
        margin + 5,
        yPosition + 2,
        pageWidth - 2 * margin - 10,
        {
          fontSize: 9,
          color: secondaryColor,
        }
      );
      yPosition += 12;

      checkNewPage(30);
      yPosition = addStyledText(
        "OBSERVACIONES CLÍNICAS",
        margin,
        yPosition,
        pageWidth - 2 * margin,
        {
          fontSize: 14,
          font: "bold",
          color: primaryColor,
        }
      );
      yPosition += 5;

      pdf.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
      const observationsHeight = 20;
      pdf.rect(
        margin,
        yPosition - 3,
        pageWidth - 2 * margin,
        observationsHeight,
        "F"
      );
      pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.setLineWidth(0.8);
      pdf.rect(
        margin,
        yPosition - 3,
        pageWidth - 2 * margin,
        observationsHeight
      );

      yPosition = addStyledText(
        data.observations,
        margin + 5,
        yPosition + 3,
        pageWidth - 2 * margin - 10,
        {
          fontSize: 9,
          color: secondaryColor,
        }
      );
      yPosition += 20;

      if (data.consultations && data.consultations.length > 0) {
        checkNewPage(50);

        pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.rect(margin - 5, yPosition, pageWidth - 2 * margin + 10, 15, "F");
        yPosition = addStyledText(
          `REGISTRO DE CONSULTAS MÉDICAS (${data.total_consultations})`,
          margin,
          yPosition + 5,
          pageWidth - 2 * margin,
          {
            fontSize: 16,
            font: "bold",
            color: [255, 255, 255],
            align: "center",
          }
        );
        yPosition += 15;

        data.consultations.forEach((consultation, index) => {
          const consultationNumber = data.total_consultations - index;

          checkNewPage(100);

          pdf.setFillColor(250, 250, 250);
          pdf.rect(margin, yPosition, pageWidth - 2 * margin, 15, "F");
          pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          pdf.setLineWidth(1);
          pdf.rect(margin, yPosition, pageWidth - 2 * margin, 15);

          yPosition = addStyledText(
            `CONSULTA MÉDICA #${consultationNumber}`,
            margin + 5,
            yPosition + 6,
            pageWidth - 2 * margin - 10,
            {
              fontSize: 11,
              font: "bold",
              color: primaryColor,
            }
          );

          const consultDate = new Date(
            consultation.metadata.consult_date
          ).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          yPosition = addStyledText(
            `Fecha: ${consultDate}`,
            margin + 5,
            yPosition + 2,
            pageWidth - 2 * margin - 10,
            {
              fontSize: 9,
              color: secondaryColor,
            }
          );
          yPosition += 10;

          const doctorHeaders = ["Información del Médico Tratante", "Detalles"];
          const doctorRows = [
            ["Nombre del Médico", consultation.physician_info.name],
            [
              "Especialidad Médica",
              consultation.physician_info.physician_specialty,
            ],
            ["Correo Electrónico", consultation.physician_info.email],
            ["Teléfono de Contacto", consultation.physician_info.phone],
          ];

          yPosition = addProfessionalTable(
            doctorHeaders,
            doctorRows,
            yPosition,
            {
              headerColor: [46, 125, 50],
              columnWidths: [85, 85],
              minRowHeight: 10,
            }
          );
          yPosition += 5;

          const clinicalHeaders = ["Aspecto Clínico", "Descripción Detallada"];
          const clinicalRows = [
            ["Síntomas Presentados", consultation.symptoms],
            ["Diagnóstico Médico", consultation.diagnosis],
            ["Tratamiento Prescrito", consultation.treatment],
            ["Notas Clínicas Adicionales", consultation.notes],
          ];

          yPosition = addProfessionalTable(
            clinicalHeaders,
            clinicalRows,
            yPosition,
            {
              headerColor: primaryColor,
              columnWidths: [50, 120],
              minRowHeight: 15,
            }
          );

          if (
            consultation.prescriptions &&
            consultation.prescriptions.length > 0
          ) {
            yPosition += 5;
            checkNewPage(40);

            yPosition = addStyledText(
              `PRESCRIPCIONES MÉDICAS (${consultation.prescriptions.length})`,
              margin,
              yPosition,
              pageWidth - 2 * margin,
              {
                fontSize: 12,
                font: "bold",
                color: [46, 125, 50],
              }
            );
            yPosition += 5;

            const prescriptionHeaders = [
              "Medicamento",
              "Dosis",
              "Frecuencia",
              "Duración",
            ];
            const prescriptionRows = consultation.prescriptions.map(
              (prescription) => [
                prescription.medicine,
                prescription.dosage,
                prescription.frequency,
                prescription.duration,
              ]
            );

            yPosition = addProfessionalTable(
              prescriptionHeaders,
              prescriptionRows,
              yPosition,
              {
                headerColor: [46, 125, 50],
                columnWidths: [50, 30, 45, 45],
                minRowHeight: 8,
              }
            );

            consultation.prescriptions.forEach((prescription, pIndex) => {
              if (
                prescription.instructions &&
                prescription.instructions.trim()
              ) {
                checkNewPage(15);
                yPosition = addStyledText(
                  `Instrucciones para ${prescription.medicine}:`,
                  margin + 5,
                  yPosition,
                  pageWidth - 2 * margin - 10,
                  {
                    fontSize: 9,
                    font: "bold",
                    color: [46, 125, 50],
                  }
                );
                yPosition = addStyledText(
                  prescription.instructions,
                  margin + 10,
                  yPosition + 2,
                  pageWidth - 2 * margin - 15,
                  {
                    fontSize: 8,
                    color: secondaryColor,
                  }
                );
                yPosition += 5;
              }
            });
          }

          yPosition += 15;
        });
      }

      addPageFooter();

      const fileName = `historial-clinico-${data.patient_name
        .replace(/\s+/g, "-")
        .toLowerCase()}-${new Date().toISOString().split("T")[0]}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error al generar el PDF. Por favor, inténtelo de nuevo.");
    }
  };

  const getSpecialtyIcon = (specialty: string) => {
    if (specialty.includes("Cardiología")) return <Heart className="h-4 w-4" />;
    if (specialty.includes("Endocrinología"))
      return <Activity className="h-4 w-4" />;
    return <Stethoscope className="h-4 w-4" />;
  };

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
      transition: { type: "spring" as const, stiffness: 300, damping: 24 },
    },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-screen-xl w-[95vw] h-[85vh] p-0 flex flex-col">
        <DialogHeader className="px-4 sm:px-6 py-3 sm:py-4 border-b">
          <div className="flex items-start gap-3">
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
              <FileText className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-lg sm:text-xl font-semibold whitespace-normal">
                Historial Clínico
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm whitespace-normal">
                {data
                  ? `${data.patient_name} • ${
                      data.total_consultations
                    } consulta${data.total_consultations !== 1 ? "s" : ""}`
                  : "Cargando información…"}
              </DialogDescription>
            </div>
          </div>

          {data && (
            <div className="mt-3 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPDFPreview(true)}
              >
                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden md:inline">Vista Previa</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden md:inline">Imprimir</span>
              </Button>
              <Button size="sm" onClick={handleDownloadPDF}>
                <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">PDF</span>
              </Button>
            </div>
          )}
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3 sm:p-4 lg:p-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <p className="text-sm text-slate-600">
                    Cargando historial médico...
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center min-h-[400px] p-8">
                <div className="text-center max-w-md">
                  <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    ¡Historial no disponible!
                  </h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">{error}</p>

                  <div className="space-y-4">
                    <Button
                      onClick={loadMedicalHistory}
                      variant="outline"
                      className="w-full"
                    >
                      🔄 Reintentar
                    </Button>

                    {error.includes("historial médico registrado") ? (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                        <h4 className="font-medium text-blue-900 mb-2">
                          🩺 ¿Cómo crear tu historial médico?
                        </h4>
                        <p className="text-sm text-blue-800 mb-3">
                          Tu historial médico se creará automáticamente cuando
                          tengas tu primera consulta médica. Para empezar:
                        </p>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>
                            • 📅 Agenda una cita con un médico de la clínica
                          </li>
                          <li>• 🏥 Asiste a tu consulta médica</li>
                          <li>
                            • 📋 El médico registrará tu información y
                            diagnóstico
                          </li>
                          <li>
                            • ✅ Tu historial estará disponible inmediatamente
                            después
                          </li>
                        </ul>
                      </div>
                    ) : error.includes("servidor") ? (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-left">
                        <h4 className="font-medium text-amber-900 mb-2">
                          ⚠️ Error temporal del servidor
                        </h4>
                        <p className="text-sm text-amber-800">
                          Hay un problema temporal con el servidor. Por favor,
                          inténtalo de nuevo en unos minutos.
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : data ? (
              <motion.div
                initial="hidden"
                animate="show"
                variants={container}
                className="space-y-4 sm:space-y-6"
              >
                {/* Patient Information */}
                <motion.div variants={item}>
                  <Card>
                    <CardHeader className="pb-3 sm:pb-6">
                      <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                        Información del Paciente
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1">
                            Nombre Completo
                          </p>
                          <p className="font-semibold text-sm sm:text-base truncate">
                            {data.patient_name}
                          </p>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1">
                            ID del Paciente
                          </p>
                          <p className="font-mono text-xs sm:text-sm truncate">
                            {data.patient_id}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1">
                            Total de Consultas
                          </p>
                          <Badge variant="secondary" className="text-xs">
                            {data.total_consultations} consulta
                            {data.total_consultations !== 1 ? "s" : ""}
                          </Badge>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1">
                            Última Actualización
                          </p>
                          <p className="text-xs sm:text-sm truncate">
                            {new Date(data.last_update).toLocaleDateString(
                              "es-ES",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1">
                            Historial Creado
                          </p>
                          <p className="text-xs sm:text-sm truncate">
                            {new Date(data.created_at).toLocaleDateString(
                              "es-ES",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                        <div className="min-w-0 sm:col-span-2 lg:col-span-1">
                          <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1">
                            Motivo de Consulta
                          </p>
                          <p className="text-xs sm:text-sm line-clamp-2">
                            {data.consult_reason}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Personal and Family Information */}
                <motion.div
                  variants={item}
                  className="grid gap-4 sm:gap-6 lg:grid-cols-2"
                >
                  <Card>
                    <CardHeader className="pb-3 sm:pb-6">
                      <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <FileUser className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                        Información Personal
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {data.personal_info}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3 sm:pb-6">
                      <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                        Antecedentes Familiares
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {data.family_info}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Allergies and Observations */}
                <motion.div
                  variants={item}
                  className="grid gap-4 sm:gap-6 lg:grid-cols-2"
                >
                  <Card>
                    <CardHeader className="pb-3 sm:pb-6">
                      <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                        Alergias
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {data.allergies.split(",").map((allergy, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-2 sm:p-3 bg-red-50 rounded-lg border border-red-200"
                          >
                            <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-red-600 flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-medium text-red-800 min-w-0 flex-1">
                              {allergy.trim()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3 sm:pb-6">
                      <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                        Observaciones
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {data.observations}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Consultations */}
                <motion.div variants={item}>
                  <Card>
                    <CardHeader className="pb-3 sm:pb-6">
                      <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <Stethoscope className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                        Consultas Médicas ({data.total_consultations})
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        Historial completo de consultas médicas ordenadas
                        cronológicamente
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 sm:space-y-4 pt-0">
                      {data.consultations.map((consultation, index) => (
                        <motion.div
                          key={consultation.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Collapsible
                            open={expandedConsultations.includes(
                              consultation.id
                            )}
                            onOpenChange={() =>
                              toggleConsultation(consultation.id)
                            }
                          >
                            <CollapsibleTrigger asChild>
                              <div className="w-full cursor-pointer rounded-lg border p-3 sm:p-4 hover:bg-slate-50 transition-colors">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
                                    <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
                                      {getSpecialtyIcon(
                                        consultation.physician_info
                                          .physician_specialty
                                      )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <h3 className="font-semibold text-slate-900 text-sm sm:text-base">
                                          Consulta #
                                          {data.total_consultations - index}
                                        </h3>
                                        <Badge
                                          variant="secondary"
                                          className="text-xs"
                                        >
                                          {consultation.prescriptions?.length ||
                                            0}{" "}
                                          Rx
                                        </Badge>
                                      </div>
                                      <div className="grid sm:grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm text-slate-600 mb-2">
                                        <div className="flex items-center gap-1 min-w-0">
                                          <Calendar className="h-3 w-3 flex-shrink-0" />
                                          <span className="truncate">
                                            {new Date(
                                              consultation.metadata.consult_date
                                            ).toLocaleDateString("es-ES", {
                                              day: "numeric",
                                              month: "short",
                                              year: "numeric",
                                            })}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-1 min-w-0">
                                          <User className="h-3 w-3 flex-shrink-0" />
                                          <span className="truncate">
                                            {consultation.physician_info.name}
                                          </span>
                                        </div>
                                      </div>
                                      <p className="text-xs sm:text-sm text-slate-700 line-clamp-2">
                                        <span className="font-medium">
                                          Diagnóstico:
                                        </span>{" "}
                                        {consultation.diagnosis}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                    <Badge
                                      variant="outline"
                                      className="text-xs hidden sm:block"
                                    >
                                      {
                                        consultation.physician_info
                                          .physician_specialty
                                      }
                                    </Badge>
                                    {expandedConsultations.includes(
                                      consultation.id
                                    ) ? (
                                      <ChevronDown className="h-4 w-4 text-slate-400" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4 text-slate-400" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="mt-2 sm:mt-4 p-3 sm:p-4 bg-slate-50 rounded-lg border">
                                <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
                                  <div className="space-y-2 sm:space-y-3">
                                    <div>
                                      <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1">
                                        Síntomas
                                      </p>
                                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                                        {consultation.symptoms}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1">
                                        Diagnóstico
                                      </p>
                                      <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                                        {consultation.diagnosis}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1">
                                        Tratamiento
                                      </p>
                                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                                        {consultation.treatment}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="space-y-2 sm:space-y-3">
                                    <div>
                                      <p className="text-xs sm:text-sm font-medium text-slate-600 mb-2">
                                        Médico Tratante
                                      </p>
                                      <div className="space-y-1">
                                        <p className="text-xs sm:text-sm font-medium truncate">
                                          {consultation.physician_info.name}
                                        </p>
                                        <p className="text-xs text-slate-600 truncate">
                                          {
                                            consultation.physician_info
                                              .physician_specialty
                                          }
                                        </p>
                                        <p className="text-xs text-slate-600 truncate">
                                          {consultation.physician_info.email}
                                        </p>
                                        <p className="text-xs text-slate-600 truncate">
                                          {consultation.physician_info.phone}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-3 sm:mt-4">
                                  <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1">
                                    Notas Clínicas
                                  </p>
                                  <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                                    {consultation.notes}
                                  </p>
                                </div>

                                {/* Prescriptions */}
                                {consultation.prescriptions &&
                                  consultation.prescriptions.length > 0 && (
                                    <div className="mt-3 sm:mt-4">
                                      <p className="text-xs sm:text-sm font-medium text-slate-600 mb-2">
                                        Prescripciones (
                                        {consultation.prescriptions.length})
                                      </p>
                                      <div className="space-y-2">
                                        {consultation.prescriptions.map(
                                          (prescription) => (
                                            <div
                                              key={prescription.id}
                                              className="p-2 sm:p-3 bg-green-50 rounded-lg border border-green-200"
                                            >
                                              <div className="flex items-start gap-2 sm:gap-3">
                                                <Pill className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <span className="font-medium text-green-800 text-xs sm:text-sm truncate">
                                                      {prescription.medicine}
                                                    </span>
                                                    <Badge
                                                      variant="secondary"
                                                      className="text-xs flex-shrink-0"
                                                    >
                                                      {prescription.dosage}
                                                    </Badge>
                                                  </div>
                                                  <div className="grid gap-1 text-xs">
                                                    <p className="text-slate-600 truncate">
                                                      <span className="font-medium">
                                                        Frecuencia:
                                                      </span>{" "}
                                                      {prescription.frequency}
                                                    </p>
                                                    <p className="text-slate-600 truncate">
                                                      <span className="font-medium">
                                                        Duración:
                                                      </span>{" "}
                                                      {prescription.duration}
                                                    </p>
                                                    <p className="text-slate-600 line-clamp-2">
                                                      <span className="font-medium">
                                                        Instrucciones:
                                                      </span>{" "}
                                                      {
                                                        prescription.instructions
                                                      }
                                                    </p>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ) : (
              <div className="flex items-center justify-center min-h-[400px] p-8">
                <div className="text-center max-w-md">
                  <FileText className="h-16 w-16 text-slate-400 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    Sin historial médico
                  </h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    No se pudo cargar tu historial médico en este momento.
                  </p>

                  <div className="space-y-4">
                    <Button
                      onClick={loadMedicalHistory}
                      variant="outline"
                      className="w-full"
                    >
                      🔄 Reintentar
                    </Button>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                      <h4 className="font-medium text-blue-900 mb-2">
                        💡 Posibles causas
                      </h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Aún no tienes consultas médicas registradas</li>
                        <li>• Problema temporal de conexión</li>
                        <li>• El servidor está procesando tu información</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>

      {/* PDF Preview Dialog */}
      {data && (
        <Dialog open={showPDFPreview} onOpenChange={setShowPDFPreview}>
          <DialogContent className="max-w-4xl w-[90vw] h-[85vh] p-0 flex flex-col">
            <DialogHeader className="px-4 sm:px-6 py-3 sm:py-4 pr-12 sm:pr-16 border-b flex-shrink-0">
              <DialogTitle className="text-lg sm:text-xl">
                Vista Previa del Historial Clínico
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">
                Vista previa del documento que se generará en PDF
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto">
              <div className="p-3 sm:p-4 lg:p-6">
                <div ref={printRef} className="space-y-6 bg-white">
                  {/* PDF Content Preview */}
                  <div className="text-center border-b pb-4">
                    <h1 className="text-2xl font-bold text-slate-900">
                      HISTORIAL CLÍNICO
                    </h1>
                    <p className="text-slate-600 mt-2">{data?.patient_name}</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900 mb-3">
                        INFORMACIÓN DEL PACIENTE
                      </h2>
                      <div className="grid gap-2 text-sm">
                        <p>
                          <strong>Nombre:</strong> {data?.patient_name}
                        </p>
                        <p>
                          <strong>ID del Paciente:</strong> {data?.patient_id}
                        </p>
                        <p>
                          <strong>Motivo de Consulta:</strong>{" "}
                          {data?.consult_reason}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold text-slate-900 mb-3">
                        INFORMACIÓN PERSONAL
                      </h2>
                      <p className="text-sm">{data?.personal_info}</p>
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold text-slate-900 mb-3">
                        ANTECEDENTES FAMILIARES
                      </h2>
                      <p className="text-sm">{data?.family_info}</p>
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold text-slate-900 mb-3">
                        ALERGIAS
                      </h2>
                      <p className="text-sm">{data?.allergies}</p>
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold text-slate-900 mb-3">
                        OBSERVACIONES
                      </h2>
                      <p className="text-sm">{data?.observations}</p>
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold text-slate-900 mb-3">
                        CONSULTAS ({data?.total_consultations})
                      </h2>
                      <div className="space-y-4">
                        {data?.consultations?.map((consultation, index) => (
                          <div
                            key={consultation.id}
                            className="border rounded-lg p-4"
                          >
                            <h3 className="font-semibold text-slate-900 mb-2">
                              Consulta #
                              {(data?.total_consultations || 0) - index}
                            </h3>
                            <div className="grid gap-2 text-sm">
                              <p>
                                <strong>Fecha:</strong>{" "}
                                {new Date(
                                  consultation.metadata.consult_date
                                ).toLocaleDateString("es-ES")}
                              </p>
                              <p>
                                <strong>Médico:</strong>{" "}
                                {consultation.physician_info.name} -{" "}
                                {
                                  consultation.physician_info
                                    .physician_specialty
                                }
                              </p>
                              <p>
                                <strong>Síntomas:</strong>{" "}
                                {consultation.symptoms}
                              </p>
                              <p>
                                <strong>Diagnóstico:</strong>{" "}
                                {consultation.diagnosis}
                              </p>
                              <p>
                                <strong>Tratamiento:</strong>{" "}
                                {consultation.treatment}
                              </p>
                              <p>
                                <strong>Notas:</strong> {consultation.notes}
                              </p>
                              {consultation.prescriptions &&
                                consultation.prescriptions.length > 0 && (
                                  <div>
                                    <strong>Prescripciones:</strong>
                                    <ul className="ml-4 mt-1 space-y-1">
                                      {consultation.prescriptions.map(
                                        (prescription) => (
                                          <li key={prescription.id}>
                                            • {prescription.medicine}{" "}
                                            {prescription.dosage} -{" "}
                                            {prescription.frequency} por{" "}
                                            {prescription.duration}
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-center text-xs text-slate-500 border-t pt-4">
                    <p>
                      Historial generado el{" "}
                      {new Date().toLocaleDateString("es-ES")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-3 sm:p-4 border-t flex-shrink-0">
              <Button
                variant="outline"
                onClick={() => setShowPDFPreview(false)}
                size="sm"
              >
                Cerrar
              </Button>
              <Button
                onClick={handleDownloadPDF}
                className="gap-1 sm:gap-2"
                size="sm"
              >
                <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Descargar</span> PDF
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
}
