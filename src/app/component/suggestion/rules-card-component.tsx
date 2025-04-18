import { useEditorStore } from '@/app/store/use-editor-store';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useState, useEffect } from 'react';

interface Rule {
  id: string;
  title: string;
  prompt: string;
  color: string;
  backgroundColor: string;
}

export const RulesCardComponent = ({ rules }: { rules: Rule[] }) => {
  return (
    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
      {rules.map((rule) => (
        <Card key={rule.id} className="relative overflow-hidden p-1]">
          <div
            className="absolute left-0 top-0 h-full w-2"
            style={{ backgroundColor: rule.backgroundColor }}
          ></div>
          <CardHeader className="pl-6 ">
            <CardTitle className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: rule.color }}
              />
              {rule.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-6 text-sm text-gray-600">
            {rule.prompt}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
