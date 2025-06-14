"use client";

import React, { useState } from "react";
import { FlaskConical } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface LabResult {
  testName: string;
  date: string; 
  result: string;
  status?: string;
}

interface LabResultsProps {
  results: LabResult[];
}

export default function LabResults({ results }: LabResultsProps) {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? results : results.slice(0, 5);

  return (
    <Card className="bg-white/95 dark:bg-slate-800/90 shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold dark:text-white">
          <FlaskConical className="h-5 w-5 text-cyan-600" />
          Resultados de Laboratorio
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <ul className="divide-y divide-slate-200 dark:divide-slate-700">
          {displayed.map((lab, idx) => (
            <li key={idx} className="py-2">
              <div className="flex justify-between items-center">
                <span className="font-medium dark:text-white">{lab.testName}</span>
                <time className="text-sm text-muted-foreground">{lab.date}</time>
              </div>
              <p className="text-sm dark:text-slate-300">{lab.result}</p>
              {lab.status && (
                <p className="text-xs text-slate-500 italic dark:text-slate-400">{lab.status}</p>
              )}
            </li>
          ))}
        </ul>
      </CardContent>

      {results.length > 5 && (
        <CardFooter className="flex justify-center">
          <Button variant="outline" className="h-10 px-4" onClick={() => setShowAll(!showAll)}>
            {showAll ? "Ver menos" : "Ver más"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
