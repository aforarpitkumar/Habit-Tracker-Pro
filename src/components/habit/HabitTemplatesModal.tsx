'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { HABIT_TEMPLATES, TEMPLATE_CATEGORIES, getTemplatesByCategory, searchTemplates, type HabitTemplate } from '@/lib/constants/habitTemplates';
import { getHabitIconEmoji } from '@/lib/utils';
import { getFrequencyDescription } from '@/lib/utils/frequency';
import { Search, Sparkles, Filter, Plus } from 'lucide-react';
import { useState } from 'react';

interface HabitTemplatesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (template: HabitTemplate) => void;
}

export function HabitTemplatesModal({ open, onOpenChange, onSelectTemplate }: HabitTemplatesModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const getFilteredTemplates = (): HabitTemplate[] => {
    let templates = HABIT_TEMPLATES;

    // Filter by category
    if (selectedCategory !== 'all') {
      templates = getTemplatesByCategory(selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      templates = searchTemplates(searchQuery).filter(template => 
        selectedCategory === 'all' || template.category === selectedCategory
      );
    }

    return templates;
  };

  const filteredTemplates = getFilteredTemplates();

  const handleSelectTemplate = (template: HabitTemplate) => {
    onSelectTemplate(template);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Choose a Habit Template
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                All
              </Button>
              {TEMPLATE_CATEGORIES.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Templates Grid */}
          <div className="overflow-y-auto max-h-[60vh]">
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No templates found matching your criteria.</p>
                <p className="text-sm">Try adjusting your search or category filter.</p>
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {filteredTemplates.map((template) => (
                  <Card 
                    key={template.id} 
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleSelectTemplate(template)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <span 
                          className="text-xl p-1 rounded" 
                          style={{ backgroundColor: `${template.color}20` }}
                        >
                          {getHabitIconEmoji(template.icon)}
                        </span>
                        <span className="flex-1">{template.name}</span>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <Plus className="h-3 w-3" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {template.description}
                      </p>
                      
                      <div className="flex justify-between items-center text-xs">
                        <Badge 
                          variant="secondary" 
                          style={{ 
                            backgroundColor: `${TEMPLATE_CATEGORIES.find(c => c.value === template.category)?.color}20`,
                            color: TEMPLATE_CATEGORIES.find(c => c.value === template.category)?.color
                          }}
                        >
                          {TEMPLATE_CATEGORIES.find(c => c.value === template.category)?.label}
                        </Badge>
                        <span className="text-muted-foreground">
                          {getFrequencyDescription(template.frequency)}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {template.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                            {tag}
                          </Badge>
                        ))}
                        {template.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            +{template.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground pt-4 border-t">
            <p>Click on any template to use it as a starting point for your habit.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}