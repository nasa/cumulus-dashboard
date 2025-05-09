import {
  shouldBeLoggedIn,
  shouldBeRedirectedToLogin,
  shouldHaveNoToken,
  shouldHaveDeletedToken
} from '../support/assertions';

import { API_VERSION } from '../../app/src/js/actions/types';

// granules and executions were updated before this epoch time
const ingestEndTime = 1545091200000; // 2018-12-18

describe('Dashboard Home Page', () => {
  it('When not logged in it should redirect to login page', () => {
    cy.visit('/');
    shouldBeRedirectedToLogin();
    shouldHaveNoToken();
  });

  it('Logging in successfully redirects to the Dashboard main page', () => {
    cy.visit('/');
    cy.get('div[class=modal-content]').within(() => {
      cy.get('a').click();
    });

    shouldBeLoggedIn();
    cy.get('nav')
      .contains('Collections')
      .should('have.attr', 'href')
      .and('include', '/collections');
    cy.get('nav')
      .contains('Rules')
      .should('have.attr', 'href')
      .and('include', '/rules');
  });

  it('Logs in successfully after failed login', () => {
    // simulate failed login
    cy.visit('/auth')
      .window().then((window) => {
        window.location.search = 'token=failed-token';
      });

    cy.get('div[class=modal-content]').within(() => {
      cy.get('a').click({ force: true });
    });

    shouldBeLoggedIn();
  });

  describe('When logged in', () => {
    before(() => {
      cy.visit('/');
      cy.task('resetState');
    });

    beforeEach(() => {
      cy.login();
      cy.visit('/');
    });

    it('displays a compatible Cumulus API Version number', () => {
      const apiVersionNumber = 'a.b.c-d.e';
      cy.window().its('appStore').then((store) => {
        store.dispatch({
          type: API_VERSION,
          payload: { versionNumber: apiVersionNumber }
        });

        // Using regex to match any version format like x.y.z-type.n
        cy.get('.footer__version')
          .find('.api__version')
          .invoke('text')
          .should('match', /API v\d+\.\d+\.\d+-[a-zA-Z]+\.\d+/);
      });
    });

    it('displays metrics overview with default 24-hour time range', () => {
      const now = Date.now();
      cy.clock(now);

      cy.visit('/');

      // Check that metrics overview section exists
      cy.get('#metricsOverview').within(() => {
        cy.get('.heading--large').should('contain', 'Metrics Overview');
        // Verify tooltip exists
        cy.get('.fa-info-circle').should('exist');
      });

      // Verify metrics are displayed
      cy.get('#Errors').should('exist');
      cy.get('#Collections').should('exist');
      cy.get('#Granules').should('exist');
      cy.get('#Executions').should('exist');
      cy.get('[id="Ingest Rules"]').should('exist');
    });

    it('Updates start and end time components when dropdown is selected', () => {
      const now = Date.UTC(2009, 0, 5, 13, 35, 3); // 2009-01-05T13:35:03.000Z
      cy.clock(now);

      cy.get('main[class=main] section').within(() => {
        cy.get('h3').should('have.text', 'Date and Time Range');
        cy.setDatepickerDropdown('1 week');

        cy.url().should('include', 'startDateTime=20081229133500');
        cy.url().should('include', 'endDateTime=20090105133500');

        cy.get('[data-cy=endDateTime]').within(() => {
          cy.get('.react-datetime-picker__inputGroup__year').should('have.value', '2009');
          cy.get('.react-datetime-picker__inputGroup__month').should('have.value', '1');
          cy.get('.react-datetime-picker__inputGroup__day').should('have.value', '5');
          cy.get('.react-datetime-picker__inputGroup__hour').should('have.value', '1');
          cy.get('.react-datetime-picker__inputGroup__minute').should('have.value', '35');
        });

        cy.get('[data-cy=startDateTime]').within(() => {
          cy.get('.react-datetime-picker__inputGroup__year').should('have.value', '2008');
          cy.get('.react-datetime-picker__inputGroup__month').should('have.value', '12');
          cy.get('.react-datetime-picker__inputGroup__day').should('have.value', '29');
          cy.get('.react-datetime-picker__inputGroup__hour').should('have.value', '1');
          cy.get('.react-datetime-picker__inputGroup__minute').should('have.value', '35');
        });

        // URL doesn't change based on hour format
        cy.get('[data-cy=hourFormat]').within(() => {
          cy.get('.datetime.selector__hrformat').click();
          cy.contains('div[id*="react-select"]', '24HR').click();
          cy.url().should('include', 'startDateTime=20081229133500');
          cy.url().should('include', 'endDateTime=20090105133500');
        });
        // Displayed Hour does change.
        cy.get('[data-cy=startDateTime]').within(() => {
          cy.get('.react-datetime-picker__inputGroup__hour').should('have.value', '13');
        });
      });
    });

    it('should retain query parameters when moving between pages.', () => {
      const now = Date.UTC(2009, 0, 5, 13, 35, 3); // 2009-01-05T13:35:03.000Z
      cy.clock(now);

      cy.get('main[class=main] section').within(() => {
        cy.get('h3').should('have.text', 'Date and Time Range');
        cy.setDatepickerDropdown('1 week');
      });

      // Verify initial parameters are set
      cy.url().should('include', 'startDateTime=20081229133500');
      cy.url().should('include', 'endDateTime=20090105133500');

      // Navigate to granules with these same parameters
      cy.visit('/granules/all?startDateTime=20081229133500&endDateTime=20090105133500');

      // Verify URL parameters are maintained on granules page
      cy.url().should('include', 'granules/all');
      cy.url().should('include', 'startDateTime=20081229133500');
      cy.url().should('include', 'endDateTime=20090105133500');

      // Check parameters are retained when returning to home page
      cy.get('.logo > a').click();

      // Verify URL parameters are maintained after returning to home
      cy.url().should('include', 'startDateTime=20081229133500');
      cy.url().should('include', 'endDateTime=20090105133500');
    });

    it('Accepts dates entered on the date picker.', () => {
      cy.get('[data-cy=startDateTime]').within(() => {
        cy.get('input[name=month]').click().type(3);
        cy.get('input[name=day]').click().type(17);
        cy.get('input[name=year]').click().type(2009);
        cy.get('input[name=hour12]').click().type(3);
        cy.get('input[name=minute]').click().type(37);
        cy.get('input[name=minute]').should('have.value', '37');
        cy.get('select[name=amPm]').select('PM');
      });

      cy.url().should('include', 'startDateTime=20090317153700');

      cy.get('[data-cy=datetime-clear]').click();
      cy.url().should('not.include', 'startDateTime=20090317153700');
      cy.get('[data-cy=startDateTime]').within(() => {
        cy.get('input[name=month]').should('have.value', '');
        cy.get('input[name=day]').should('have.value', '');
        cy.get('input[name=year]').should('have.value', '');
        cy.get('input[name=hour12]').should('have.value', '');
      });
    });

    it('modifies the UPDATES section and Granules Errors list as datepicker changes.', () => {
      cy.intercept('GET', '/stats?*timestamp__from=*&timestamp__to=*').as('stats');

      cy.clock(ingestEndTime);
      cy.setDatepickerDropdown('3 months');

      cy.get('#Errors').contains('2');
      cy.get('#Collections').contains('2');
      cy.get('#Granules').contains('12');
      cy.get('#Executions').contains('9');
      cy.get('[id="Ingest Rules"]').contains('1');

      // Test there are values in Granule Error list
      cy.get('[data-value="0"]').contains('Error');
      cy.get('[data-value="1"]').contains('Error');

      cy.clock().invoke('restore');

      cy.get('[data-cy=startDateTime]').within(() => {
        cy.get('input[name=month]').click().type(1);
        cy.get('input[name=day]').click().type(31);
        cy.get('input[name=year]').click().type(2009);
        cy.get('input[name=hour12]').click().type(0);
        cy.get('input[name=minute]').click().type(0);
        cy.get('select[name=amPm]').select('AM');
      });
      cy.get('[data-cy=endDateTime]').within(() => {
        cy.get('input[name=month]').click().type(5);
        cy.get('input[name=day]').click().type(1);
        cy.get('input[name=year]').click().type(2018);
        cy.get('input[name=hour12]').click().type(0);
        cy.get('input[name=minute]').click().type(0);
        cy.get('select[name=amPm]').select('AM');
      });

      cy.wait('@stats');
      cy.get('#Errors').contains('0');
      cy.get('#Collections').contains('0');
      cy.get('#Granules').contains('0');
      cy.get('#Executions').contains('0');
      cy.get('.overview-num__wrapper-home > ul > :nth-child(5)').contains('0');

      // Test the Granule Error list is empty
      cy.get('.table--wrapper > div > div.tbody').should('be.empty');
    });

    it('Logging out successfully redirects to the login screen', () => {
      // Logging to debug intermittent timeouts
      cy.task('log', 'Start test');

      cy.get('nav li').last().within(() => {
        cy.get('button').should('have.text', 'Log out');
      });

      cy.task('log', 'Click');

      cy.get('nav li').last().click();
      cy.url().should('include', '/auth');

      cy.task('log', 'Visit collections');

      cy.visit('collections');

      cy.url().should('not.include', '/collections');
      cy.url().should('include', '/auth');

      shouldHaveDeletedToken();
    });

    it('Does not add any time and date options to the URL.', () => {
      const now = Date.UTC(2009, 0, 5, 13, 35, 3);
      cy.clock(now);

      cy.visit('/');
      cy.url().should('not.include', 'startDateTime');
      cy.url().should('not.include', 'endDateTime');
    });

    it('should update the Datepicker with the params in the URL', () => {
      cy.visit('/');

      // Set start datetime
      cy.get('[data-cy=startDateTime]').within(() => {
        cy.get('input[name=month]').click().type(12);
        cy.get('input[name=day]').click().type(29);
        cy.get('input[name=year]').click().type(2008);
        cy.get('input[name=hour12]').click().type(1);
        cy.get('input[name=minute]').click().type(35);
        cy.get('select[name=amPm]').select('PM');
      });

      // Set end datetime
      cy.get('[data-cy=endDateTime]').within(() => {
        cy.get('input[name=month]').click().type(1);
        cy.get('input[name=day]').click().type(5);
        cy.get('input[name=year]').click().type(2009);
        cy.get('input[name=hour12]').click().type(1);
        cy.get('input[name=minute]').click().type(35);
        cy.get('select[name=amPm]').select('PM');
      });

      // Verify URL updates with both datetime parameters
      cy.url().should('include', 'startDateTime=20081229133500');
      cy.url().should('include', 'endDateTime=20090105133500');
    });

    describe('The Timer', () => {
      beforeEach(() => {
        cy.visit('/');
      });

      it('begins in the off state', () => {
        cy.get('[data-cy=toggleTimer]').contains('Start');
        cy.get('[data-cy=startStopLabel]').contains('Update');
      });
      it('retains its state during navigation.', () => {
        cy.get('[data-cy=toggleTimer]').contains('Start');
        cy.get('[data-cy=toggleTimer]').click();
        cy.get('[data-cy=toggleTimer]').contains('Stop');
        cy.get('[data-cy=startStopLabel]').contains('Next update in:');

        cy.get('nav').contains('Granules').click();

        cy.get('[data-cy=toggleTimer]').contains('Stop');
        cy.get('[data-cy=startStopLabel]').contains('Next update in:');

        cy.get('[data-cy=toggleTimer]').click();
        cy.get('[data-cy=startStopLabel]').contains('Update');
        cy.get('[data-cy=toggleTimer]').contains('Start');

        cy.get('.logo > a').click();
        cy.get('[data-cy=startStopLabel]').contains('Update');
        cy.get('[data-cy=toggleTimer]').contains('Start');
      });
    });
  });
});
