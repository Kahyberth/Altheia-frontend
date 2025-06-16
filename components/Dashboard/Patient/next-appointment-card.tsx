import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CalendarSync, CalendarX, Clock, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { appointmentService } from "@/services/appointment.service";
import { useState } from "react";
import { addToast } from "@heroui/react";
import { RescheduleAppointmentDialog } from "@/components/reschedule-appointment-dialog";

interface NextAppointmentCardProps {
  appointment: {
    doctor: string;
    specialty: string;
    date: string;
    time: string;
    location: string;
    address: string;
    appointmentId: string;
    status: string;
    providerId?: string;
  };
}

export function NextAppointmentCard({ appointment }: NextAppointmentCardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);

  const handleReschedule = () => {
    setShowRescheduleDialog(true);
  };

  const handleCancel = async () => {
    if (!appointment.appointmentId) return;

    setIsLoading(true);
    try {
      await appointmentService.cancelAppointment(appointment.appointmentId);
      addToast({
        title: "Cita cancelada exitosamente",
        description: "Tu cita ha sido cancelada correctamente"
      });
      // Refresh the page to update the appointment status
      window.location.reload();
    } catch (error) {
      console.error("Error canceling appointment:", error);
      addToast({
        title: "Error",
        description: "Error al cancelar la cita. Inténtalo de nuevo."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRescheduleSuccess = () => {
    // Refresh the page to show updated appointment
    window.location.reload();
  };

  return (
    <>
      <Card className="bg-white/95 dark:bg-slate-800/90 shadow-lg rounded-2xl divide-y divide-slate-200 dark:divide-slate-700">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-xl font-semibold dark:text-white">
            <Calendar className="mr-2 h-5 w-5 text-primary" />
            Tu próxima cita
          </CardTitle>
        </CardHeader>

        <CardContent className="py-4 grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <p className="font-medium text-lg">{appointment.doctor}</p>
            <p className="text-sm text-muted-foreground">{appointment.specialty}</p>

            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-slate-400" />
              <time>{appointment.date}</time>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-slate-400" />
              <span>{appointment.time}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-slate-400" />
              <span>{appointment.location}</span>
            </div>
            {appointment.address && (
              <p className="text-xs text-slate-500 mt-1">{appointment.address}</p>
            )}
          </div>

          <div className="flex flex-col justify-end gap-3 md:gap-2">
            <Button 
              variant="default" 
              className="h-10 px-4 flex items-center justify-center gap-2"
              onClick={handleReschedule}
              disabled={isLoading}
            >
              <CalendarSync className="h-5 w-5" />
              Reprogramar
            </Button>
            <Button 
              variant="destructive" 
              className="h-10 px-4 flex items-center justify-center gap-2"
              onClick={handleCancel}
              disabled={isLoading || appointment.status === 'cancelled'}
            >
              <CalendarX className="h-5 w-5" />
              {isLoading ? "Cancelando..." : "Cancelar"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <RescheduleAppointmentDialog
        open={showRescheduleDialog}
        onOpenChange={setShowRescheduleDialog}
        appointment={{
          id: appointment.appointmentId,
          doctor: appointment.doctor,
          specialty: appointment.specialty,
          date: appointment.date,
          time: appointment.time,
          location: appointment.location,
          providerId: appointment.providerId,
        }}
        onRescheduleSuccess={handleRescheduleSuccess}
      />
    </>
  );
}
  