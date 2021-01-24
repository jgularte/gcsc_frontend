import {ChangeDetectionStrategy, Component, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {addDays, addHours, endOfDay, endOfMonth, isSameDay, isSameMonth, startOfDay, subDays} from 'date-fns';
import {Subject} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
  CalendarMonthViewDay,
  CalendarDateFormatter
} from 'angular-calendar';
import {ReservationsService} from '../services/reservations.service';
import {ReservationsModel} from '../models/reservations.model';
import {UserInfoService} from '../services/user-info.service';
import {UserInfoModel} from '../models/user-info.model';
import {CustomDateFormatter} from "./custom-date-formatter.provider";

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
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter
    }
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
    this.events = this.convertReservationsToEvents(this.reservationsService.getReservations());
  }

  convertReservationsToEvents(rawData: ReservationsModel[]): CalendarEvent[] {
    const builtEvents = [];
    let resUserInfo: UserInfoModel;
    for (const res of rawData) {
      // get the corresponding user info for the given reservation
      resUserInfo = this.userInfoService.getUserInfo(res.user_guid)
      builtEvents.push(
        {
          start: startOfDay(new Date(res.epoch_start * 1000)),
          end: startOfDay(new Date(res.epoch_end * 1000)),
          title: `Reservation for ${res.user_guid}`,
          color: {
            primary: resUserInfo.primary_color,
            secondary: resUserInfo.secondary_color
          },
          actions: this.actions,
          resizable: {
            beforeStart: true,
            afterEnd: true,
          },
          meta: {
            incrementsBadgeTotal: false
          },
          draggable: true,
        }
      );
    }
    return builtEvents;
  }

  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    // todo currently nothing, place holding for now
  }

  dayClicked({date, events}: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.activeDayIsOpen = !((isSameDay(this.viewDate, date) && this.activeDayIsOpen) || events.length === 0);
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
    // todo await call to dynamo for successful deletion, handle error
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  closeOpenMonthViewDay(): void {
    this.activeDayIsOpen = false;
  }
}
