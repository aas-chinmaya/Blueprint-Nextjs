'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import MeetingCalendar from './MeetingCalendar';
import SlotsManager from './SlotsManager';

export default function CalendarContainer() {
  const [activeTab, setActiveTab] = useState('calendar');

  return (
    <Card className="w-full rounded-2xl shadow">
      <CardHeader className="flex justify-between items-center border-b px-4 py-2">
        <h2 className="text-lg font-medium">Schedule</h2>
        <div className="flex space-x-2">
          <Button
            variant={activeTab === 'calendar' ? 'default' : 'outline'}
            onClick={() => setActiveTab('calendar')}
          >
            Calendar
          </Button>
          <Button
            variant={activeTab === 'slots' ? 'default' : 'outline'}
            onClick={() => setActiveTab('slots')}
          >
            Slots
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {activeTab === 'calendar' ? <MeetingCalendar /> : <SlotsManager />}
      </CardContent>
    </Card>
  );
}
