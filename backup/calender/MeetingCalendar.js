
'use client';

import { useRef, useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  List as ListIcon,
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { formatRange } from '@/lib/formatRange'; // create helper

export default function MeetingCalendar() {
  const calendarRef = useRef();
  const [currentView, setCurrentView] = useState('timeGridWeek');
  const [dateRange, setDateRange] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const now = new Date();

  const handleNav = (action) => {
    const api = calendarRef.current?.getApi();
    if (!api) return;

    if (action === 'prev') api.prev();
    if (action === 'next') api.next();
    if (action === 'today') api.today();

    updateRange(api);
  };

  const changeView = (viewName) => {
    const api = calendarRef.current?.getApi();
    api.changeView(viewName);
    setCurrentView(viewName);
    updateRange(api);
  };

  const updateRange = (api) => {
    const start = api.view.activeStart;
    const end = api.view.activeEnd;
    setDateRange(formatRange(start, end));
  };

  useEffect(() => {
    const api = calendarRef.current?.getApi();
    if (api) updateRange(api);
  }, []);

  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
    setIsModalOpen(true);
  };

  return (
    <>
      <Card className=" shadow bg-white dark:bg-zinc-900">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b px-4 py-2">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-green-600" />
            <CardTitle className="text-lg text-green-600">My Calendar</CardTitle>
          </div>

          <div className="text-sm text-muted-foreground">{dateRange}</div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => handleNav('prev')}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleNav('today')}>
              Today
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleNav('next')}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={currentView === 'timeGridDay' ? 'default' : 'outline'}
              onClick={() => changeView('timeGridDay')}
            >
              Day
            </Button>
            <Button
              size="sm"
              variant={currentView === 'timeGridWeek' ? 'default' : 'outline'}
              onClick={() => changeView('timeGridWeek')}
            >
              Week
            </Button>
            <Button
              size="sm"
              variant={currentView === 'listWeek' ? 'default' : 'outline'}
              onClick={() => changeView('listWeek')}
            >
              <ListIcon className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <FullCalendar
            ref={calendarRef}
            plugins={[timeGridPlugin, listPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={false}
            height="auto"
            allDaySlot={false}
            slotMinTime="06:00:00"
            slotMaxTime="22:00:00"
            nowIndicator={true}
            editable={true}
            selectable={true}
            events={[
              {
                id: '1',
                title: 'Team Sync',
                start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9),
                end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10),
                extendedProps: {
                  description: 'Daily stand-up with engineering team',
                  location: 'Zoom',
                },
              },
            ]}
            eventClick={handleEventClick}
            eventBackgroundColor="#22c55e"
            eventBorderColor="#15803d"
            eventTextColor="#fff"
            eventClassNames="rounded px-1 py-0.5 text-sm"
          />
        </CardContent>
      </Card>

      {/* 🧠 Modal for Event Details */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
            <DialogDescription>
              <div className="text-sm">
                <p><strong>Start:</strong> {selectedEvent?.start?.toLocaleString()}</p>
                <p><strong>End:</strong> {selectedEvent?.end?.toLocaleString()}</p>
                <p><strong>Location:</strong> {selectedEvent?.extendedProps?.location}</p>
                <p><strong>Description:</strong> {selectedEvent?.extendedProps?.description}</p>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
