import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Suggestion } from '../types';

interface Rule {
  id: string;
  title: string;
  prompt: string;
  color: string;
  backgroundColor: string;
}

const getSuggestionCount = (suggestions: Suggestion[], ruleId: string) => {
  return suggestions.filter((s) => s.ruleId === ruleId).length;
};

export const RulesCardComponent = ({
  rules,
  suggestions,
}: {
  rules: Rule[];
  suggestions: Suggestion[];
}) => {
  return (
    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
      {rules.map((rule) => {
        const results = getSuggestionCount(suggestions, rule.id);
        return (
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
            <CardFooter>
              <div className="text-sm text-neutral-300">{results} results</div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};
