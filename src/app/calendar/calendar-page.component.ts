import {ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {addDays, addHours, endOfDay, endOfMonth, isSameDay, isSameMonth, startOfDay, subDays} from 'date-fns';
import {Subject, Subscription} from 'rxjs';
import {environment} from '../../environments/environment';
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
import {DataStorageService} from '../services/data-storage.service';
import {UserInfoService} from '../services/user-info.service';
import {UserInfoModel} from '../models/user-info.model';
import {CustomDateFormatter} from './custom-date-formatter.provider';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../services/auth.service';

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
  // reservations
  reservations: ReservationsModel[] = [];
  reservationsSub: Subscription = new Subscription();
  // user info
  userInfo: UserInfoModel[] = [];
  userInfoSub = new Subscription();
  // form
  addResForm: FormGroup;

  constructor(private modal: NgbModal,
              private dataStorageService: DataStorageService,
              private reservationsService: ReservationsService,
              private authService: AuthService,
              private userInfoService: UserInfoService) {
    this.addResForm = new FormGroup(
      {
        user: new FormControl('', Validators.required),
        start_date: new FormControl('', Validators.required),
        end_date: new FormControl('', Validators.required)
      }
    );
  }

  ngOnInit(): void {
    this.reservationsSub = this.reservationsService.reservationsChanges
      .subscribe(
        async (reservations: ReservationsModel[]) => {
          if (environment.environment === 'mock') {
            reservations = this.updateLocalData(reservations);
          }
          this.events = [];
          for (const res of reservations) {
            this.addEvent(await this.convertReservationToEvent(res));
          }
          this.reservations = reservations;
        }
      );
    // when the user's cognito information is loaded in, set the user's guid in the form
    this.userInfoSub = this.userInfoService.userInfoChanges
      .subscribe((userInfo: any) => {
        this.addResForm.controls.user.setValue(userInfo.Username);
      });
    this.dataStorageService.fetchReservations().subscribe();
    this.reservations = this.reservationsService.getReservations();
  }

  addFromForm(): void {
    // todo check with reservation service to make sure its still available
    // if so, convert Form to ReservationModel
    const resModel: ReservationsModel = {
      reservation_guid: '0',
      user_guid: this.userInfoService.currentUserCognitoInfo.Username,
      display_name: this.userInfoService.currentUserDisplayName,
      epoch_start: (new Date(this.addResForm.value.start_date)).getTime() / 1000,
      epoch_end: (new Date(this.addResForm.value.end_date)).getTime() / 1000,
    };
    if (this.reservationsService.validateReservation(resModel)) {
      this.dataStorageService.storeReservation(resModel);
    } else {
      // todo error message
      return;
    }
  }

  async convertReservationToEvent(res: ReservationsModel): Promise<CalendarEvent> {
    const resUserInfo = await this.userInfoService.getUserDynamoInfo(res.user_guid);
    console.warn(resUserInfo);
    return {
      id: res.reservation_guid,
      start: startOfDay(new Date(res.epoch_start * 1000)),
      end: startOfDay(new Date(res.epoch_end * 1000)),
      title: `Reservation for ${res.display_name}`,
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
    };
  }

  disableDelete(event: CalendarEvent): boolean {
    const res = this.getReservationFromEvent(event);
    return res.user_guid !== this.userInfoService.currentUserCognitoInfo.Username;
  }

  getReservationFromEvent(event: CalendarEvent): ReservationsModel {
    const res = this.reservations.filter((r) => r.reservation_guid === event.id);
    // todo some error handling maybe
    return res[0];
  }

  addEvent(newEvent: CalendarEvent): void {
    this.events = [
      ...this.events,
      newEvent,
    ];
    this.refresh.next(0);
  }

  deleteEvent(eventToDelete: CalendarEvent): void {
    this.dataStorageService.deleteReservation(this.getReservationFromEvent(eventToDelete));
  }

  /*
    Helper Functions Below
   */

  updateLocalData(rawData: ReservationsModel[]): ReservationsModel[] {
    // for res_0, will do current_time-5days to current_time-2days;
    rawData[0].epoch_start = subDays(new Date(), 5).getTime() / 1000;
    rawData[0].epoch_end = subDays(new Date(), 2).getTime() / 1000;
    // for res_1 will do current_time-2days to current_time+4days;
    rawData[1].epoch_start = subDays(new Date(), 2).getTime() / 1000;
    rawData[1].epoch_end = addDays(new Date(), 4).getTime() / 1000;
    // for res_2 will do current_time+1day to current_time+10days;
    rawData[2].epoch_start = addDays(new Date(), 1).getTime() / 1000;
    rawData[2].epoch_end = addDays(new Date(), 10).getTime() / 1000;
    return rawData;
  }

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
