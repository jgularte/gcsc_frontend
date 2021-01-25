import {ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {addDays, addHours, endOfDay, endOfMonth, isSameDay, isSameMonth, startOfDay, subDays} from 'date-fns';
import {Subject} from 'rxjs';
import {environment} from "../../environments/environment";
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
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";

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
export class CalendarPageComponent implements OnInit {
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

  // form
  addResForm: FormGroup;

  constructor(private modal: NgbModal,
              private reservationsService: ReservationsService,
              private authService: AuthService,
              private userInfoService: UserInfoService) {
    this.addResForm = new FormGroup(
      {
        user: new FormControl(this.authService.getCurrentUser(), Validators.required),
        start_date: new FormControl("", Validators.required),
        end_date: new FormControl("", Validators.required),
        type: new FormControl("", Validators.required)
      }
    );
  }

  ngOnInit() {
    this.reservationsService.getReservations()
      .subscribe(data => {
        if (environment.environment === 'mock') {
          data = this.updateLocalData(data);
        }
        if (data.length >= 1) {
          console.log("hello")
          for (const res of data) {
            this.addEvent(this.convertReservationToEvent(res));
          }
        }
      });
  }

  updateLocalData(rawData: ReservationsModel[]): ReservationsModel[] {
    // for res_0, will do current_time-5days to current_time-2days;
    rawData[0].epoch_start = subDays(new Date(), 5).getTime() / 1000
    rawData[0].epoch_end = subDays(new Date(), 2).getTime() / 1000
    // for res_1 will do current_time-2days to current_time+4days;
    rawData[1].epoch_start = subDays(new Date(), 2).getTime() / 1000
    rawData[1].epoch_end = addDays(new Date(), 4).getTime() / 1000
    // for res_2 will do current_time+1day to current_time+10days;
    rawData[2].epoch_start = addDays(new Date(), 1).getTime() / 1000
    rawData[2].epoch_end = addDays(new Date(), 10).getTime() / 1000
    return rawData
  }

  addFromForm(): void {
    // todo check with reservation service to make sure its still available
    // if so, convert Form to ReservationModel
    const resModel: ReservationsModel = {
      reservation_guid: "0",
      user_guid: this.authService.getCurrentUser(),
      epoch_start: (new Date(this.addResForm.value.start_date)).getTime() / 1000,
      epoch_end: (new Date(this.addResForm.value.end_date)).getTime() / 1000,
      reservation_type: this.addResForm.value.type
    }
    this.reservationsService.createReservation(resModel).subscribe();
    // todo and add reservation to aws via res service
    // todo if no error, push convert from to CalendarEvent and push onto events array
    this.addEvent(this.convertReservationToEvent(resModel));
  }

  convertReservationToEvent(res: ReservationsModel): CalendarEvent {
    let resUserInfo: UserInfoModel;
    // get the corresponding user info for the given reservation
    resUserInfo = this.userInfoService.getUserInfo(res.user_guid)
    return {
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
  }

  addEvent(new_event: CalendarEvent): void {
    this.events = [
      ...this.events,
      new_event,
    ];
    this.refresh.next(0)
  }

  deleteEvent(eventToDelete: CalendarEvent): void {
    // todo await call to dynamo for successful deletion, handle error
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  /*
    Calendar Helper Functions Below
   */

  dayClicked({date, events}: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.activeDayIsOpen = !((isSameDay(this.viewDate, date) && this.activeDayIsOpen) || events.length === 0);
      this.viewDate = date;
    }
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = {event, action};
    this.modal.open(this.modalContent, {size: 'lg'});
  }

  eventTimesChanged({event, newStart, newEnd}: CalendarEventTimesChangedEvent): void {
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

  closeOpenMonthViewDay(): void {
    this.activeDayIsOpen = false;
  }
}
