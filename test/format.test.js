const { format } = require('../index');
const parseISO = require('date-fns/parseISO');

describe('format', () => {
  test('unit hours', () => {
    const message = format(
      [
        {
          icon: 'man',
          events: [
            {
              title: 'あいうえおあいうえおあいうえお',
              start: parseISO('2020-01-01 13:00'),
              end: parseISO('2020-01-01 14:00')
            },
            {
              title: 'HOGEHOGEHOGEHOGE',
              start: parseISO('2020-01-01 14:00'),
              end: parseISO('2020-01-01 15:00')
            },
            {
              title: 'FUGAFUGA',
              start: parseISO('2020-01-01 15:00'),
              end: parseISO('2020-01-01 16:00')
            }
          ]
        }
      ],
      {
        currentTime: parseISO('2020-01-01 14:10'),
        beforeHours: 1,
        afterHours: 1
      }
    );

    expect(message).toBe('|　　|　　　 13:00 　　　|　　　 14:00 　　　|　　　 15:00 　　　|\n:man: > `あいうえおあいうえおあ.` `HOGEHOGEHOGEHOGE .` `FUGAFUGA         .` ');
  });

  test('unit minutes', () => {
    const message = format(
      [
        {
          icon: 'man',
          events: [
            {
              title: 'あいうえおあいうえおあいうえお',
              start: parseISO('2020-01-01 13:00'),
              end: parseISO('2020-01-01 13:15')
            },
            {
              title: 'HOGEHOGEHOGEHOGE',
              start: parseISO('2020-01-01 14:00'),
              end: parseISO('2020-01-01 14:30')
            },
            {
              title: 'FUGAFUGA',
              start: parseISO('2020-01-01 15:00'),
              end: parseISO('2020-01-01 15:45')
            }
          ]
        }
      ],
      {
        currentTime: parseISO('2020-01-01 14:20'),
        beforeHours: 1,
        afterHours: 1
      }
    );

    expect(message).toBe('|　　|　　　 13:00 　　　|　　　 14:00 　　　|　　　 15:00 　　　|\n:man: > `あ.`                            `HOGEHOGE.`                   `FUGAFUGA    .` ');
  });

  test('parallel', () => {
    const message = format(
      [
        {
          icon: 'man',
          events: [
            {
              title: 'ごはんを食べる',
              start: parseISO('2020-01-01 13:00'),
              end: parseISO('2020-01-01 14:00')
            },
            {
              title: '昼寝をする',
              start: parseISO('2020-01-01 14:00'),
              end: parseISO('2020-01-01 14:30')
            },
            {
              title: 'メールを確認する',
              start: parseISO('2020-01-01 13:45'),
              end: parseISO('2020-01-01 14:00')
            },
            {
              title: '会議',
              start: parseISO('2020-01-01 14:00'),
              end: parseISO('2020-01-01 15:00')
            }
          ]
        }
      ],
      {
        currentTime: parseISO('2020-01-01 14:00'),
        beforeHours: 1,
        afterHours: 1
      }
    );

    expect(message).toBe('|　　|　　　 13:00 　　　|　　　 14:00 　　　|　　　 15:00 　　　|\n:man: > `ごはんを食べる      .` `昼寝をする` \n　    　                           `メー` `会議              .` ');
  });

});

const debug = (val) => {
  console.log('[DEBUG]', JSON.stringify(val, null, 2));
};
