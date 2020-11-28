import {ChangeDetectionStrategy, Component, TemplateRef, ViewChild} from '@angular/core';
import {addDays, addHours, endOfDay, endOfMonth, isSameDay, isSameMonth, startOfDay, subDays} from 'date-fns';
import {Subject} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView} from 'angular-calendar';
import {environment} from '../../environments/environment';
import {ReservationsService} from '../services/reservations.service';
import {ReservationsModel} from '../models/reservations.model';
import {UserInfoService} from '../services/user-info.service';
import {UserInfoModel} from '../models/user-info.model';

const colors = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar-page.component.html',
  styleUrls: [
    './calendar-page.component.css'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarPageComponent {
  @ViewChild('modalContent', {static: true}) modalContent: TemplateRef<any> | undefined;
  modalData: {
    action: string;
    event: CalendarEvent;
  } | undefined;

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({event}: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({event}: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh: Subject<any> = new Subject();
  activeDayIsOpen = false;
  events: CalendarEvent[] = [];
  userInfo: UserInfoModel[] = [];
  constructor(private modal: NgbModal,
              private reservationsService: ReservationsService,
              private userInfoService: UserInfoService) {
    this.userInfo = this.userInfoService.getUserInfo();
    this.events = this.convertReservationsToEvents(this.reservationsService.getReservations());
  }

  convertReservationsToEvents(rawData: ReservationsModel[]): CalendarEvent[] {
    const builtEvents = [];
    let singleUserInfo: UserInfoModel;
    for (const res of rawData) {
      // get the corresponding user info for the given reservation
      singleUserInfo = this.userInfo.filter(user => user.user_guid === res.user_guid)[0];
      builtEvents.push(
        {
          start: startOfDay(new Date(res.epoch_start * 1000)),
          end: startOfDay(new Date(res.epoch_end * 1000)),
          title: `Reservation for ${res.user_guid}`,
          color: {
            primary: singleUserInfo.primary_color,
            secondary: singleUserInfo.secondary_color
          },
          actions: this.actions,
          resizable: {
            beforeStart: true,
            afterEnd: true,
          },
          draggable: true,
        }
      );
    }
    return builtEvents;
  }

  dayClicked({date, events}: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = {event, action};
    this.modal.open(this.modalContent, {size: 'lg'});
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent): void {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  closeOpenMonthViewDay(): void {
    this.activeDayIsOpen = false;
  }
}
