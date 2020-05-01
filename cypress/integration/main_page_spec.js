import {
  shouldBeLoggedIn,
  shouldBeRedirectedToLogin,
  shouldHaveNoToken,
  shouldHaveDeletedToken
} from '../support/assertions';

import { API_VERSION } from '../../app/src/js/actions/types';

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
      .window().then(function (window) {
        window.location.search = 'token=failed-token';
      });

    cy.get('div[class=modal-content]').within(() => {
      cy.get('a').click();
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
      cy.server();
      cy.route('POST', 'http://example.com/_search/', 'fixture:elasticsearch.json');
      cy.visit('/');
    });

    it('displays a compatible Cumulus API Version number', () => {
      const apiVersionNumber = 'a.b.c';
      cy.window().its('appStore').then((store) => {
        store.dispatch({
          type: API_VERSION,
          payload: { versionNumber: apiVersionNumber }
        });

        cy.get('h5[class=api__version]').should((apiVersionWrapper) => {
          expect(apiVersionWrapper.first()).to.contain(apiVersionNumber);
        });
      });
    });

    it('Updates start and end time components when dropdown is selected', () => {
      const now = Date.UTC(2009, 0, 5, 13, 35, 3); // 2009-01-05T13:35:03.000Z
      cy.clock(now);
      cy.get('main[class=main] section').within(() => {
        cy.get('h3').should('have.text', 'Date and Time Range');
        cy.get('[data-cy=datetime-dropdown]').as('dateRange');
        cy.get('@dateRange').select('1 week');

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
        cy.url().should('include', 'startDateTime=20081229133500');
        cy.url().should('include', 'endDateTime=20090105133500');

        // URL doesn't change based on hour format
        cy.get('[data-cy=hourFormat]').within(() => {
          cy.get('.datetime > select').select('24HR');
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
      const now = Date.UTC(2015, 2, 17, 16, 0, 0); // 2015-03-17T16:00:00.000Z
      cy.clock(now);
      cy.get('main[class=main] section').within(() => {
        cy.get('h3').should('have.text', 'Date and Time Range');
        cy.get('[data-cy=datetime-dropdown]').as('dateRange');
        cy.get('@dateRange').select('1 hour');

        cy.url().should('include', 'startDateTime=201503171500');
        cy.url().should('include', 'endDateTime=201503171600');
      });
      cy.get('nav').contains('Granules').click();
      cy.url().should('include', 'granules');
      cy.url().should('include', 'startDateTime=201503171500');
      cy.url().should('include', 'endDateTime=201503171600');

      cy.get('.logo > a').click();
      cy.url().should('include', 'startDateTime=201503171500');
      cy.url().should('include', 'endDateTime=201503171600');

      cy.get('[data-cy=endDateTime]').within(() => {
        cy.get('.react-datetime-picker__inputGroup__year').should('have.value', '2015');
        cy.get('.react-datetime-picker__inputGroup__month').should('have.value', '3');
        cy.get('.react-datetime-picker__inputGroup__day').should('have.value', '17');
        cy.get('.react-datetime-picker__inputGroup__hour').should('have.value', '4');
        cy.get('.react-datetime-picker__inputGroup__minute').should('have.value', '0');
      });

      cy.get('[data-cy=startDateTime]').within(() => {
        cy.get('.react-datetime-picker__inputGroup__year').should('have.value', '2015');
        cy.get('.react-datetime-picker__inputGroup__month').should('have.value', '3');
        cy.get('.react-datetime-picker__inputGroup__day').should('have.value', '17');
        cy.get('.react-datetime-picker__inputGroup__hour').should('have.value', '3');
        cy.get('.react-datetime-picker__inputGroup__minute').should('have.value', '0');
      });
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
      cy.route('GET', '/stats?*timestamp__from=1233360000000*').as('stats');

      cy.get('#Errors').contains('2');
      cy.get('#Collections').contains('1');
      cy.get('#Granules').contains('11');
      cy.get('#Executions').contains('6');
      cy.get('[id="Ingest Rules"]').contains('1');

      // Test there are values in Granule Error list
      cy.get('[data-value="0"]').contains('FileNotFound');
      cy.get('[data-value="1"]').contains('FileNotFound');

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
        cy.get('input[name=year]').click().type(2010);
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
      cy.get('.table--wrapper > form > div > div.tbody').should('be.empty');
    });

    it('modifies the Metrics section as datepicker changes', () => {
      // Cypress only allows one stub per url. We make multiple POST requests to the same
      // elasticsearch endpoint. The fixture here returns a combined response of all the
      // responses for one url, effectively stubbing our elasticsearch searches.
      cy.get('.overview-num__wrapper-home > ul#distributionErrors > :nth-child(5)').contains('0');
      cy.get('.overview-num__wrapper-home > ul#distributionErrors > :nth-child(4)').contains('2');
      cy.get('.overview-num__wrapper-home > ul#distributionErrors > :nth-child(3)').contains('4');
      cy.get('.overview-num__wrapper-home > ul#distributionErrors > :nth-child(2)').contains('8');
      cy.get('.overview-num__wrapper-home > ul#distributionErrors > :nth-child(1)').contains('6');

      cy.get('.overview-num__wrapper-home > ul#distributionSuccesses > :nth-child(5)').contains('1');
      cy.get('.overview-num__wrapper-home > ul#distributionSuccesses > :nth-child(4)').contains('3');
      cy.get('.overview-num__wrapper-home > ul#distributionSuccesses > :nth-child(3)').contains('5');
      cy.get('.overview-num__wrapper-home > ul#distributionSuccesses > :nth-child(2)').contains('9');
      cy.get('.overview-num__wrapper-home > ul#distributionSuccesses > :nth-child(1)').contains('7');

      cy.route('POST', 'http://example.com/_search/', 'fixture:updated_elasticsearch.json');

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
        cy.get('input[name=year]').click().type(2010);
        cy.get('input[name=hour12]').click().type(0);
        cy.get('input[name=minute]').click().type(0);
        cy.get('select[name=amPm]').select('AM');
      });

      cy.get('.overview-num__wrapper-home > ul#distributionErrors > :nth-child(5)').contains('10');
      cy.get('.overview-num__wrapper-home > ul#distributionErrors > :nth-child(4)').contains('12');
      cy.get('.overview-num__wrapper-home > ul#distributionErrors > :nth-child(3)').contains('14');
      cy.get('.overview-num__wrapper-home > ul#distributionErrors > :nth-child(2)').contains('18');
      cy.get('.overview-num__wrapper-home > ul#distributionErrors > :nth-child(1)').contains('16');

      cy.get('.overview-num__wrapper-home > ul#distributionSuccesses > :nth-child(5)').contains('11');
      cy.get('.overview-num__wrapper-home > ul#distributionSuccesses > :nth-child(4)').contains('13');
      cy.get('.overview-num__wrapper-home > ul#distributionSuccesses > :nth-child(3)').contains('15');
      cy.get('.overview-num__wrapper-home > ul#distributionSuccesses > :nth-child(2)').contains('19');
      cy.get('.overview-num__wrapper-home > ul#distributionSuccesses > :nth-child(1)').contains('17');
    });

    it('Logging out successfully redirects to the login screen', () => {
      // Logging to debug intermittent timeouts
      cy.task('log', 'Start test');

      cy.get('nav li').last().within(() => {
        cy.get('a').should('have.text', 'Log out');
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

    it('adds the default datepicker options to the URL', () => {
      const now = Date.UTC(2009, 0, 5, 13, 35, 3);
      cy.clock(now);

      cy.visit('/?new_session=true');
      cy.url().should('include', 'startDateTime=20090104133500');
    });
  });
});
