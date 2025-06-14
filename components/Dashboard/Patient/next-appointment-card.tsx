import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CalendarSync, CalendarX, Clock, MapPin } from "lucide-react";

export function NextAppointmentCard({ appointment }: { appointment: any }) {
    return (
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
              <time dateTime="2025-06-15">{appointment.date}</time>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-slate-400" />
              <span>{appointment.time}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-slate-400" />
              <span>{appointment.location}</span>
            </div>
          </div>
  
          <CardFooter className="pt-4 flex flex-col justify-end gap-3 md:gap-2">
            <Button variant="default" className="h-10 px-4 flex items-center justify-center gap-2">
              <CalendarSync className="h-5 w-5" />
              Reprogramar
            </Button>
            <Button variant="destructive" className="h-10 px-4 flex items-center justify-center gap-2">
              <CalendarX className="h-5 w-5" />
              Cancelar
            </Button>
          </CardFooter>
        </CardContent>
      </Card>
    );
  }
  